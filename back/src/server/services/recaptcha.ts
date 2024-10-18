import axios from 'axios';

import { getConfig } from '../config';
import { Logger } from './logger';

const log = new Logger();
const config = getConfig();

export const verifyReCaptcha = async (token: string, version = 'v2'): Promise<boolean> => {
  log.info('verifyCaptcha');
  const secret =
    !version || version === 'v2' ? config.RECAPTCHA_INVISIBLE_SECRET : config.RECAPTCHA_V3_INVISIBLE_SECRET;
  try {
    const response = await axios({
      method: 'post',
      baseURL: config.RECAPTCHA_BASE_URL,
      params: {
        secret,
        response: token,
      },
    });

    return !!response.data.success;
  } catch (error) {
    log.warn(`Failed in verifyCaptcha ${error}`);
    return false;
  }
};
