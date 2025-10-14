"use strict";
import Hapi from "@hapi/hapi";
import "dotenv/config";
import Jwt from "@hapi/jwt";

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
import { PlaylistsValidator } from "../validator/playlist/index.js";
import { PlaylistsService } from "../services/postgres/PlaylistsService.js";
import { PlaylistSongsService } from "../services/postgres/PlaylistSongsService.js";

// exceptions
import ClientError from "../exceptions/ClientError.js";

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService();

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
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
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
