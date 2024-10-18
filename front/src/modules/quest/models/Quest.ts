import { ILoyaltyTask, ILoyaltyProjectFullReward } from "@models";
import { AnySchema } from "yup";
import { TSelectedTab } from "@/modules/quest/components/createQuestSteps/RewardsStep/rewardsTypes.types";

export interface IQuestShort {
  // common
  id: number;
  partnerProjects: PartnerProject[];
  status: LoyaltyProjectStatuses;
  startAt: string | null;
  endAt: string | null;
  title: string; // or projectName
  rewards: Rewards;
  linkTitle: string;
  tasksCount: {
    tasksDone: number;
    totalTasks: number;
  };
  totalExp: number;

  // admin panel
  projectType: EProjectType;
  shortDescription: string;

  // homepage
  preview_img: string | null;
  questStatus: QuestStatus;
}

export type IQuestReward = {
  value: number;
  selectedTab: TSelectedTab;
  nftImage?: File;
  nftName?: string;
  collectionId?: number;
  id?: number;
};

export type IQuestRewards = IQuestReward[];

export interface TRewardsPlacement {
  endPlace: number;
  amount: number;
  id?: number;
}

export interface QuestRewards {
  contract: RewardToken;
  id?: number;
  amount: number | "-";
  isClaimable: boolean;
  description: string;
  startPlace: number;
  endPlace: number;
  loyaltyProjectId: number;
  contractId: number;
  tokenType: EReward;
  tokenIds?: number[];
  rewards?: TRewardsPlacement[];
}

export interface ILoyaltyProject {
  id: number;
  linkTitle: string;
  title: string;
  partnerProjects: PartnerProject[];
  status: LoyaltyProjectStatuses;
  projectType: EProjectType;
  rewards: Rewards;
  startAt: string | null;
  endAt: string | null;
  claimingStartAt: string | null;
  claimingEndAt: string | null;
  description: string;
  socialDescription: string;
  loyaltyTasks?: ILoyaltyTask[];
  preview_img: string | null;
  fullRewards:
    | { rewards: ILoyaltyProjectFullReward[] }
    | ILoyaltyProjectFullReward[];
  participants: number;
  eligibleUsersCount: number | null;
  threshold: number | null;
  questStatus: QuestStatus;
}

export interface IGetLoyaltyProjects {
  searchCount: number;
  isShowMore: boolean;
  loyaltyProjects: IQuestShort[];
  projectsTitle: string[];
}

export enum LoyaltyProjectReward {
  Token = "Token",
  NFT = "NFT",
  Whitelist = "Whitelist",
}

export enum LoyaltyProjectTrending {
  Trending = "Trending",
  Newest = "Newest",
}

export interface IPrizePool {
  rewards: ILoyaltyProjectFullReward[];
  points: number;
}

export interface StickyMenuInvestorInfo {
  earnedPoints: number;
  claimingTransactions: Record<number, string>;
  isAqClaimed: boolean;
  scoreboard: {
    place: number;
    currentPrizePool: IPrizePool;
    nextPrizePool: IPrizePool;
    rewardsTable: RewardTable[];
    nftOrder: Record<string, number>;
  };
  luckyDraw: {
    isWinner: boolean;
    eligibleUsersCount: number;
  };
}

export type StickyMenuInvestorInfoLuckDrawStatus =
  | "notEligible"
  | "eligible"
  | "loser"
  | "winner";

export interface LoyaltyProjectsScoreboard {
  id: number;
  place: number;
  wallet: string;
  earnedPoints: number;
  status: StickyMenuInvestorInfoLuckDrawStatus;
  selected?: boolean;
}

interface Investor {
  id: number;
  analytics_id: string;
  username: string;
  gamesSessions: any[]; // Replace 'any' with the correct type if known
  createdAt: string;
  updatedAt: string;
  experienceLevelId: number | null;
  lastActivity: string | null;
}

export interface LoyaltyProjectsLuckyDrawWinner {
  investorId: number;
  username: string;
  image: string;
}

export interface RewardTable {
  startPlace: number;
  endPlace: number;
  rewards: ILoyaltyProjectFullReward[];
  place?: string;
  placeRewards?: string;
}

export enum LoyaltyProjectStatuses {
  Soon = "soon",
  Expired = "expired",
  Participating = "participating",
  Active = "active",
  Draft = "draft",
  Win = "win",
}

export enum ECreateQuestSteps {
  Setup = "setup",
  SelectTasks = "tasks",
  Rewards = "rewards",
}

export interface PartnerProject {
  logo?: string | null | undefined;
  verificationIcon: boolean;
  name: string;
  linkTitle: string;
}

export interface PartnerProjectAdmin extends PartnerProject {
  isDelegated?: boolean;
  quests: {
    status: LoyaltyProjectStatuses;
    questStatus?: QuestStatus;
    id: number;
  }[];
}

export interface Rewards {
  whitelisting?: boolean | undefined;
  tokens: RewardToken[];
}

export enum EReward {
  TOKEN = "token",
  NFT = "nft",
  AQ = "aq",
  WHITELIST = "whitelist",
}

export interface RewardToken {
  id?: string | number;
  symbol: string;
  amount: string | number;
  logo?: string;
  type: EReward;
  investorId?: number | null;
}

export interface ILoyaltyMultipleSuggestion {
  status: "onReview" | "confirmed" | "rejected";
  email: string;
  description: string;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  username: string;
  photo_url: string;
  auth_date: number;
  hash: string;
}

export interface IPartnerProject {
  linkTitle: string;
  name: string;
  logo: string;
  verificationIcon: boolean;
  shortDescription: string;
  projectDescription: string;
  socialDescription: string;
  participants: number;
  createdAt: Date;
  isDelegated?: boolean;
}

export interface AdditionalField {
  type: "number" | "text" | "selector" | "wyziwyg" | "multiline";
  title: string;
  name: string;
  schema: AnySchema;
  selectorOptions?: { value: string; title: string }[];
  isTwitterUsername?: boolean;
  path?: string;
  json?: boolean;
  hidden?: boolean;
  placeholder?: string;
}

export enum EProjectType {
  Scoreboard = "scoreboard",
  LuckyDraw = "luckyDraw",
  Guaranteed = "guaranteed",
}

export interface IQuestForPreview extends ILoyaltyProject {
  projectInvestorInfo?: StickyMenuInvestorInfo;
  luckyDrawWinnersCount?: number;
}

export interface INftClaimResponse {
  questId_: number;
  rewardId_: number;
  userId_: number;
  token_: string;
  tokenIds_: number[];
  tokenAmounts_: number[];
  treasurySignature_: string;
}

export interface ITokenClaimResponse {
  questId_: number;
  rewardId_: number;
  userId_: number;
  token_: string;
  amount_: number;
  treasurySignature_: string;
}

export interface IClaimResponse {
  data: INftClaimResponse | ITokenClaimResponse | null;
  success: boolean;
}

export enum EQuestAdminStep {
  init = "/admin/project/[linkTitle]/quest/create/[step]",
  create = "/admin/quest/[quest]/create/[step]",
  edit = "/admin/project/[linkTitle]/quest/[quest]/edit/[step]",
}

export enum QuestStatus {
  Active = "Active",
  Draft = "Draft",
  Completed = "Completed",
  Soon = "Soon"
}
