import { HmacSHA256, SHA256 } from 'crypto-js';

import { getConfig } from '../../../config';
import axios from 'axios';
import { constants } from '../../../config/constants';

const { TELEGRAM_BOT_NAME, TELEGRAM_BOT_ID, TELEGRAM_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_URL } = getConfig();

class TelegramAuthService {
  async isBotInvited(group: string) {
    const { data } = await axios.post(`${TELEGRAM_BOT_URL}/getChat`, {
      access_token: TELEGRAM_API_KEY,
      chat_handle: group,
    });
    return data;
  }

  getUrl() {
    return {
      botName: TELEGRAM_BOT_NAME,
      botId: TELEGRAM_BOT_ID,
    };
  }

  isValid(telegramOauthDto: any) {
    const { hash: checkHash } = telegramOauthDto;

    const dataCheckArr = Object.keys(telegramOauthDto)
      .filter((key) => key !== 'hash' && telegramOauthDto[key])
      .map((key) => `${key}=${telegramOauthDto[key]}`)
      .sort()
      .join('\n');

    const secretKey = SHA256(TELEGRAM_BOT_TOKEN);
    const hash = String(HmacSHA256(dataCheckArr, secretKey));

    return hash === checkHash; // returns true if hash is valid
  }
}

export const telegramAuthService = new TelegramAuthService();
