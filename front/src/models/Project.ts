import { IProjectSale } from "@modules/project/models";

enum ESocialMedia {
  facebook = "facebook",
  twitter = "twitter",
  instagram = "instagram",
  telegram = "telegram",
  discord = "discord",
  reddit = "reddit",
  youtube = "youtube",
  medium = "medium",
}

interface IMedia {
  discord?: string | null;
  telegram?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  whitepaper?: string | null;
  projectSite?: string | null;
  facebook?: string | null;
  reddit?: string | null;
  youtube?: string | null;
  medium?: string | null;
  github?: string | null;
  linkedin?: string | null;
}

export interface IGroupedProjects {
  liveProjects: IProjects[];
  previousProjects: IProjects[];
  upcomingProjects: IProjects[];
}

interface IWhitelistForProject {
  projectId: number;
  projectName: string;
  projectInfo: string | null;
  basicInfo: string | null;
  socialTasks?: ISocialTask[];
}

interface ISocialTask {
  id: number;
  socialMedia: ESocialMedia;
  taskTitle: string;
  taskDescription: string;
  actionTitle: string;
  actionLink: string;
}

enum EProjectStatus {
  OpenWhitelisting = "Whitelisting Open",
  ClosedWhitelisting = "Whitelisting Closed",
  Sale = "Sale",
  Ended = "Ended",
  Live = "Live",
  Applied = "Applied",
  Whitelisted = "Whitelisted",
  NotWhitelisted = "Not Whitelisted",
  NotFunded = "Not Funded",
  Participated = "Participated",
}

export interface IProject {
  redirectUrl?: string;
  id: number;
  backgroundImage: string;
  subscribeStartAt: string | null;
  subscribeEndAt: string | null;
  projectName: string;
  shortDescription: string;
  media: IMedia[];
  projectDescription: string;
  projectStartAt: string | null;
  projectEndAt: string | null;
  participateButton: string | null;
  bucket: string;
  projectCurrency: string | null;
  tokenSymbol: string;
  tokenAvatar: string;
  isNFT: boolean;
  projectCurrencyAddress: string | null;
  projectAddress: string;
  showStickyMenu: boolean;
  chainId: number;
  projectCurrencyIcon: string;
  status: EProjectStatus | null;
  linkTitle: string;
  projectNetwork: string;
  sales: IProjectSale[];
  whitelist?: IWhitelistForProject | null;
  withWhitelist: boolean;
}

export interface IProjects {
  id: number;
  previewImage: string;
  subscribeStartAt: string | null;
  subscribeEndAt: string | null;
  projectName: string;
  shortDescription: string;
  projectStartAt: string | null;
  projectEndAt: string | null;
  hardcap: number | null;
  projectCurrency: string | null;
  linkTitle: string | null;
  status: EProjectStatus | null;
  network: string | any;
  isNFT: boolean;
}

export type IInvitedUserStatus = "pending" | "accepted" | "rejected" | "leaved";

export interface IInvitedUser {
  investorId: number;
  status: IInvitedUserStatus;
  email: string;
}
