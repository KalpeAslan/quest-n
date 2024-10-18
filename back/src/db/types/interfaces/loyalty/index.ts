import { LoyaltyReward } from '../../../entity';
import { IPagination } from '../common/common.types';
import {
  CheckSpaceTwitterLoyaltyTaskBody,
  EmailLoyaltyTaskBody,
  FollowTwitterLoyaltyTaskBody,
  QuizLoyaltyTaskBody,
  JoinDiscordLoyaltyTaskBody,
  JoinTelegramLoyaltyTaskBody,
  MentionTwitterLoyaltyTaskBody,
  PartnerLoyaltyTaskBody,
  ReferralLinkLoyaltyTaskBody,
  ReTweetQuoteTwitterLoyaltyTaskBody,
  LikeTwitterLoyaltyTaskBody,
  ReTweetTwitterLoyaltyTaskBody,
  RoleDiscordLoyaltyTaskBody,
  SuggestionLoyaltyTaskBody,
  TweetTwitterLoyaltyTaskBody,
  VisitLinkLoyaltyTaskBody,
  SignUpLoyaltyTaskBody,
  WatchVideoLoyaltyTaskBody,
  CompleteOnboardingLoyaltyTaskBody,
  TokenTaskBody,
  NFTTaskBody,
  BlockchainUserTaskBody,
  ValueHolderTaskBody,
  NativeHolderTaskBody,
  DailyTaskBody,
  CustomWebhookTaskBody,
  ImageUploadTaskBody,
  InviteTaskBody,
  DEXTaskBody,
  BridgeTaskBody,
  GitCoinTaskBody,
  OnChainEventLoyaltyTaskBody,
} from './tasks';

export enum LoyaltyTaskStatus {
  Active = 'active',
  Done = 'done',
  Expired = 'expired',
  AdditionalProgram = 'additionalProgram',
}

export enum LoyaltyProjectStatuses {
  Soon = 'soon',
  Expired = 'expired',
  Participating = 'participating',
  Active = 'active',
}

export enum LoyaltyProjectRewards {
  Token = 'token',
  NFT = 'nft',
  Whitelist = 'whitelist',
}
export enum LoyaltyProjectCampaign {
  Trending = 'trending',
  Newest = 'newest',
}

export interface LoyaltyProjectsScoreboard extends LoyaltyProjectUsersScoreboard {
  id: number;
  place: number;
  status?: StickyMenuInvestorInfoLuckDrawStatus;
}

export interface LoyaltyProjectUsersScoreboard {
  wallet: string;
  earnedPoints: number;
  place?: number;
}

export interface RewardToken {
  symbol: string;
  amount: number;
  logo?: string | null;
}

export interface Rewards {
  whitelisting?: boolean | undefined;
  tokens: RewardToken[];
}

export interface PartnerProject {
  logo?: string | null | undefined;
  verificationIcon: boolean;
  name: string;
  linkTitle?: string | null;
}

export interface LoyaltyProjectFilterOptions {
  campaign: LoyaltyProjectCampaign[];
  reward: LoyaltyProjectRewards[];
  status: LoyaltyProjectStatuses[];
  partner: string | null;
  visible: boolean;
  featured: boolean;
  trending: boolean;
  paginate: boolean;
  full: boolean;
  page: number;
  search: string;
}

export interface ProfileLoyaltyProjectFilterOptions {
  campaign: LoyaltyProjectCampaign[];
  reward: LoyaltyProjectRewards[];
  status: string;
  partner: string | null;
  visible: boolean;
  featured: boolean;
  trending: boolean;
  paginate: boolean;
  full: boolean;
  page: number;
  search: string;
  rewardTypes: any;
  questTypes: any;
}

export interface QuestShort {
  // common
  id: number;
  partnerProjects: PartnerProject[];
  status: LoyaltyProjectStatuses;
  startAt: Date | null;
  endAt: Date | null;
  title: string; // or projectName
  rewards: Rewards;
  linkTitle: string;
  tasksCount: {
    tasksDone: number;
    totalTasks: number;
  };

  // admin panel
  projectType: QuestType;

  // homepage
  preview_img: string | null;
}

export interface RewardTable {
  startPlace: number;
  endPlace: number;
  rewards: LoyaltyReward[];
  place?: string;
  placeRewards?: string;
}

export type StickyMenuInvestorInfoLuckDrawStatus = 'notEligible' | 'eligible' | 'loser' | 'winner' | 'participant';

export interface StickyMenuInvestorInfoLuckDraw {
  status: StickyMenuInvestorInfoLuckDrawStatus;
  requiredPoints: number;
}

export interface NextPrizePool {
  pointsToNextLevel: string;
  rewards: string;
}

export interface PrizePool {
  rewards: LoyaltyReward[];
  points: number;
}

export interface StickyMenuInvestorInfo {
  earnedPoints: number;
  claimingTransactions: Record<number, string>;
  isAqClaimed: boolean;
  scoreboard: {
    place: number;
    currentPrizePool: PrizePool;
    nextPrizePool: PrizePool;
    rewardsTable: RewardTable[];
    nftOrder: Record<number, number>;
  };
  luckyDraw: {
    isWinner: boolean;
    eligibleUsersCount: number;
  };
}

export interface GetLoyaltyProject {
  id: number;
  linkTitle: string;
  title: string;
  partnerProjects: PartnerProject[];
  status: LoyaltyProjectStatuses;
  projectType: QuestType;
  rewards: Rewards;
  startAt: Date | null;
  endAt: Date | null;
  claimingStartAt: Date | null;
  claimingEndAt: Date | null;
  description: string;
  socialDescription: string;
  loyaltyTasks?: LoyaltyTaskDashboard[];
  preview_img: string | null;
  fullRewards: { rewards: Array<LoyaltyReward & { tokenType?: TokenType }> };
  participants: number;
  questStatus: string | null;
}

export interface LoyaltyTaskDashboard {
  id: number;
  title: string;
  points: number;
  startAt: Date | null;
  endAt: Date | null;
  type: LoyaltyTaskType;
  isOnboardingTask: boolean;
  body: any;
  status: LoyaltyTaskStatus;
  sortOrder: number;
  required: boolean;
}
export interface LoyaltyProjectScoreboardReward {
  id: number;
  startPlace: number;
  endPlace: number;
  whitelisting: boolean;
  whitelistingName?: string;
  tokens: LoyaltyProjectTokenAmountReward[];
}

export interface LoyaltyProjectTokenAmountReward {
  id: number;
  amount: number;
  token: any;
  tokenId?: number;
  reward: any;
  rewardId?: number;
}

export enum QuestStatus {
  Active = 'Active',
  Draft = 'Draft',
  Completed = 'Completed',
}

export enum QuestType {
  Scoreboard = 'scoreboard',
  LuckyDraw = 'luckyDraw',
  Guaranteed = 'guaranteed',
}

export enum TokenType {
  Nft = 'nft',
  Aq = 'aq',
  Token = 'token',
  Whitelist = 'whitelist',
}

export enum LoyaltyTaskType {
  VisitLink = 'visitLink',
  Medium = 'medium',
  ReferralLink = 'referralLink',
  Quiz = 'quiz',
  Suggestion = 'suggestion',
  Email = 'email',
  FollowTwitter = 'followTwitter',
  MentionTwitter = 'mentionTwitter',
  TweetTwitter = 'tweetTwitter',
  ReTweetTwitter = 'reTweetTwitter',
  ReTweetQuoteTwitter = 'reTweetQuoteTwitter',
  LikeTweetTwitter = 'likeTweetTwitter',
  CommentTweetTwitter = 'commentTweetTwitter',
  CheckSpaceTwitter = 'checkSpaceTwitter',
  JoinDiscord = 'joinDiscord',
  RoleDiscord = 'roleDiscord',
  Partner = 'partner',
  JoinTelegram = 'joinTelegram',
  SignUp = 'signUp',
  WatchVideo = 'watchVideo',
  CompletedOnboarding = 'completedOnboarding',
  Token = 'token',
  NFT = 'nft',
  BlockchainUser = 'blockchainUser',
  ValueHolder = 'valueHolder',
  NativeHolder = 'nativeHolder',
  Daily = 'daily',
  CustomWebhook = 'customWebhook',
  DEXLiquidityProvider = 'dexLiquidityProvider',
  ImageUpload = 'imageUpload',
  Invite = 'invite',
  Bridge = 'allBridge',
  GitCoin = 'gitCoin',
  OnChainEvent = 'onChainEvent',
}

export type LoyaltyTaskBody =
  | VisitLinkLoyaltyTaskBody
  | QuizLoyaltyTaskBody
  | ReferralLinkLoyaltyTaskBody
  | FollowTwitterLoyaltyTaskBody
  | MentionTwitterLoyaltyTaskBody
  | TweetTwitterLoyaltyTaskBody
  | ReTweetTwitterLoyaltyTaskBody
  | ReTweetQuoteTwitterLoyaltyTaskBody
  | LikeTwitterLoyaltyTaskBody
  | CheckSpaceTwitterLoyaltyTaskBody
  | SuggestionLoyaltyTaskBody
  | EmailLoyaltyTaskBody
  | JoinDiscordLoyaltyTaskBody
  | RoleDiscordLoyaltyTaskBody
  | PartnerLoyaltyTaskBody
  | JoinTelegramLoyaltyTaskBody
  | SignUpLoyaltyTaskBody
  | WatchVideoLoyaltyTaskBody
  | CompleteOnboardingLoyaltyTaskBody
  | DEXTaskBody
  | TokenTaskBody
  | NFTTaskBody
  | BlockchainUserTaskBody
  | ValueHolderTaskBody
  | NativeHolderTaskBody
  | DailyTaskBody
  | CustomWebhookTaskBody
  | ImageUploadTaskBody
  | BridgeTaskBody
  | InviteTaskBody
  | GitCoinTaskBody
  | OnChainEventLoyaltyTaskBody;

export type AdditionalProgram = {
  pointsPerLike?: number;
  pointsPerReTweet?: number;
  individualDuration?: number;
};

export type PartnerTask = {
  projectId: number;
  projectLink?: string;
  tasksCount: number;
};

export enum SuggestionStatus {
  OnReview = 'onReview',
  Confirmed = 'confirmed',
  Rejected = 'rejected',
}

export type CompletedLoyaltyTask = {
  loyaltyTaskId: number;
  completedAt: Date;
  body: CompletedLoyaltyTaskBody;
};

export type CompletedLoyaltyTaskBody = {
  additionalProgram?: AdditionalProgramProgress;
  suggestion?: SuggestionProgress;
  email?: string;
  answer?: string;
  redirectLink?: string;
  description?: string;
};

export type AdditionalProgramProgress = {
  earnedPoints?: number;
  tweetId: string;
  additionalProgramEndAt: Date;
  likes?: TweetStatsRecord;
  reTweets?: TweetStatsRecord;
};

export type TweetStatsRecord = {
  count: number;
  users: string[];
};

export type SuggestionProgress = {
  description?: string;
};

export interface GetLoyaltyProjectShort {
  // common
  id: number;
  partnerProjects: PartnerProject[];
  status: LoyaltyProjectStatuses;
  startAt: Date | null;
  endAt: Date | null;
  title: string; // or projectName
  rewards: Rewards;
  linkTitle: string;
  tasksCount: {
    tasksDone: number;
    totalTasks: number;
  };

  // admin panel
  projectType: QuestType;

  // homepage
  preview_img: string | null;
}
export interface GetLoyaltyProjectsResponse {
  loyaltyProjects: GetLoyaltyProjectShort[];
  projectsTitle: string[];
  isShowMore: boolean;
  searchCount: number | null;
}

export interface LoyaltyProjectsScoreboard extends LoyaltyProjectUsersScoreboard {
  id: number;
  place: number;
  status?: StickyMenuInvestorInfoLuckDrawStatus;
}

export interface LoyaltyProjectUsersScoreboard {
  wallet: string;
  earnedPoints: number;
  place?: number;
  // projectTasksCount: number;
  // completedProjectTasksCount: number;
}

export interface LoyaltyProjectsScoreboardResponse extends IPagination<any> {
  scoreboard: LoyaltyProjectsScoreboard[];
  userInfo?: LoyaltyProjectUsersScoreboard | null;
  page: number;
  pageSize: number;
  luckyDrawWinnersCount?: number | null;
  eligibleUsersCount?: number | null;
}

export interface GetLoyaltyEvent {
  title: string | null;
  description: string;
  bucket: string;
}
