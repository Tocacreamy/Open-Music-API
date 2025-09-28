export class SongsHandler {
  constructor(validator, service) {
    this._validator = validator;
    this._service = service;
  }

  postSong = async (request, h) => {
    this._validator.validateSongPayload(request.payload);

    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: "success",
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  };

  getSongs = async (request, h) => {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs({ title, performer });

    const response = h.response({
      status: "success",
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  };

  getSongById = async (request, h) => {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    const response = h.response({
      status: "success",
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  };

  putSongById = async (request, h) => {
    this._validator.validateSongPayload(request.payload);

    const { id } = request.params;
    await this._service.editSongById(id, request.payload);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil diupdate",
    });
    response.code(200);
    return response;
  };

  deleteSongById = async (request, h) => {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil dihapus",
    });
    response.code(200);
    return response;
  };
}
