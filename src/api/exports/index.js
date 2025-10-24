import { ExportsHandler } from "./handler.js";
import { routes } from "./routes.js";

export const _exports = {
  name: "exports",
  version: "1.0.0",
  register: async (server, { validator, service, playlistsService }) => {
    const exportsHandler = new ExportsHandler(
      validator,
      service,
      playlistsService
    );

    server.route(routes(exportsHandler));
  },
};
