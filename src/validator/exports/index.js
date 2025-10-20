import { ExportPlaylistPayloadSchema } from './schema.js';
import InvariantError from '../../exceptions/InvariantError.js';

export const ExportsValidator = {
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
