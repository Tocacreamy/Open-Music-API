export class AlbumsHandler {
  constructor(validator) {
    this._validator = validator;
  }

  postAlbum = async (request, h) => {
    //validator
    this._validator.validateAlbumPayload(request.payload);
    //  service &

    const albumId = 5;
    const response = h.response({
      status: "success",
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  };

  getAlbumById = async (request, h) => {
    // service
    const album = "Tangerine";
    const response = h.response({
      status: "success",
      data: {
        album,
      },
    });
    response.code(200);
    return response;
  };

  putAlbumById = async (request, h) => {
    // validator
    this._validator.validateAlbumPayload(request.payload);
    // & service

    const response = h.response({
      status: "success",
      message: "Album successfully updated",
    });
    response.code(200);
    return response;
  };

  deleteAlbumById = async (request, h) => {
    // service

    const response = h.response({
      status: "success",
      message: "Album successfully deleted",
    });
    response.code(200);
    return response;
  };

  // OPSIONAL

  getSongsByAlbumDetail = async (request, h) => {};
}
