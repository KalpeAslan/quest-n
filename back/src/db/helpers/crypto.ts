import crypto from 'crypto';

import { getConfig } from '../config';
import { constants } from '../constants';

const config = getConfig();
const OUTPUT_FORMAT = 'hex';

export const encryptData = (data) => {
  const iv = Buffer.from(config.IV, OUTPUT_FORMAT);
  const cipher = crypto.createCipheriv(constants.algorithm, Buffer.from(config.ENCRYPTION_KEY, 'base64'), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString(OUTPUT_FORMAT) + ':' + encrypted.toString(OUTPUT_FORMAT);
};

export const decryptData = (data) => {
  const textParts = data.split(':');

  if (textParts.length < 2) throw new Error('data for decrypting is wrong');

  const iv = Buffer.from(textParts.shift(), OUTPUT_FORMAT);
  const encryptedText = Buffer.from(textParts.join(':'), OUTPUT_FORMAT);
  const decipher = crypto.createDecipheriv(constants.algorithm, Buffer.from(config.ENCRYPTION_KEY, 'base64'), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
