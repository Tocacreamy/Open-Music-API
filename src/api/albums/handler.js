export class AlbumsHandler {
  constructor(validator, service, storageService, UploadsValidator) {
    this._validator = validator;
    this._service = service;
    this._storageService = storageService;
    this._uploadsValidator = UploadsValidator;
  }

  postAlbum = async (request, h) => {
    this._validator.validateAlbumPayload(request.payload);

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
    const { id: albumId } = request.params;
    const { id, name, year, cover: coverUrl } = await this._service.getAlbumById(albumId);

    const response = h.response({
      status: "success",
      data: {
        album: {
          id,
          name,
          year,
          coverUrl,
        },
      },
    });
    response.code(200);
    return response;
  };

  putAlbumById = async (request, h) => {
    this._validator.validateAlbumPayload(request.payload);

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
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    const response = h.response({
      status: "success",
      message: "Album berhasil dihapus",
    });
    response.code(200);
    return response;
  };

  postUploadCoverAlbumHandler = async (request, h) => {
    const { data } = request.payload;
    this._uploadsValidator.validateImageHeaders(data.hapi.headers);

    await this._storageService.writeFile(data, data.hapi);

    const fileLocation = await this._storageService.getFileLocation(data.hapi.filename);
    await this._service.updateAlbumCover(request.params.id, fileLocation);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });

    response.code(201);
    return response;
  };
}
