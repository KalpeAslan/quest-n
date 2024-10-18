import crypto from 'crypto';
import { sign } from 'jsonwebtoken';

import { getConfig } from '../config';

export const generateToken = (login: string, password: string, env?: string) => {
  const config = getConfig();
  crypto
    .createHmac('sha256', config[`${env}_SECRET`])
    .update(password + config[`${env}_SALT`])
    .digest('hex');

  return sign({ login: config[`${env}_LOGIN`] }, config[`${env}_SECRET`], {
    expiresIn: config['ADMIN_TOKEN_LIFETIME'],
  });
};
