export class SongsHandler {
  constructor(validator) {
    this._validator = validator;
  }

  postSong = async (request, h) => {
    //  validation
    this._validator.validateSongPayload(request.payload);
    // service

    const songId = 2;
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
    const songs = "Jentaka";
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
    const song = "Reawakening";
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
    
    const response = h.response({
      status: "success",
      message: "song has successfully updated",
    });
    response.code(200);
    return response;
  };

  deleteSongById = async (request, h) => {
    // service

    const response = h.response({
      status: "success",
      message: "song has successfully deleted",
    });
    response.code(200);
    return response;
  };

  // OPTIONAL

  getSongByQuery = async (request, h) => {
    return "opsional";
  };
}
