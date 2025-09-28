"use strict";
import Hapi from "@hapi/hapi";
import "dotenv/config";
import { songs } from "../api/songs/index.js";
import { albums } from "../api/albums/index.js";
import { AlbumsValidator } from "../validator/albums/index.js";
import { SongsValidator } from "../validator/songs/index.js";
import AlbumsService from "../services/postgres/AlbumsService.js";
import SongsService from "../services/postgres/SongsService.js";

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

  await server.start();

  console.log(`server berjalan pada`, server.info.uri);
};

init();
