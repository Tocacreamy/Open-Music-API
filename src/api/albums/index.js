import { AlbumsHandler } from "./handler.js";
import { routes } from "./routes.js";

export const albums = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { validator,service }) => {
    const albumsHandler = new AlbumsHandler(validator,service);
    server.route(routes(albumsHandler));
  },
};
