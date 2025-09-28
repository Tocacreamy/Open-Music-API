"use strict";
import Hapi from "@hapi/hapi";
import "dotenv/config";
import { songs } from "../api/songs/index.js";
import { albums } from "../api/albums/index.js";
import { AlbumsValidator } from "../validator/albums/index.js";
import { SongsValidator } from "../validator/songs/index.js";
import AlbumsService from "../services/postgres/AlbumsService.js";
import SongsService from "../services/postgres/SongsService.js";
import ClientError from "../exceptions/ClientError.js";

const init = async () => {
  const songsService = new SongsService();
  const albumService = new AlbumsService();

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
