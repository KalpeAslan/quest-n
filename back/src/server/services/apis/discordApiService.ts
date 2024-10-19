import { URLSearchParams } from 'url';
import axios from 'axios';

import { constants } from '../../config/constants';
import { Logger } from '../logger';
import { getConfig } from '../../config';
import { discordTokenModel } from '../../../db/models';
import { discordDisconnectUserService } from '../auth/discord';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';

const { DISCORD_LOGIN_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, DISCORD_SCOPE } =
  getConfig();

const log = new Logger();

interface DiscordGuilds {
  id: string;
  name: string;
}

class DiscordApiService {
  async fetchUserInfo(token: string, investorId?: number) {
    try {
      const { data } = await axios.get(constants.discord.getApiUrl + 'users/@me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      log.error(`discordApiService.fetchUserInfo error: ${error.response?.data}`);
      throw new NotFoundError(NotFoundErrorKeys.NotFound, 'discordApiService.fetchUserInfo error');
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
      log.error(
        `discordApiService.fetchAccessTokenAndUser error: ${
          typeof error.response?.data === 'string'
            ? error.response?.data
            : error.response?.data
            ? JSON.stringify(error.response?.data)
            : error.response?.data
        }`,
      );
      throw new NotFoundError(NotFoundErrorKeys.NotFound, 'discordApiService.fetchAccessTokenAndUser error');
    }
  }

  async refreshAccessTokenAndUser(refreshToken: string, investorId: number) {
    const params = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: constants.discord.refreshGrantType,
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
      await discordDisconnectUserService(investorId);
      log.error(`discordApiService.refreshAccessTokenAndUser error: ${error.response?.data}`);
      throw new BadRequestError(
        BadRequestErrorKeys.DiscordRefreshToken,
        'discordApiService.refreshAccessTokenAndUser error',
      );
    }
  }

  async fetchGuilds(investorId: number, token?: string): Promise<DiscordGuilds[]> {
    try {
      log.warn(`pultik fetchGuilds started for ${investorId} and ${token}`);
      const bearer = await discordTokenModel.getBearerToken(investorId);
      log.warn(`pultik fetchGuilds bearer ${bearer} for ${investorId}`);

      const { data } = await axios.get(constants.discord.getApiUrl + 'users/@me/guilds', {
        headers: {
          Authorization: token ? `Bearer ${token}` : bearer,
        },
      });

      log.warn(`pultik fetchGuilds data ${JSON.stringify(data)} for ${investorId}`);

      return data;
    } catch (error) {
      log.error(
        `discordApiService.fetchAccessTokenAndUser error: ${
          typeof error.response?.data === 'string'
            ? error.response?.data
            : error.response?.data
            ? JSON.stringify(error.response?.data)
            : error.response?.data
        }`,
      );
      throw new NotFoundError(NotFoundErrorKeys.NotFound, 'discordApiService.fetchGuilds error');
    }
  }

  async fetchGuildRoles(investorId: number, guildId: string, token?: string): Promise<string[]> {
    try {
      const bearer = await discordTokenModel.getBearerToken(investorId);
      const { data } = await axios.get(constants.discord.getApiUrl + `users/@me/guilds/${guildId}/member`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : bearer,
        },
      });
      return data.roles;
    } catch (error) {
      log.error(`discordApiService.fetchGuildRoles error: ${error.response?.data}`);
      throw new NotFoundError(NotFoundErrorKeys.NotFound, 'discordApiService.fetchGuildRoles error');
    }
  }

  async getServerIdByInviteLink(inviteLink: string) {
    return inviteLink;
  }
  //   try {
  //     const split = inviteLink.split('/');
  //     const invite = split[split.length - 1];
  //     const { data } = await axios.get(constants.discord.getApiUrl + `invite/${invite}`);
  //     log.info(`guildMeta: ${JSON.stringify(data)}`);
  //     return data.guild_id;
  //   } catch (error) {
  //     log.error(`discordApiService.getServerIdByInviteLink error: ${error}`);
  //     throw new NotFoundError(NotFoundErrorKeys.NotFound, 'discordApiService.getServerIdByInviteLink error');
  //   }
  // }
}

export const discordApiService = new DiscordApiService();
