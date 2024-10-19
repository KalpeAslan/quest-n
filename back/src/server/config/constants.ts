import { getConfig } from './index';
import { Networks } from '../../db/types/interfaces/blockchain.types';

export const constants = {
  jwt: {
    accessExpiresIn: '60d',
    refreshExpiresIn: '60d',
    onlyplayExpiresIn: '1d',
  },
  maxImageSize: Math.floor(2 * 1024 * 1024),
  maxImageSizeUploadTask: Math.floor(5 * 1024 * 1024),
  maxImageSizeUploadTaskInMB: 5,
  reflinkAlgorithm: 'aes-256-cbc',
  smsRequestsLimit: 10,
  authTokenBufferLength: 24,
  autoTokenActiveTime: 600_000,
  wallet: {
    signedMessage: 'Sign this message to authenticate via your wallet',
  },
  twitter: {
    getApiFriendsList: 'https://api.twitter.com/1.1/friends/list.json',
    getApiFriendsIds: 'https://api.twitter.com/1.1/friends/ids.json',
    getApiUserTimeline: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
    getApiTweetReTweet: 'https://api.twitter.com/1.1/statuses/retweets/',
    getApiTweetStatus: 'https://api.twitter.com/1.1/statuses/show.json',
    getApiTweetSearch: 'https://api.twitter.com/1.1/search/tweets.json',
    getApiTweetData: 'https://api.twitter.com/2/tweets',
    oauthRedirectLink: 'https://api.twitter.com/oauth/authorize',
    oauthRequest: 'https://twitter.com/oauth/request_token',
    oauthAccess: 'https://twitter.com/oauth/access_token',
    authorizeUrl: 'https://twitter.com/i/oauth2/authorize',
    getTokenUrl: 'https://api.twitter.com/2/oauth2/token',
    getApiUserUrl: 'https://api.twitter.com/2/users/',
    getApiTweetUrl: 'https://api.twitter.com/2/tweets/',
    scope: 'offline.access%20tweet.read%20users.read%20follows.read',
  },
  discord: {
    oauthTokenUrl: 'https://discord.com/api/oauth2/token',
    grandType: 'authorization_code',
    refreshGrantType: 'refresh_token',
    getApiUrl: 'https://discord.com/api/',
  },
  defaultAQtoken: { symbol: 'AQ', name: 'AlphaQuest' },
  google: {
    authScope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
    getApiUserInfo: 'https://www.googleapis.com/oauth2/v1/userinfo',
    rootUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    fetchToken: 'https://oauth2.googleapis.com/token',
  },
  allowedImageUploadTaskFormats: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/svg', 'image/webp'],
  blockchain: {
    [Networks.Ethereum]: {
      scanLink: 'https://api.etherscan.io',
      apiKey: getConfig().X1_SCAN_API_KEY,
      rpcUrl: getConfig().X1_RPC_URL,
      apiKeyV2: getConfig().X1_SCAN_API_KEY_V2,
      alphaDeployerContract: '',
      treasuryContract: '',
    },
    [Networks.Polygon]: {
      scanLink: 'https://api.polygonscan.com',
      apiKey: getConfig().X89_SCAN_API_KEY,
      rpcUrl: getConfig().X89_RPC_URL,
      alphaDeployerContract: getConfig().X89_DEPLOYER,
      treasuryContract: getConfig().X89_TREASURY,
    },
    [Networks.BNB]: {
      scanLink: 'https://api.bscscan.com',
      apiKey: getConfig().X38_SCAN_API_KEY,
      rpcUrl: getConfig().X38_RPC_URL,
      alphaDeployerContract: getConfig().X38_DEPLOYER,
      treasuryContract: getConfig().X38_TREASURY,
    },
    [Networks.Avalanche]: {
      scanLink: 'https://api.explorer.avax.network',
      apiKey: getConfig().XA86A_SCAN_API_KEY,
      rpcUrl: getConfig().XA86A_RPC_URL,
      alphaDeployerContract: getConfig().XA86A_DEPLOYER,
      treasuryContract: getConfig().XA86A_TREASURY,
    },
    [Networks.Arbitrum]: {
      scanLink: 'https://api.arbiscan.io',
      apiKey: getConfig().XA4B1_SCAN_API_KEY,
      rpcUrl: getConfig().XA4B1_RPC_URL,
      alphaDeployerContract: getConfig().XA4B1_DEPLOYER,
      treasuryContract: getConfig().XA4B1_TREASURY,
    },
    [Networks.Optimism]: {
      scanLink: 'https://api-optimistic.etherscan.io',
      apiKey: getConfig().XA_SCAN_API_KEY,
      rpcUrl: getConfig().XA_RPC_URL,
      alphaDeployerContract: getConfig().XA_DEPLOYER,
      treasuryContract: getConfig().XA_TREASURY,
    },
    [Networks.KCC]: {
      scanLink: 'https://scan.kcc.io',
      apiKey: getConfig().X141_SCAN_API_KEY,
      rpcUrl: getConfig().X141_RPC_URL,
      alphaDeployerContract: '',
      treasuryContract: '',
    },
    [Networks.Goerli]: {
      scanLink: 'https://api-goerli.etherscan.io',
      apiKey: getConfig().X1_SCAN_API_KEY,
      apiKeyV2: getConfig().X1_SCAN_API_KEY_V2,
      rpcUrl: getConfig().X5_RPC_URL,
      alphaDeployerContract: getConfig().X5_DEPLOYER,
      treasuryContract: getConfig().X5_TREASURY,
    },
    [Networks.Bitgert]: {
      scanLink: 'https://brisescan.com',
      apiKey: getConfig().X7F08_SCAN_API_KEY,
      rpcUrl: getConfig().X7F08_RPC_URL,
      alphaDeployerContract: '',
      treasuryContract: '',
    },
    [Networks.ZetaTestnet]: {
      isCustom: false,
      scanLink: null,
      apiKey: null,
      rpcUrl: getConfig().X1B59_RPC_URL,
      alphaDeployerContract: '',
      treasuryContract: '',
    },
    [Networks.GoerliArbitrum]: {
      isCustom: false,
      scanLink: 'https://api-goerli.arbiscan.io',
      apiKey: getConfig().XA4B1_SCAN_API_KEY,
      rpcUrl: getConfig().X66EED_RPC_URL,
      alphaDeployerContract: '',
      treasuryContract: '',
    },
    [Networks.Aurora]: {
      isCustom: false,
      scanLink: 'https://old.explorer.aurora.dev',
      apiKey: getConfig().X4E454152_SCAN_API_KEY,
      rpcUrl: getConfig().X4E454152_RPC_URL,
      alphaDeployerContract: '',
      treasuryContract: '',
    },
  } as unknown as Record<
    Networks,
    {
      scanLink: string;
      apiKey: string;
      apiKeyV2?: string;
      rpcUrl: string;
      alphaDeployerContract?: string;
      isCustom?: boolean;
      treasuryContract?: string;
    }
  >,
};
