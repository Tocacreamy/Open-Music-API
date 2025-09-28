"use strict";
import Hapi from "@hapi/hapi";
import "dotenv/config";
import { songs } from "../api/songs/index.js";
import { albums } from "../api/albums/index.js";
import { AlbumsValidator } from "../validator/albums/index.js";
import { SongsValidator } from "../validator/songs/index.js";

const init = async () => {
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
      },
    },
    {
      plugin: songs,
      options: {
        validator: SongsValidator,
      },
    },
  ]);

  await server.start();

  console.log(`server berjalan pada`, server.info.uri);
};

init();
