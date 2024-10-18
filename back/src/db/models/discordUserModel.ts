import { getRepository } from 'typeorm';

import { DiscordUser } from '../entity';

interface CreateDiscordUser {
  investorId: number;
  discordId: string;
  discordUsername: string;
}

class DiscordUserModel {
  getByDiscordId(discordId: string) {
    return getRepository(DiscordUser).findOne({
      where: { discordId },
      relations: ['investor', 'investor.twoFactorAuth'],
    });
  }

  create(createDiscordUserData: CreateDiscordUser) {
    const discordUser = getRepository(DiscordUser).create(createDiscordUserData);
    return getRepository(DiscordUser).save(discordUser);
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(DiscordUser).delete({ investorId });
  }
}

export const discordUserModel = new DiscordUserModel();
