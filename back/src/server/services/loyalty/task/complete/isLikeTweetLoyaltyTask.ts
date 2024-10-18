import { error } from 'console';
import { LoyaltyTask } from '../../../../../db/entity';
import { twitterUserModel } from '../../../../../db/models';
import { LikeTwitterLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { BadRequestError, BadRequestErrorKeys } from '../../../../errors';
import { twitterApiRequests } from '../../../apis/twitterApiRequests';

export const isLikeTweetLoyaltyTask = async (investorId: number, loyaltyTask: LoyaltyTask) => {
  const twitterUser = await twitterUserModel.getByInvestorId(investorId);
  if (!twitterUser) {
    throw new BadRequestError(
      BadRequestErrorKeys.UserDoesNotExist,
      `investorId: ${investorId}, does not have twitterUser`,
    );
  }

  // TODO: should be refactored once we have enougth twitter request limit
  try {
    const likingTweets = await twitterApiRequests.fetchUserLikingTweets(
      twitterUser.oauthAccessToken,
      twitterUser.oauthAccessTokenSecret,
      twitterUser.twitterId,
    );

    const status = likingTweets.some((elem) => elem.id === (loyaltyTask.body as LikeTwitterLoyaltyTaskBody).tweetId);

    return {
      status: status,
    };
  } catch (err) {
    if (err.body.statusCode === 429) {
      return {
        status: true,
      };
    } else {
      throw err;
    }
  }
};
