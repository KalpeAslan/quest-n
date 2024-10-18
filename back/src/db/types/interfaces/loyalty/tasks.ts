import { AdditionalProgram, PartnerTask } from './index';
import { Networks, NFTTypes } from '../blockchain.types';
import { LoyaltyTask } from '../../../entity';

export interface VisitLinkLoyaltyTaskBody {
  link: string;
  description: string | null;
}

export interface OnChainEventLoyaltyTaskBody {
  description: string;
  contractAddress: string;
  chainId: string;
  abi: string;
  eventName: string;
  eventsQuantity?: number | null;
  conditions: {
    fieldName: string;
    gt: number;
    lt: number;
  }[];
}

export interface ReferralLinkLoyaltyTaskBody {
  redirectLink: string;
  description: string | null;
}

export interface QuizLoyaltyTaskBody {
  description: string;
  answers: Array<string>;
  languages: Array<string>;
  maxAnswers: number;
}

export interface FollowTwitterLoyaltyTaskBody {
  username: string;
  userId: string;
  description: string | null;
}

export interface MentionTwitterLoyaltyTaskBody {
  mentionUserId: string;
  mentionUserName: string;
  description: string | null;
  additionalProgram: AdditionalProgram | null;
}

export interface TweetTwitterLoyaltyTaskBody {
  tweetText: string;
  description: string | null;
}

export interface ReTweetTwitterLoyaltyTaskBody {
  tweetId: string;
  tweetLink?: string;
  description: string | null;
}

export interface ReTweetQuoteTwitterLoyaltyTaskBody {
  tweetId: string;
  tweetLink?: string;
  description: string | null;
  additionalProgram: AdditionalProgram | null;
}

export interface LikeTwitterLoyaltyTaskBody {
  tweetId: string;
  tweetLink?: string;
  description: string | null;
  additionalProgram: AdditionalProgram | null;
}

export interface CheckSpaceTwitterLoyaltyTaskBody {
  description: string;
  redirectLink: string;
}

export interface SuggestionLoyaltyTaskBody {
  description: string;
  regex?: string;
  uniqueOnly?: boolean;
}

export interface EmailLoyaltyTaskBody {
  description: string;
}

export interface JoinDiscordLoyaltyTaskBody {
  inviteLink: string;
  description: string | null;
  serverId?: string;
}

export interface RoleDiscordLoyaltyTaskBody {
  serverId?: string;
  roleId: string;
  roleName: string;
  description: string | null;
  inviteLink?: string;
}

export interface PartnerLoyaltyTaskBody {
  description: string | null;
  partnerTask: PartnerTask;
}

export interface JoinTelegramLoyaltyTaskBody {
  description: string | null;
  chatId: string;
  inviteLink: string;
}

export interface SignUpLoyaltyTaskBody {
  description: string;
  isOnboardingTask: boolean;
  onboardingTitle: string;
  onboardingDescription: string;
}

export interface WatchVideoLoyaltyTaskBody {
  description?: null;
  isOnboardingTask: boolean;
  videoId: string;
  onboardingTitle: string;
  onboardingDescription: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CompleteOnboardingLoyaltyTaskBody {
  description: string;
  isOnboardingTask: boolean;
  buttonText: string;
  linkTitle: string;
}

export interface ITokenBaseTaskBody {
  chainId: Networks;
  description: string;
  address: string;
  minTokenAmount: number;
}

export interface TokenTaskBody extends ITokenBaseTaskBody {
  decimals?: number;
}

export interface NFTTaskBody extends ITokenBaseTaskBody {
  standard: NFTTypes;
}

export interface BlockchainUserTaskBody {
  description: string;
  minTransactions: number;
  chainId: Networks;
}

export interface ValueHolderTaskBody {
  description: string;
  minUSDValue: number;
  chainId: Networks;
}

export interface NativeHolderTaskBody {
  description: string;
  minValue: number;
  chainId: Networks;
}

// Daily Task Body

export interface DailyTaskBody {
  description: string;
  subTasks: DailyTask[];
  total?: number;
}

export interface DailyTask {
  id: number;
  title: string;
  description: string;
  regex: string;
  startAt: Date;
  endAt: Date;
  points: number;
}

export interface DailyTaskProgressBody {
  id: number;
  answer: string;
  day: number;
  status: DailyStatus;
}

export enum DailyStatus {
  OnReview = 'onReview',
  Confirmed = 'confirmed',
  Rejected = 'rejected',
  Expired = 'expired',
  Active = 'active',
}

export type webhookDetails = {
  method: string;
  path: string;
  userInput: {
    keyOptions: {
      text: string | string[];
      email: string | string[];
      phone: string | string[];
      wallet: string | string[];
    };
    inputOptions: ('text' | 'email' | 'phone' | 'wallet')[];
    isPathPart: boolean;
    isBodyPart: boolean;
  };
  headers: any;
  body: any;
  successfulResponseOptions: {
    key: string;
    value?: any;
    checkExists?: boolean;
  }[];
  failureResponseOptions: {
    key: string;
    value: any;
  }[];
  uniqueOnly?: boolean;
};
export interface CustomWebhookTaskBody {
  description: string;
  webhookDetails: webhookDetails;
}

export interface ImageUploadTaskBody {
  description: string;
}

export interface InviteTaskBody {
  inviteCode: string;
  description: string;
  inviteCount: number;
  scorePercentage: number;
  invitedInvestorIds: number[];
  username?: string;
}

export interface DEXTaskBody {
  contractAddress: string;
  description: string;
  chainId: Networks;
  methodAbi: any[];
  eventsQuantity?: number | null;
}

export interface BridgeTaskBody {
  bridgeAddress: string;
  description: string;
  chainId: Networks;
  methodAbi: any[];
  tokenAddress: string;
  threshold?: number;
}

export interface GitCoinTaskBody {
  description: string;
  threshold: number;
  gitCoinScorerId?: string;
  gitCoinApiKey?: string;
}

export interface CompletedTaskResponse {
  status: boolean;
  body: Record<string, string | number | boolean>;
  loyaltyTask?: LoyaltyTask;
}
