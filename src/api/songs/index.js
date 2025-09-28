import { SongsHandler } from "./handler.js";
import { routes } from "./routes.js";

export const songs = {
  name: "songs",
  version: "1.0.0",
  register: async (server,{validator}) => {
    const songsHandler = new SongsHandler(validator);
    server.route(routes(songsHandler));
  },
};
