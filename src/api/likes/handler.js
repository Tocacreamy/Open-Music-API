export class LikesHandler {
  constructor(likesService, albumsService, usersService) {
    this._likesService = likesService;
    this._albumsService = albumsService;
    this._usersService = usersService;
  }
  postLikeAlbumHandler = async (request, h) => {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._likesService.addLike(albumId, userId);
    const response = h
      .response({
        status: "success",
        message: "Like added successfully",
      })
      .code(201);
    return response;
  };

  getLikeAlbumHandler = async (request, h) => {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    const like = await this._likesService.getLike(albumId, userId);
    const response = h.response({
      status: "success",
      data: {
        like,
      },
    });
    response.code(200);
    return response;
  };

  deleteLikeAlbumHandler = async (request, h) => {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._likesService.deleteLike(albumId, userId);
    const response = h.response({
      status: "success",
      message: "Like deleted successfully",
    });
    response.code(200);
    return response;
  };
  
}
