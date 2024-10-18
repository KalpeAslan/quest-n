import { BadRequestError, BadRequestErrorKeys, ConflictError, ConflictErrorKeys } from '../../errors';
import { taskProgressModel, twitterUserModel, walletUserModel } from '../../../db/models';
import { TwitterEntryDto } from '../../../db/types/interfaces/entry/twitterDto';
import { twitterApiService } from '../apis/twitterApiService';
import { LoyaltyTaskType } from '../../../db/types/interfaces/loyalty';
import { In, Raw } from 'typeorm';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { countLoginConnections } from '.';

export const twitterGetLoginUrlService = () => {
  return twitterApiService.fetchAuthUrl();
};

export const twitterGetAuthTokenAndUserService = async (twitterOauthDto: TwitterEntryDto, investorId: number) => {
  const twitterOathData = await twitterApiService.fetchAuthData(twitterOauthDto);

  const existedTwitterUser = await twitterUserModel.getByTwitterId(twitterOathData.results.user_id);

  if (existedTwitterUser) {
    throw new ConflictError(ConflictErrorKeys.AccountAlreadyExists, twitterOathData.results.screen_name);
  }

  return await twitterUserModel.create({
    investorId,
    twitterId: twitterOathData.results.user_id,
    twitterUsername: twitterOathData.results.screen_name,
    oauthAccessToken: twitterOathData.oauthAccessToken,
    oauthAccessTokenSecret: twitterOathData.oauthAccessTokenSecret,
  });
};

export const twitterDisconnectUserService = async (investorId: number) => {
  const countConnections = await countLoginConnections(investorId);
  if (countConnections === 1) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'You cannot disable the only login method');
  }

  const twitterUser = await twitterUserModel.getByInvestorId(investorId);

  if (!twitterUser)
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have twitter token or twitter user');

  const questTwitterTasks = await taskProgressModel.getByConditionsWithRelations(
    {
      investorId,
      loyaltyTask: {
        type: In([
          LoyaltyTaskType.MentionTwitter,
          LoyaltyTaskType.ReTweetQuoteTwitter,
          LoyaltyTaskType.FollowTwitter,
          LoyaltyTaskType.TweetTwitter,
          LoyaltyTaskType.ReTweetTwitter,
          LoyaltyTaskType.LikeTweetTwitter,
          LoyaltyTaskType.CommentTweetTwitter,
          LoyaltyTaskType.CheckSpaceTwitter,
        ]),
      },
      loyaltyProject: {
        endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
      },
    },
    ['loyaltyTask', 'loyaltyProject'],
  );

  await taskProgressModel.removeTaskProgresses(questTwitterTasks);

  await twitterUserModel.delete(twitterUser);
};
