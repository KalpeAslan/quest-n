import { ValueTransformer } from 'typeorm';

import { encryptData, decryptData } from '../helpers/crypto';

export const encrypt: ValueTransformer = {
  to: (v): string | null => {
    return v ? encryptData(v) : null;
  },
  from: (v): string | null => {
    return v ? decryptData(v) : null;
  },
};
