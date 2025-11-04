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
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: handler.postUploadCoverAlbumHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000, // 512KB
      },
    },
  },
  {
    method: "GET",
    path: "/albums/covers/{param*}",
    handler: {
      directory: {
        path: "src/api/albums/covers/images",
      },
    },
  },
];
