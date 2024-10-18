export interface GetProjects {
  id: number;
  previewImage: string;
  subscribeStartAt: Date | null;
  subscribeEndAt: Date | null;
  projectName: string;
  projectStartAt: Date | null;
  projectEndAt: Date | null;
  hardcap: number | null;
  projectCurrency: string | null;
  linkTitle: string | null;
  status: ProjectStatus | null;
  network: string | any;
  isNFT: boolean;
}
export enum ProjectStatus {
  OpenWhitelisting = 'Whitelisting Open',
  ClosedWhitelisting = 'Whitelisting Closed',
  Sale = 'Sale',
  Ended = 'Ended',
  Live = 'Live',
  Applied = 'Applied',
  Whitelisted = 'Whitelisted',
  NotWhitelisted = 'Not Whitelisted',
  NotFunded = 'Not Funded',
  Participated = 'Participated',
}

export enum SocialMedia {
  facebook = 'facebook',
  twitter = 'twitter',
  instagram = 'instagram',
  telegram = 'telegram',
  discord = 'discord',
  reddit = 'reddit',
  youtube = 'youtube',
  medium = 'medium',
}

export interface HeroSectionData {
  createdAt: string;
  description: string;
  linkTitle: string;
  image: string;
  projectId: number;
  projectName: string;
  priorityNumber: number;
  status: boolean;
  updatedAt: string;
}

export interface DashboardSale {
  previewImage: string;
  projectName: string;
  tokenSymbol: string;
  boughtAllocation: number;
  claimedAllocation: number;
  nextClaimDate: Date;
  saleId: string;
  projectAddress: string;
  projectCurrency: string;
  pricePerToken: number;
  availableClaim: number;
  isNFT: boolean;
}

export interface DashboardProject {
  projectId: number;
  projectName: string;
  projectNetwork: string;
  projectStartAt: Date | null;
  projectEndAt: Date | null;
  status: string | null;
  linkTitle: string | null;
}

export interface GetPartners {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  priorityNumber: number;
}

export interface GetEvent {
  title: string | null;
  description: string;
  link: string;
  isBanner: boolean;
  bucket: string;
}

export enum EntryFlowEnum {
  Create = 'create',
  Login = 'login',
}

export enum TokensStorageHistoryTypes {
  loyaltyProject = 'loyaltyProject',
  referral = 'referral',
  gameBet = 'game_bet',
  gameWin = 'game_win',
  gameCancel = 'game_cancel',
}

export interface UserStatsObject {
  id: string;
  username: string;
}
