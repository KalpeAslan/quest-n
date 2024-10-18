import crypto from 'crypto';

import { constants } from '../config/constants';
import { getConfig } from '../config';

const config = getConfig();

export const encryptRefLink = (message) => {
  const cipher = crypto.createCipheriv(constants.reflinkAlgorithm, config.REFLINK_ENCRYPTION_KEY, config.REFLINK_IV);
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted.replace('+', 'xMl3Jk').replaceAll('/', 'Por21Ld').replace('=', 'Ml32');
};

export const decryptRefLink = (message) => {
  try {
    const decipher = crypto.createDecipheriv(
      constants.reflinkAlgorithm,
      config.REFLINK_ENCRYPTION_KEY,
      config.REFLINK_IV,
    );
    const decrypted = decipher.update(
      message.replace('xMl3Jk', '+').replace('Por21Ld', '/').replace('Ml32', '='),
      'base64',
      'utf8',
    );
    return decrypted + decipher.final('utf8');
  } catch {
    return '';
  }
};
