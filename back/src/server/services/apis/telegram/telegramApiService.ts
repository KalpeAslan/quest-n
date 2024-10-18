import axios from 'axios';

import { getConfig } from '../../../config';
import { constants } from '../../../config/constants';
import { Logger } from '../../logger';
import { InternalServerError, InternalServerErrorKeys } from '../../../errors';

const { TELEGRAM_API_KEY, TELEGRAM_BOT_URL } = getConfig();

const log = new Logger();

class TelegramApiService {
  async checkJoined(user_id: string, group: string) {
    const { ok } = await this.checkMembership(user_id, group);
    return ok;
  }

  private async checkMembership(user_id: string, group: string): Promise<{ ok: boolean }> {
    try {
      const { data } = await axios.post(`${TELEGRAM_BOT_URL}/getMembership`, {
        access_token: TELEGRAM_API_KEY,
        chat_handle: group,
        user_id,
      } as any);
      return data;
    } catch (error) {
      log.error(`Error telegram custom api get membership ${error.response?.data}`);
      throw new InternalServerError(InternalServerErrorKeys.Default, 'Error telegram custom api get membership');
    }
  }
}

export const telegramApiService = new TelegramApiService();
