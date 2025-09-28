export class SongsHandler {
  constructor(validator) {
    this._validator = validator;
  }

  postSong = async (request, h) => {
    //  validation
    this._validator.validateSongPayload(request.payload);
    // service
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

  getSongs = async () => {
    // service
    const songs = await this._service.getSongs();

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
    // service
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
    // validation
    this._validator.validateSongPayload(request.payload);
    // service
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
    // service
    const { id } = request.params;
    await this._service.deleteSongById(id);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil dihapus",
    });
    response.code(200);
    return response;
  };

  // OPTIONAL

  // getSongByQuery = async (request, h) => {
  //   return "opsional";
  // };
}
