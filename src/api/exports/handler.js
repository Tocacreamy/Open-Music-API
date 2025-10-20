export class ExportsHandler {
  constructor(validator, service, playlistService) {
    this._validator = validator;
    this._service = service;
    this._playlistService = playlistService;
  }

  postExportPlaylistHandler = async (request, h) => {
    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._validator.validateExportPlaylistPayload(request.payload);
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail,
    };
    await this._service.sendMessage(
      "export:playlists",
      JSON.stringify(message)
    );

    const response = h.response({
      status: "success",
      message: "Permintaan Anda dalam antrean",
    });
    response.code(201);
    return response;
  };
}
