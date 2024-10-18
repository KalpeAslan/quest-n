import { LoyaltyTaskType, PartnerTask } from '../../../interfaces/loyalty';
import {
  BlockchainUserTaskBody,
  BridgeTaskBody,
  DEXTaskBody,
  NativeHolderTaskBody,
  NFTTaskBody,
  ValueHolderTaskBody,
  webhookDetails,
} from '../tasks';
import { Networks, NFTTypes } from '../../../interfaces/blockchain.types';

export abstract class CreatingLoyaltyTaskDto {
  title!: string;
  points!: number;
  startAt?: Date | null;
  languages?: Array<string>;
  endAt?: Date | null;
  sortOrder?: number;
  required?: boolean;
  experienceTaskId?: number;
}

export abstract class UpdatingLoyaltyTaskDto {
  title?: string | null;
  points?: number | null;
  startAt?: Date | null;
  endAt?: Date | null;
  sortOrder?: number;
  required?: boolean;
  experienceTaskId?: number;
}

// VisitLink ---------- START
export class CreateVisitLinkLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.VisitLink;
  link!: string;
  description!: string;
}

export class UpdateVisitLinkLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.VisitLink;
  link?: string;
  description?: string;
}
// VisitLink ------------ END

// Quiz ---------- START
export class CreateQuizLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.Quiz;
  description!: string;
  answers!: Array<string>;
  maxAnswers!: number;
}

export class UpdateQuizLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.Quiz;
  description?: string;
  answers?: Array<string> | null;
  maxAnswers!: number;
}
// Quiz ------------ END

// ReferralLink ------- START
export class CreateReferralLinkLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.ReferralLink;
  redirectLink!: string;
  description!: string;
}

export class UpdateReferralLinkLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.ReferralLink;
  redirectLink?: string | null;
  description?: string;
}
// ReferralLink --------- END
// Partner ------- START
export class CreatePartnerLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.Partner;
  description!: string;
  partnerTask!: PartnerTask;
}

export class UpdatePartnerLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.Partner;
  description?: string;
  partnerTask?: PartnerTask;
}
// Partner --------- END

// SignUp ------- START
export class CreateSignUpLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.SignUp;
  description!: string;
  onboardingTitle!: string;
  onboardingDescription!: string;
  isOnboardingTask!: boolean;
}

export class UpdateSignUpLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.SignUp;
  description?: string;
  onboardingTitle?: string;
  onboardingDescription?: string;
  isOnboardingTask?: boolean;
}
// SignUp --------- END

// WatchVideo ------- START
export class CreateWatchVideoLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.WatchVideo;
  description!: string;
  onboardingTitle?: string;
  onboardingDescription?: string;
  videoId!: string;
  isOnboardingTask?: boolean;
}

export class UpdateWatchVideoLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.WatchVideo;
  description?: string;
  onboardingTitle?: string;
  onboardingDescription?: string;
  videoId?: string;
  isOnboardingTask?: boolean;
}
// WatchVideo --------- END

// CompletedOnboarding ------- START
export class CreateCompletedOnboardingLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.CompletedOnboarding;
  description!: string;
  buttonText!: string;
  linkTitle!: string;
}

export class UpdateCompletedOnboardingLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.CompletedOnboarding;
  description?: string | null;
  buttonText?: string | null;
  linkTitle?: string | null;
}
// CompletedOnboarding --------- END

abstract class BaseTokenTask extends CreatingLoyaltyTaskDto {
  description: string;

  address: string;

  minTokenAmount: number;

  chainId: Networks;
}

export class CreateTokenLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  description!: string;
  address: string;
  minTokenAmount!: number;
  chainId: Networks;
  type!: LoyaltyTaskType.Token;
  decimals!: number;
}

export class UpdateTokenLoyaltyTaskDto extends CreateTokenLoyaltyTaskDto {}

export class CreateNFTLoyaltyTaskDto extends BaseTokenTask implements NFTTaskBody {
  standard!: NFTTypes;
  type!: LoyaltyTaskType.NFT;
  decimals!: number;
}

export class UpdateNFTLoyaltyTaskDto extends CreateNFTLoyaltyTaskDto {}

export class CreateBlockchainUserLoyaltyTaskDto extends CreatingLoyaltyTaskDto implements BlockchainUserTaskBody {
  description: string;

  minTransactions: number;

  chainId: Networks;

  type!: LoyaltyTaskType.BlockchainUser;
}

export class UpdateBlockchainUserLoyaltyTaskDto extends CreateBlockchainUserLoyaltyTaskDto {}

export class CreateValueHolderLoyaltyTaskDto extends CreatingLoyaltyTaskDto implements ValueHolderTaskBody {
  description: string;

  minUSDValue: number;

  chainId: Networks;

  type!: LoyaltyTaskType.ValueHolder;
}

export class UpdateValueHolderLoyaltyTaskDto extends CreatingLoyaltyTaskDto implements ValueHolderTaskBody {
  description: string;

  minUSDValue: number;

  chainId: Networks;

  type!: LoyaltyTaskType.ValueHolder;
}

export class CreateNativeHolderLoyaltyTaskDto extends CreatingLoyaltyTaskDto implements NativeHolderTaskBody {
  description: string;

  minValue: number;

  chainId: Networks;

  type!: LoyaltyTaskType.NativeHolder;
}

export class UpdateNativeHolderLoyaltyTaskDto extends CreatingLoyaltyTaskDto implements NativeHolderTaskBody {
  description: string;

  minValue: number;

  chainId: Networks;

  type!: LoyaltyTaskType.NativeHolder;
}

// Create Daily Tasks
export class CreateDailyTasksDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.Daily;
  description!: string;
  subTasks!: any[];
}

export class UpdateDailyTasksDto extends CreateDailyTasksDto {}

export class CreateCustomWebhookTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.CustomWebhook;
  description!: string;
  webhookDetails!: webhookDetails;
}

export class UpdateCustomWebhookTaskDto extends CreateCustomWebhookTaskDto {}

export class CreateDEXLiquidityProviderTaskDTO extends CreatingLoyaltyTaskDto implements DEXTaskBody {
  contractAddress: string;
  description: string;
  chainId: Networks;
  methodAbi: any[];
  eventsQuantity?: number | null;
  type!: LoyaltyTaskType.DEXLiquidityProvider;
}

export class UpdateDEXLiquidityProviderTaskDTO extends CreatingLoyaltyTaskDto implements DEXTaskBody {
  contractAddress: string;
  description: string;
  chainId: Networks;
  methodAbi: string[];
  eventsQuantity?: number | null;
  type!: LoyaltyTaskType.DEXLiquidityProvider;
}

export class CreateImageUploadTaskDTO extends CreatingLoyaltyTaskDto {
  description: string;
  type!: LoyaltyTaskType.ImageUpload;
}

export class UploadImageUploadTaskDTO extends UpdatingLoyaltyTaskDto {
  description: string;
  type!: LoyaltyTaskType.ImageUpload;
}

export class CreateInviteTaskDTO extends CreatingLoyaltyTaskDto {
  title!: string;
  description: string;
  type!: LoyaltyTaskType.Invite;
  scorePercentage: number;
  languages?: Array<string>;
  username?: string;
}

export class UpdateInviteTaskDTO extends CreateInviteTaskDTO {}

export class CreateBridgeTaskDTO extends CreatingLoyaltyTaskDto implements BridgeTaskBody {
  bridgeAddress: string;
  description: string;
  chainId: Networks;
  methodAbi: any[];
  type!: LoyaltyTaskType.Bridge;
  tokenAddress: string;
  threshold?: number;
}

export class UpdateBridgeTaskDTO extends CreatingLoyaltyTaskDto implements BridgeTaskBody {
  bridgeAddress: string;
  description: string;
  chainId: Networks;
  methodAbi: any[];
  type!: LoyaltyTaskType.Bridge;
  tokenAddress: string;
  threshold?: number;
}

export class CreateOnChainEventTaskDTO extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.OnChainEvent;
  description!: string;
  contractAddress!: string;
  chainId!: string;
  abi!: string;
  eventName!: string;
  eventsQuantity?: number | null;
  conditions!: {
    fieldName: string;
    gt: number;
    lt: number;
  }[];
}

export class UpdateOnChainEventTaskDTO extends CreatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.OnChainEvent;
  description?: string;
  contractAddress?: string;
  chainId?: string;
  abi?: string;
  eventName?: string;
  eventsQuantity?: number | null;
  conditions?: {
    fieldName: string;
    gt: number;
    lt: number;
  }[];
}
