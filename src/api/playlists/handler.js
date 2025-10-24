export class PlaylistsHandler {
  constructor(service, playlistSongsService, songsService, validator) {
    this._service = service;
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  postPlaylistHandler = async (request, h) => {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({
      name,
      owner: credentialId,
    });

    const response = h.response({
      status: "success",
      message: "Playlist berhasil ditambahkan",
      data: {
        playlistId,
      },
    });
    response.code(201);
    return response;
  };

  getPlaylistsHandler = async (request, h) => {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this._service.getPlaylists(credentialId);
    const response = h.response({
      status: "success",
      data: {
        playlists,
      },
    });
    response.code(200);
    return response;
  };

  deletePlaylistHandler = async (request, h) => {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylist(playlistId);

    const response = h.response({
      status: "success",
      message: "Playlist berhasil dihapus",
    });
    response.code(200);

    return response;
  };

  postPlaylistSongHandler = async (request, h) => {
    this._validator.validatePostSongToPlaylistPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._service.getPlaylistById(playlistId);
    await this._songsService.getSongById(songId);
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.addSongToPlaylist(
      playlistId,
      songId,
      credentialId
    );
    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
    response.code(201);

    await this._service.addPlaylistSongActivity(
      playlistId,
      songId,
      credentialId,
      "add"
    );
    return response;
  };

  getPlaylistSongsHandler = async (request, h) => {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._playlistSongsService.getSongsFromPlaylist(
      playlistId,
      credentialId
    );
    const response = h.response({
      status: "success",
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  };

  deletePlaylistSongHandler = async (request, h) => {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    const { songId: songId } = request.payload;

    await this._validator.validateDeleteSongFromPlaylistPayload(
      request.payload
    );
    await this._service.getPlaylistById(playlistId);
    await this._songsService.getSongById(songId);
    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.deleteSongFromPlaylist(
      playlistId,
      songId,
      credentialId
    );
    const response = h.response({
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    });
    response.code(200);
    await this._service.addPlaylistSongActivity(
      playlistId,
      songId,
      credentialId,
      "delete"
    );
    return response;
  };

  getPlaylistActivitiesHandler = async (request, h) => {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._service.verifyPlaylistAccess(playlistId, credentialId);
    const activities = await this._service.getPlaylistActivities(playlistId);
    const response = h.response({
      status: "success",
      data: {
        playlistId,
        activities,
      },
    });
    response.code(200);
    return response;
  };
}
