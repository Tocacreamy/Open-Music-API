export class CollaborationsHandler {
  constructor(
    collaborationsService,
    usersService,
    playlistsService,
    validator
  ) {
    this._collaborationsService = collaborationsService;
    this._usersService = usersService;
    this._playlistsService = playlistsService;
    this._validator = validator;
  }

  postCollaborationHandler = async (request, h) => {
    this._validator.validateCollaborationPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._usersService.getUserById(userId);
    const collaborationId = await this._collaborationsService.addCollaboration(userId, playlistId);
    const response = h.response({
      status: "success",
      message: "Kolaborasi berhasil ditambahkan",
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  };

  deleteCollaborationHandler = async (request, h) => {
    this._validator.validateCollaborationPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { playlistId, userId } = request.payload;

    await this._usersService.getUserById(userId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(userId, playlistId);

    const response = h.response({
      status: "success",
      message: "Kolaborasi berhasil dihapus",
    });
    response.code(200);
    return response;
  };
}
