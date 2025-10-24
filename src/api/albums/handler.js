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
    const album = await this._service.getAlbumById(albumId);

    // Build full URL only if cover exists
    const coverUrl = album.cover
      ? `http://${process.env.HOST}:${process.env.PORT}/albums/covers/${album.cover}`
      : null;

    const response = h.response({
      status: "success",
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          coverUrl,
          songs: album.songs,
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
    const { cover } = request.payload;
    this._uploadsValidator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);

    await this._service.updateAlbumCover(request.params.id, filename);

    const response = h.response({
      status: "success",
      message: "Sampul berhasil diunggah",
    });

    response.code(201);
    return response;
  };
}
