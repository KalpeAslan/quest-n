import { TRewardsPlacement } from "@modules/quest/models";
import { TSelectedTab } from "@/modules/quest/components/createQuestSteps/RewardsStep/rewardsTypes.types";

export interface CreateReward {
  nft: NFTRewards;
  token: TokenRewards;
  whitelisting: WhitelistingRewards;
  customToken: CustomTokenNameRewards;
  customNft: CustomNftRewards;
  setRewardValue: Setter<number>;
  rewardValue?: number;
}

export interface CreateRewardSetters {
  setTokenRewards: Setter<TRewardsPlacement[]>;
  setTokenType: Setter<string | number>;
  setTokenAmount: Setter<number>;
  setNftRewards: Setter<TRewardsPlacement[]>;
  setNftType: Setter<string | number>;
  setNftAmount: Setter<number>;
  setWhitelistingName: Setter<string>;
  setWhitelistingEndPlace: Setter<number>;
  setWhitelistTokenId: Setter<number | null>;
}

type Setter<T> = (v: T) => void;

export interface TokenRewards {
  tokenRewards: TRewardsPlacement[];
  tokenType: string | number;
  tokenAmount: number;
  tokenErrors: boolean[];
  setTokenRewards: Setter<TRewardsPlacement[]>;
  setTokenErrors: Setter<boolean[]>;
  setTokenType: Setter<string | number>;
  setTokenAmount: Setter<number>;
}

export interface NFTRewards {
  nftRewards: TRewardsPlacement[];
  nftType: string | number;
  nftAmount: number;
  nftErrors: boolean[];
  setNftType: Setter<string | number>;
  setNftRewards: Setter<TRewardsPlacement[]>;
  setNftErrors: Setter<boolean[]>;
  setNftAmount: Setter<number>;
}

export interface WhitelistingRewards {
  whitelistingName: string;
  setWhitelistingName: Setter<string>;
  whitelistingEndPlace: number;
  whitelistingError: string[];
  setWhitelistingEndPlace: Setter<number>;
  setWhitelistingError: Setter<string[]>;
  setWhitelistTokenId: Setter<number | null>;
}

interface CustomTokenNameRewards {
  customTokenName: string;
  setCustomTokenName: Setter<string>;
  setCustomTokenNameError: Setter<string>;
  customTokenNameError: string[];
}

interface CustomNftRewards {
  customNft: string;
  setCustomNft: Setter<string>;
  setCustomNftError: Setter<string>;
  customNftError: string[];
}

export interface CreateRewards {
  startPlace?: number;
  endPlace?: number;
  contractId: number | string | null;
  amount: number | string;
  isClaimable: boolean;
  description?: string;
  loyaltyProjectId: number | null;
  id?: number | null;
  type: TSelectedTab;
  whiteListingName?: string;
}


export enum DraftButtonStatuses {
  hide,
  show
}