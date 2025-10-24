"use strict";
import Hapi from "@hapi/hapi";
import "dotenv/config";
import Jwt from "@hapi/jwt";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import inert from "@hapi/inert";

// songs
import { songs } from "../api/songs/index.js";
import { SongsValidator } from "../validator/songs/index.js";
import SongsService from "../services/postgres/SongsService.js";

// albums
import { albums } from "../api/albums/index.js";
import { AlbumsValidator } from "../validator/albums/index.js";
import AlbumsService from "../services/postgres/AlbumsService.js";

// users
import { users } from "../api/users/index.js";
import { UsersService } from "../services/postgres/UsersService.js";
import { UsersValidator } from "../validator/users/index.js";

// authentications
import { authentications } from "../api/authentications/index.js";
import { AuthenticationsValidator } from "../validator/authentications/index.js";
import { AuthenticationsService } from "../services/postgres/AuthenticationsService.js";
import { TokenManager } from "../tokenize/TokenManager.js";

// playlists
import { playlists } from "../api/playlists/index.js";
import { PlaylistsValidator } from "../validator/playlists/index.js";
import { PlaylistsService } from "../services/postgres/PlaylistsService.js";
import { PlaylistSongsService } from "../services/postgres/PlaylistSongsService.js";

// collaborations
import { collaborations } from "../api/collaborations/index.js";
import { CollaborationsValidator } from "../validator/collaborations/index.js";
import { CollaborationsService } from "../services/postgres/CollaborationsService.js";

// exports
import { _exports } from "../api/exports/index.js";
import { ExportsValidator } from "../validator/exports/index.js";
import { ProducerService } from "../services/rabbitmq/ProducerService.js";

// uploads
import { UploadsValidator } from "../validator/uploads/index.js";
import { StorageService } from "../services/storage/StorageService.js";

// likes
import { likes } from "../api/likes/index.js";
import { LikesService } from "../services/postgres/LikesService.js";

// Redis
import { CacheService } from "../services/redis/CacheService.js";

// exceptions
import ClientError from "../exceptions/ClientError.js";

const init = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const cacheService = new CacheService();
  const songsService = new SongsService();
  const albumService = new AlbumsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService();
  const collaborationsService = new CollaborationsService();
  const likesService = new LikesService(cacheService);

  const uploadDir = path.resolve(__dirname, "../api/albums/covers/images");
  fs.mkdirSync(uploadDir, { recursive: true });
  const storageService = new StorageService(uploadDir);

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: inert,
    },
  ]);

  server.auth.strategy("openmusic_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        validator: AlbumsValidator,
        service: albumService,
        storageService,
        UploadsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        validator: SongsValidator,
        service: songsService,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        playlistSongsService: playlistSongsService,
        songsService: songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        usersService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        validator: ExportsValidator,
        service: ProducerService,
        playlistsService: playlistsService,
      },
    },
    {
      plugin: likes,
      options: {
        likesService,
        albumsService: albumService,
        usersService,
      },
    }
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if ( response.output?.statusCode === 415) {
      return h
        .response({ status: "fail", message: "unsuported media file" })
        .code(400);
    }

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();

  console.log(`server berjalan pada`, server.info.uri);
};

init();
