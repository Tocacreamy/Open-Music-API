import { LikesHandler } from "./handler.js";
import { routes } from "./routes.js";

export const likes = {
  name: "likes",
  version: "1.0.0",
  register: async (server, { likesService, albumsService, usersService }) => {
    const likesHandler = new LikesHandler(
      likesService,
      albumsService,
      usersService
    );
    server.route(routes(likesHandler));
  },
};
