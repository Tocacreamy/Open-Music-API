export class AlbumsHandler {
  constructor(validator, service) {
    this._validator = validator;
    this._service = service;
  }

  postAlbum = async (request, h) => {
    //validator
    this._validator.validateAlbumPayload(request.payload);
    //  service
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

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
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);

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
    const { id } = request.params;
    await this._service.editAlbumById(id, request.payload);

    const response = h.response({
      status: "success",
      message: "Album berhasil diupdate",
    });
    response.code(200);
    return response;
  };

  deleteAlbumById = async (request, h) => {
    // service
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: "success",
      message: "Album berhasil dihapus",
    });
    response.code(200);
    return response;
  };

  // OPSIONAL

  // getSongsByAlbumDetail = async (request, h) => {};
}
