import { getRepository } from 'typeorm';
import { TwitterUser } from '../entity';

interface CreateTwitterUser {
  twitterId: string;
  twitterUsername: string;
  investorId: number;
  oauthAccessToken: string;
  oauthAccessTokenSecret: string;
}

class TwitterUserModel {
  getAllByTwitterId(twitterId: string) {
    return getRepository(TwitterUser).find({ where: { twitterId }, relations: ['investor'] });
  }
  getByInvestorId(investorId: number) {
    return getRepository(TwitterUser).findOne({ where: { investorId } });
  }
  getByInvestorIdOrFail(investorId: number) {
    return getRepository(TwitterUser).findOneOrFail({ where: { investorId } });
  }

  create(createTwitterUserData: CreateTwitterUser) {
    const twitterUser = getRepository(TwitterUser).create(createTwitterUserData);
    return getRepository(TwitterUser).save(twitterUser);
  }

  update(twitterUser: TwitterUser) {
    return getRepository(TwitterUser).save(twitterUser);
  }

  delete(twitterUser: TwitterUser) {
    return getRepository(TwitterUser).remove(twitterUser);
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(TwitterUser).delete({ investorId });
  }

  async getCredentials(investorId: number) {
    const twitterUserData = await this.getByInvestorIdOrFail(investorId);
    return {
      oauthAccessToken: twitterUserData.oauthAccessToken,
      oauthAccessTokenSecret: twitterUserData.oauthAccessTokenSecret,
      twitterId: twitterUserData.twitterId,
    };
  }

  getByTwitterId(twitterId: string) {
    return getRepository(TwitterUser).findOne({
      where: { twitterId },
      relations: ['investor', 'investor.twoFactorAuth'],
    });
  }
}
export const twitterUserModel = new TwitterUserModel();
