export const routes = (handler) => [
  {
    method: "POST",
    path: "/uploads/images",
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 1000000, // 1MB
      },
    },
  },
];
