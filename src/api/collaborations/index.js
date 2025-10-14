import { CollaborationsHandler } from './handler.js';
import { routes } from './routes.js';

export const collaborations = {
    name: 'collaborations',
    version: '1.0.0',
    register: async (server, { collaborationsService, usersService, playlistsService, validator }) => {
        const collaborationsHandler = new CollaborationsHandler(collaborationsService, usersService, playlistsService, validator);
        server.route(routes(collaborationsHandler));
    }
};
