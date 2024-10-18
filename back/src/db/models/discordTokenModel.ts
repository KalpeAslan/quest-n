import { Raw, getRepository } from 'typeorm';

import { DiscordToken } from '../entity';
import { discordApiService } from '../helpers/apis/discordApiService';

interface CreateDiscordToken {
  investorId: number;
  discordId: string;
  discordUsername: string;
  accessToken: string;
  refreshToken: string;
  expiredIn: number;
}

class DiscordTokenModel {
  getAllByDiscordId(discordId: string) {
    return getRepository(DiscordToken).find({ where: { discordId }, relations: ['investor'] });
  }

  getAllToRefresh() {
    return getRepository(DiscordToken).find({
      where: { updatedAt: Raw((alias) => `(${alias} <= (NOW() - INTERVAL '7 days'))`) },
    });
  }

  getByInvestorId(investorId: number) {
    return getRepository(DiscordToken).findOne({ where: { investorId } });
  }
  getByInvestorIdOrFail(investorId: number) {
    return getRepository(DiscordToken).findOneOrFail({ where: { investorId } });
  }

  create(createDiscordTokenData: CreateDiscordToken) {
    const discordToken = getRepository(DiscordToken).create(createDiscordTokenData);
    return getRepository(DiscordToken).save(discordToken);
  }

  async getBearerToken(investorId: number) {
    const discordTokenData = await this.getByInvestorIdOrFail(investorId);
    if (this.isAccessTokenValid(discordTokenData)) return this.returnBearerToken(discordTokenData);

    const updatedDiscordTokenData = await this.refreshAccessToken(discordTokenData);
    return this.returnBearerToken(updatedDiscordTokenData);
  }

  update(discordToken: DiscordToken) {
    return getRepository(DiscordToken).save(discordToken);
  }

  delete(discordToken: DiscordToken) {
    return getRepository(DiscordToken).remove(discordToken);
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(DiscordToken).delete({ investorId });
  }

  private isAccessTokenValid(discordTokenData: DiscordToken) {
    return Math.round(Date.now() / 1000) < new Date(discordTokenData.expiredIn).getTime();
  }

  private returnBearerToken(discordTokenData: DiscordToken) {
    return `Bearer ${discordTokenData.accessToken}`;
  }

  private async refreshAccessToken(discordTokenData: DiscordToken) {
    const newOauthData = await discordApiService.fetchRefreshToken(discordTokenData.refreshToken);

    discordTokenData.accessToken = newOauthData.accessToken;
    discordTokenData.refreshToken = newOauthData.refreshToken;
    discordTokenData.expiredIn = newOauthData.expiredIn;

    return getRepository(DiscordToken).save(discordTokenData);
  }
}

export const discordTokenModel = new DiscordTokenModel();
