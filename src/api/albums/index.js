import { AlbumsHandler } from "./handler.js";
import { routes } from "./routes.js";

export const albums = {
  name: "albums",
  version: "1.0.0",
  register: async (server, { validator,service, storageService, UploadsValidator }) => {
    const albumsHandler = new AlbumsHandler(validator,service, storageService, UploadsValidator);
    server.route(routes(albumsHandler));
  },
};
