import InvariantError from "../../exceptions/InvariantError.js";
import { CollaborationPlaylistPayloadSchema } from "./schema.js";

export const CollaborationsValidator = {
  validateCollaborationPlaylistPayload: (payload) => {
    const validationResult =
      CollaborationPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
