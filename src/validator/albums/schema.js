import Joi from "joi";

export const AlbumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number().min(1900).max(new Date().getFullYear()).required()
})