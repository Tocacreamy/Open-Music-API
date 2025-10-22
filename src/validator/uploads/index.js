import { ImageHeadersSchema } from "./schema.js";
import InvariantError from "../../exceptions/InvariantError.js";

export const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

