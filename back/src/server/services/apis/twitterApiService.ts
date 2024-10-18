import axios from 'axios';
import { constants } from '../../config/constants';
import { twitterUserModel } from '../../../db/models';
import { twitterApiRequests } from './twitterApiRequests';
import { Logger } from '../logger';
import { getConfig } from '../../config';
import { InternalServerError, InternalServerErrorKeys } from '../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';

const log = new Logger();
const { TWITTER_APP_BEARER_TOKEN, SCRAPERAPI_KEY } = getConfig();

class TwitterApiService {
  async fetchAuthUrl() {
    const { oauthRequestToken, oauthRequestTokenSecret } = await twitterApiRequests.fetchAuthRequestToken();

    return {
      authorizationUrl: `${constants.twitter.oauthRedirectLink}?oauth_token=${oauthRequestToken}`,
      oauthRequestToken,
      oauthRequestTokenSecret,
    };
  }

  fetchAuthData(authData) {
    return twitterApiRequests.fetchAuthAccessToken(authData);
  }

  async fetchFollowersUsername(investorId: number) {
    const { oauthAccessToken, oauthAccessTokenSecret, twitterId } = await twitterUserModel.getCredentials(investorId);
    try {
      const result = await twitterApiRequests.fetchFollowers(oauthAccessToken, oauthAccessTokenSecret, twitterId);
      return result.data.map((aUser) => {
        return { username: aUser.username };
      });
    } catch (error) {
      log.error(`Error twitter api get friends: ${error}`);
      throw error;
    }
  }

  async fetchFollowingIds(investorId: number) {
    const { oauthAccessToken, oauthAccessTokenSecret, twitterId } = await twitterUserModel.getCredentials(investorId);
    try {
      const result = await twitterApiRequests.fetchFollowers(oauthAccessToken, oauthAccessTokenSecret, twitterId);
      return result.data.map((aUser) => aUser.id);
    } catch (error) {
      log.error(`Error twitter api get Followers Ids: ${error}`);
      throw error;
    }
  }

  async fetchMentions(investorId) {
    try {
      const twitterUser: any = await twitterUserModel.getByInvestorId(investorId);
      const apiUrl = `https://api.scraperapi.com/structured/twitter/v2/search?api_key=${SCRAPERAPI_KEY}&query=${twitterUser.twitterUsername}`;
      const response = await axios.get(apiUrl);

      const scraperApiData = response.data.tweets;
      return scraperApiData
        .filter((aTweet) => aTweet.user_mentions && aTweet.user_mentions.length > 0 && !aTweet.retweeted)
        .map((aTweet) => ({
          tweetId: aTweet.tweet_id,
          mentionedAt: aTweet.date,
          mentionTwitterUserIds: aTweet.user_mentions.map((anUser) => anUser.user_id),
        }));
    } catch (error) {
      log.error(`Error twitter api get mentions: ${error}`);
      throw error;
    }
  }

  async fetchQuotReTweets(investorId: number, tweetId: string) {
    try {
      const twitterUser: any = await twitterUserModel.getByInvestorId(investorId);
      const apiUrl = `https://api.scraperapi.com/structured/twitter/v2/search?api_key=${SCRAPERAPI_KEY}&query=${twitterUser.twitterUsername}`;
      const response = await axios.get(apiUrl);
      const scraperApiData = response.data.tweets;

      return scraperApiData
        .filter((aRecord) => !!aRecord.quoted_tweet && aRecord.quoted_tweet.tweet_id === tweetId)
        .map((aRecord) => {
          return {
            createdAt: new Date(aRecord.date),
            tweetId: aRecord.tweet_id,
          };
        });
    } catch (error) {
      log.error(`Error twitter api get quote re tweets: ${error}`);
      throw error;
    }
  }

  async fetchTwitterIdByUsername(username: string, investorId = 0) {
    try {
      const twitterUser = await twitterUserModel.getByInvestorId(+investorId);

      if (twitterUser) {
        log.info('Investor is associated with a twitterUser, a request has been initiated using the user`s tokens');
        return await twitterApiRequests.fetchTwitterIdByUsername(
          twitterUser.oauthAccessToken,
          twitterUser.oauthAccessTokenSecret,
          username,
        );
      }

      log.info('The request has been initiated using the application`s bearer token');
      const response = await axios.get(`https://api.twitter.com/2/users/by/username/${username}`, {
        headers: {
          Authorization: `Bearer ${TWITTER_APP_BEARER_TOKEN}`,
        },
      });

      const data = response.data;

      if (!data.data || !data.data.id) {
        throw new NotFoundError(NotFoundErrorKeys.NotFound, `Cannot find user ${username} with the Twitter API`);
      }

      return data.data.id;
    } catch (error) {
      console.error(error);
      throw new InternalServerError(InternalServerErrorKeys.Default, `Error fetching Twitter user ID, error: ${error}`);
    }
  }
}

export const twitterApiService = new TwitterApiService();
