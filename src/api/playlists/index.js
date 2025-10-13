import { PlaylistsHandler } from './handler.js';
import { routes } from './routes.js';
export const playlists = {
    name: 'playlists',
    version: '1.0.0',
    register: async (server, { playlistsService, playlistSongsService, songsService, validator }) => {
        const playlistsHandler = new PlaylistsHandler(playlistsService, playlistSongsService, songsService, validator);
        server.route(routes(playlistsHandler));
    }
};
