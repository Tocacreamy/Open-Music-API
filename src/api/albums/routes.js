export const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbum,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumById,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumById,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumById,
  },

  // OPSIONAL
  // {
  //   method: "GET",
  //   path: "/albums/{albumId}",
  //   handler: handler.getSongsByAlbumDetail,
  // },
];
