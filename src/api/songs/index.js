import { SongsHandler } from "./handler.js";
import { routes } from "./routes.js";

export const songs = {
  name: "songs",
  version: "1.0.0",
  register: async (server,{validator,service}) => {
    const songsHandler = new SongsHandler(validator,service);
    server.route(routes(songsHandler));
  },
};
