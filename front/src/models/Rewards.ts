import { EReward } from "@/modules/quest/models";
import { ENetworks, ETokenType } from "./Quest";

export interface IRewardPlacementItem {
  id?: number;
  endPlace: number;
  amount: number;
}

export enum ERewardTabs {
  TOKEN = "token",
  NFT = "nft",
  WHITELIST = "whitelist",
}

export interface ITokenData {
  rewards: IRewardPlacementItem[];
  errors: boolean[];
  contractId: number | null;
  luckyDrawAmount: number;
  luckyDrawRewardId?: number;
}

export interface INftData {
  rewards: IRewardPlacementItem[];
  errors: boolean[];
  contractId: number | null;
  image: File | string;
  name: string;
  nameError: string;
  luckyDrawAmount: number;
  luckyDrawRewardId?: number;
}

export interface IWhitelistData {
  rewardId?: number;
  name: string;
  description: string;
  endPlace: number;
  error: string;
}

export interface ICreateReward {
  id: number;
  activeTab: ERewardTabs;
  verified: boolean;
  token: ITokenData;
  nft: INftData;
  whitelist: IWhitelistData;
}

export type TCreateRewards = Record<number, ICreateReward>;

export interface INftRewardResponse {
  questId_: number;
  token_: string;
  amount_: number;
  rewardIds_: number[];
  nonce_: number;
  collectionSignature_: string;
  treasurySignature_: string;
}

export interface ITokenRewardResponse {
  questId_: number;
  amount_: number;
  token_: string;
  rewardIds_: number[];
  signature_: string;
}

export interface ICreateRewardPlacement {
  id?: number;
  amount: number;
  startPlace: number;
  endPlace: number;
}

export interface ICreateNftRewardDto {
  name: string;
  contractId: number;
  loyaltyProjectId: number;
  rewards: ICreateRewardPlacement[];
  image?: string;
}

export interface ICreateTokenRewardDto {
  contractId: number;
  loyaltyProjectId: number;
  rewards: ICreateRewardPlacement[];
}

export interface ICreateWhitelistRewardDto {
  id?: number;
  name: string;
  description: string;
  startPlace: number;
  endPlace: number;
  loyaltyProjectId: number;
}

export type TVerifyNftRewardsResponse = Record<
  `0x${string}`,
  { rewardId: number; isVerified: boolean }[]
>;

export enum ETokenStandard {
  ERC20 = "erc20",
  ERC721 = "erc721",
  ERC1155 = "erc1155",
}

export interface ContractResponse {
  userId_: number;
  collectionId_: number;
  name_: string;
  symbol_: string;
  baseUri_: string;
  transferable_: boolean;
  signature_: string;
}

export interface IContract {
  id: number;
  name: string;
  symbol: string;
  logo: string | null;
  decimals: number | null;
  chainId: ENetworks | null;
  address: `0x${string}` | null;
  standard: ETokenStandard | null;
  type: ETokenType;
  investorId: number | null;
  isVerified?: boolean;
}

export interface INft {
  id: number;
  nftId: number;
  image: string;
  name: string;
  contractId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoyaltyProjectFullReward {
  id: number;
  amount: number;
  isClaimable: boolean;
  description: string;
  startPlace: number;
  endPlace: number;
  loyaltyProjectId: number;
  contractId: number;
  verified: boolean;
  tokenIds: number[] | null;
  contract: IContract;
  tokenType: EReward;
}

export interface IFullRewardWithNft extends ILoyaltyProjectFullReward {
  nftMetadata?: INft;
}
