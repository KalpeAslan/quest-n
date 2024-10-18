import { URLSearchParams } from 'url';
import axios from 'axios';

import { constants } from '../../constants';
import { logger } from '../logger';
import { getConfig } from '../../config';
import { SocialAuthError } from '../../errors';
import { discordTokenModel } from '../../../db/models/discordTokenModel';

const { DISCORD_LOGIN_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, DISCORD_SCOPE } =
  getConfig();

const log = logger(__filename);

interface DiscordGuilds {
  id: string;
  name: string;
}

class DiscordApiService {
  async fetchUserInfo(token: string) {
    try {
      const { data } = await axios.get(constants.discord.getApiUrl + 'users/@me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      log.error(error.response?.data, 'Error discord api get userInfo');
      throw new Error('Error discord api get userInfo');
    }
  }

  getAuthUrl() {
    return {
      authorizationUrl: DISCORD_LOGIN_URL,
    };
  }

  async fetchAccessTokenAndUser(code: string) {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      code,
      grant_type: constants.discord.grandType,
      redirect_uri: DISCORD_REDIRECT_URI,
      scope: DISCORD_SCOPE,
    });

    try {
      const { data } = await axios.post(constants.discord.oauthTokenUrl, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const user = await this.fetchUserInfo(data.access_token);
      return {
        discordId: user.id,
        discordUsername: user.username,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiredIn: Math.round(Date.now() / 1000) - 10 + data.expires_in, // minus 10 second
      };
    } catch (error) {
      log.error(error.response?.data, 'Error discord api get oauth token');
      throw new Error('Error discord api get oauth token');
    }
  }

  async fetchRefreshToken(refreshToken: string) {
    const params = new URLSearchParams({
      refresh_token: refreshToken,
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
    });

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    try {
      const { data } = await axios.post(constants.discord.oauthTokenUrl, params.toString(), { headers });
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiredIn: Math.round(Date.now() / 1000) - 10 + data.expires_in, // minus 10 second
      };
    } catch (error) {
      log.error(error.response?.data, 'Error discord api refresh auth token');
      throw new SocialAuthError();
    }
  }

  async fetchGuilds(investorId: number): Promise<DiscordGuilds[]> {
    try {
      const bearer = await discordTokenModel.getBearerToken(investorId);

      const { data } = await axios.get(constants.discord.getApiUrl + 'users/@me/guilds', {
        headers: {
          Authorization: bearer,
        },
      });

      return data;
    } catch (error) {
      log.error(error.response?.data, 'Error discord api get guilds');
      throw new Error('Error discord api get guilds');
    }
  }

  async fetchGuildRoles(investorId: number, guildId: string): Promise<string[]> {
    try {
      const bearer = await discordTokenModel.getBearerToken(investorId);
      const { data } = await axios.get(constants.discord.getApiUrl + `users/@me/guilds/${guildId}/member`, {
        headers: {
          Authorization: bearer,
        },
      });
      return data.roles;
    } catch (error) {
      log.error(error.response?.data, 'Error discord api get guild member info');
      throw new Error('Error discord api get guild member info');
    }
  }
}

export const discordApiService = new DiscordApiService();
