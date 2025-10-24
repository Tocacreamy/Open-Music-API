import Joi from "joi";

export const PostPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

export const PostSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

export const DeleteSongFromPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

