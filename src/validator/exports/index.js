import { ExportNotesPayloadSchema } from './schema.js';
import InvariantError from '../../exceptions/InvariantError.js';

export const ExportsValidator = {
  validateExportNotesPayload: (payload) => {
    const validationResult = ExportNotesPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = ExportsValidator;
