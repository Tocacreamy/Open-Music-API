import { ExportsHandler } from "./handler.js";
import { routes } from "./routes.js";

export const exports = {
  name: "exports",
  version: "1.0.0",
  register: async (server, { validator, exportsService, playlistsService }) => {
    const exportsHandler = new ExportsHandler(
      validator,
      exportsService,
      playlistsService
    );

    server.route(routes(exportsHandler));
  },
};
