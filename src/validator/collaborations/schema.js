import Joi from "joi";

export const CollaborationPlaylistPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});