import { EProjectType } from "@modules/quest/models";

export const enum ELoyaltyTasks {
  QUIZ = "quiz",
  VISIT_LINK = "visitLink",
  REFERRAL_LINK = "referralLink",
  SUGGESTION = "suggestion",
  FOLLOW_TWITTER = "followTwitter",
  MENTION_TWITTER = "mentionTwitter",
  TWEET_TWITTER = "tweetTwitter",
  RE_TWEET_TWITTER = "reTweetTwitter",
  JOIN_DISCORD = "joinDiscord",
  ROLE_DISCORD = "roleDiscord",
  EMAIL = "email",
  RE_TWEET_QUOTE_TWITTER = "reTweetQuoteTwitter",
  LIKE_TWEET_TWITTER = "likeTweetTwitter",
  COMMENT_TWEET_TWITTER = "commentTweetTwitter",
  PARTNER = "partner",
  MULTIPLE_SUGGESTION = "multipleSuggestion",
  MEDIUM = "medium",
  JOIN_TELEGRAM = "joinTelegram",
  CHECK_SPACE_TWITTER = "checkSpaceTwitter",
  SEQUENCE = "sequence",
  WATCH_VIDEO = "watchVideo",
  SIGN_UP = "signUp",
  COMPLETED_ONBOARDING = "completedOnboarding",
  TOKEN = "token",
  NFT = "nft",
  BLOCKCHAIN_USER = "blockchainUser",
  VALUE_HOLDER = "valueHolder",
  NATIVE_HOLDER = "nativeHolder",
  DAILY = "daily",
  CUSTOM_WEBHOOK = "customWebhook",
  DEX_LIQUIDITY_PROVIDER = "dexLiquidityProvider",
  IMAGE_UPLOAD = "imageUpload",
  INVITE = "invite",
  ALL_BRIDGE = "bridge",
  GIT_COIN = "gitCoin",
}

export enum EWebhookTaskTabs {
  TEXT = "text",
  EMAIL = "email",
  PHONE = "phone",
  WALLET = "wallet",
}

export const enum ETaskStatus {
  ACTIVE = "active",
  DONE = "done",
  EXPIRED = "expired",
  ADDITIONAL_PROGRAM = "additionalProgram",
  MULTIPLE_DONE = "multipleDone",
  PRE_DONE = "pre-done",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  ON_REVIEW = "onReview",
  BLOCKED = "blocked",
}

export interface ILoyaltyTask {
  id?: number;
  title: string;
  type: ELoyaltyTasks;
  startAt?: string | null;
  endAt?: string | null;
  status: ETaskStatus;
  points: number;
  body: any;
  sortOrder: number;
  required: boolean;
  tasks: ILoyaltyTask[];
  multipleStatus: "active" | "done";
  expPoints: number;
}

export interface ITaskMainTrackingData {
  taskName: string;
  taskPoints: number;
  taskId: string | number;
  taskType: string;
  taskPosition: number;

  taskData: ILoyaltyTask;
}

export interface ITaskTrackingData {
  questPointsSum: number;
  subTaskId?: number;
}

export enum ENetworks {
  Ethereum = "0x1",
  Polygon = "0x89",
  BNB = "0x38",
  Avalanche = "0xa86a",
  Arbitrum = "0xa4b1",
  Optimism = "0xa",
  KCC = "0x141",
  OKT = "0x42",
  Goerli = "0x5",
  Mumbai = "0x13881",
  BitGert = "0x7f08",
  ZetaChain = "0x1b59",
  GoerliArbitrum = "0x66eed",
  Aurora = "0x4e454152",
}

export interface IAbiEvent {
  anonymous: boolean;
  inputs: string[];
  name: string;
  type: string;
}

export enum ETokenType {
  Nft = "nft",
  Aq = "aq",
  Token = "token",
  Whitelist = "whitelist",
}

export interface IQuestAnalytics {
  linkTitle: string;
  title: string;
  visits: number;
  participants: string;
  geography: {
    countrycode: string;
    visits: number | string;
  }[];
  questType: EProjectType;
}

export interface IQuestTasksCompletionByDate {
  id: number;
  title: string;
  completionCount: number;
  total: string;
}

export interface IQuestTasksCompletion {
  tasksCompletion: {
    id: number;
    title: string;
    completionCount: number;
    percentage: number;
  }[];
  tasksCountCompletion: {
    tasksCount: number;
    completionCount: number;
    percentage: number;
  }[];
}

export interface IQuestAnalyticsWinners {
  loyaltyProjectId: number;
  investorId: number;
  earnedPoints: number;
  place: string;
  id: number;
  amount: number;
  isClaimable: number;
  description: string;
  startPlace: number;
  endPlace: number;
  contractId: number;
  verified: boolean;
  tokenIds: number[];
  emailUserEmail: null | string;
  googleUserEmail: null | string;
  walletAddress: null | string;
  twitterUsername: null | string;
  discordUsername: null | string;
  phone: null | string;
  telegramUsername: null | string;
  createdAt: string;
  updatedAt: string;
  nonce: string;
  username: string;
  analytics_id: string;
  gamesSessions: [];
  lastActivity: string;
  experienceLevelId: null | string;
  isClaimed: boolean;
  experienceLevelImage: string;
}
