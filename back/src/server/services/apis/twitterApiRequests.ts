import { OAuth } from 'oauth';

import { getConfig } from '../../config';
import { constants } from '../../config/constants';
import {
  ForbiddenError,
  ForbiddenErrorKeys,
  RateLimitError,
  RateLimitErrorKeys,
  UnauthorizedError,
  UnauthorizedErrorKeys,
} from '../../errors';

const { TWITTER_CONSUMER_KEY, TWITTER_CALLBACK_URL, TWITTER_CONSUMER_SECRET } = getConfig();

interface AuthAccessTokenInDto {
  oauthRequestToken: string;
  oauthRequestTokenSecret: string;
  oauthVerifier: string;
}

interface AuthAccessTokenOutDto {
  oauthAccessToken: string;
  oauthAccessTokenSecret: string;
  results: { user_id: string; screen_name: string };
}
interface AuthRequestTokenOutDto {
  oauthRequestToken: string;
  oauthRequestTokenSecret: string;
}

class TwitterApiRequests {
  private oauthConsumer: OAuth;

  constructor() {
    this.oauthConsumer = new OAuth(
      constants.twitter.oauthRequest,
      constants.twitter.oauthAccess,
      TWITTER_CONSUMER_KEY,
      TWITTER_CONSUMER_SECRET,
      '1.0A',
      TWITTER_CALLBACK_URL,
      'HMAC-SHA1',
    );
  }

  fetchAuthRequestToken(): Promise<AuthRequestTokenOutDto> {
    return new Promise((resolve, reject) => {
      this.oauthConsumer.getOAuthRequestToken((error, oauthRequestToken, oauthRequestTokenSecret, results) => {
        return error
          ? reject(new UnauthorizedError(UnauthorizedErrorKeys.OAuthError, 'Error getting OAuth request token'))
          : resolve({ oauthRequestToken, oauthRequestTokenSecret });
      });
    });
  }

  fetchAuthAccessToken(auth: AuthAccessTokenInDto): Promise<AuthAccessTokenOutDto> {
    return new Promise((resolve, reject) => {
      this.oauthConsumer.getOAuthAccessToken(
        auth.oauthRequestToken,
        auth.oauthRequestTokenSecret,
        auth.oauthVerifier,
        function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
          return error
            ? reject(new UnauthorizedError(UnauthorizedErrorKeys.OAuthError, 'Error getting OAuth access token'))
            : resolve({ oauthAccessToken, oauthAccessTokenSecret, results });
        },
      );
    });
  }

  fetchFollowers(
    oauthAccessToken: string,
    oauthAccessTokenSecret: string,
    twitterId: string,
  ): Promise<{
    data: {
      id: string;
      name: string;
      username: string;
    }[];
  }> {
    return new Promise((resolve, reject) => {
      let allFollowers: any = [];

      const getFollowers = (nextToken?: string) => {
        let url = `https://api.twitter.com/2/users/${twitterId}/following?max_results=1000`;

        if (nextToken) {
          url += `&pagination_token=${nextToken}`;
        }

        this.oauthConsumer.get(url, oauthAccessToken, oauthAccessTokenSecret, (error, data, res) => {
          if (error || !data) return reject(error);

          const followersResponse = JSON.parse(data.toString());
          const followers = followersResponse.data;

          allFollowers = allFollowers.concat(followers);

          if (followersResponse.meta.next_token) {
            getFollowers(followersResponse.meta.next_token);
          } else {
            resolve({ data: allFollowers });
          }
        });
      };

      getFollowers();
    });
  }

  fetchTwitterIdByUsername(
    oauthAccessToken: string,
    oauthAccessTokenSecret: string,
    username: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = `https://api.twitter.com/2/users/by/username/${username}`;

      this.oauthConsumer.get(url, oauthAccessToken, oauthAccessTokenSecret, (error, data, res) => {
        if (error || !data) {
          if (error.statusCode == 403) {
            reject(
              new ForbiddenError(
                ForbiddenErrorKeys.NotCorrectCredentials,
                `twitterUserName: ${username}. ${error.data}`,
              ),
            );
          } else if (error.statusCode == 429) {
            reject(
              new RateLimitError(RateLimitErrorKeys.TwitterLimitIsUsed, `twitterUserName: ${username}. ${error.data}`),
            );
          }
          return reject(error);
        }
        const userId: string = JSON.parse(data as string).data.id;
        resolve(userId);
      });
    });
  }

  fetchUserLikingTweets(
    oauthAccessToken: string,
    oauthAccessTokenSecret: string,
    twitterUserId: string,
  ): Promise<
    {
      edit_history_tweet_ids: string[];
      id: string;
      text: string;
    }[]
  > {
    return new Promise((resolve, reject) => {
      const url = `https://api.twitter.com/2/users/${twitterUserId}/liked_tweets`;

      this.oauthConsumer.get(url, oauthAccessToken, oauthAccessTokenSecret, (error, data, res) => {
        if (error || !data) {
          if (error.statusCode == 403) {
            reject(
              new ForbiddenError(
                ForbiddenErrorKeys.NotCorrectCredentials,
                `twitterUserId: ${twitterUserId}. ${error.data}`,
              ),
            );
          } else if (error.statusCode == 429) {
            reject(
              new RateLimitError(
                RateLimitErrorKeys.TwitterLimitIsUsed,
                `twitterUserId: ${twitterUserId}. ${error.data}`,
              ),
            );
          }
          return reject(error);
        }
        resolve(JSON.parse(data as string).data);
      });
    });
  }

  fetchUserTweets(
    oauthAccessToken: string,
    oauthAccessTokenSecret: string,
    twitterUserId: string,
  ): Promise<
    {
      edit_history_tweet_ids: string[];
      id: string;
      text: string;
      referenced_tweets: { type: string; id: string }[];
    }[]
  > {
    return new Promise((resolve, reject) => {
      const url = `https://api.twitter.com/2/users/${twitterUserId}/tweets?expansions=referenced_tweets.id`;

      this.oauthConsumer.get(url, oauthAccessToken, oauthAccessTokenSecret, (error, data, res) => {
        if (error || !data) {
          if (error.statusCode == 403) {
            reject(
              new ForbiddenError(
                ForbiddenErrorKeys.NotCorrectCredentials,
                `twitterUserId: ${twitterUserId}. ${error.data}`,
              ),
            );
          } else if (error.statusCode == 429) {
            reject(
              new RateLimitError(
                RateLimitErrorKeys.TwitterLimitIsUsed,
                `twitterUserId: ${twitterUserId}. ${error.data}`,
              ),
            );
          }
          return reject(error);
        }
        resolve(JSON.parse(data as string).data);
      });
    });
  }
}
export const twitterApiRequests = new TwitterApiRequests();
