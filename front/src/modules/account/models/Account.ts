import { ExperienceLevel, IContract } from "@models";
import {
  EProjectType,
  ILoyaltyProject,
  LoyaltyProjectStatuses,
} from "@modules/quest/models";

export type TSettingsTabs = "Personal info" | "Security" | "Delete";
export type TAccountTabs = "AQ Balance" | "Settings";

export interface IPutInvestor {
  username?: string;
  wallet?: string;
  signature?: string;
  referralCode?: string;
}

enum EEntryFlow {
  Create = "create",
  Login = "login",
}

export type TSocialAuthType =
  | "twitter"
  | "discord"
  | "google"
  | "telegram"
  | "creds"
  | "wallet"
  | null;

export type TCredsAuthType = "email" | "phone";

export type TAuthType = "twitter" | "google" | "email" | "phone" | "wallet";

interface EmailRegistrationResponse {
  flow: string;
  email: string;
}

interface PhoneRegistrationResponse {
  confirmToken: string;
  flow: string;
  phoneNumber: string;
}

interface SocialEntry2faResponse {
  twoFactorAuthToken: string;
  entryUsername: string;
  twoFactorAuth: boolean;
  flow: EEntryFlow;
  phoneNumber: string;
}

export interface SuccessfulEntryResponse {
  accessToken: string;
  refreshToken: string;
  flow: EEntryFlow;
  entryUsername: string | undefined;
}

export type EntryRegistrationResponse =
  | (Partial<EmailRegistrationResponse> &
      Partial<PhoneRegistrationResponse> &
      Partial<SocialEntry2faResponse> &
      Partial<SuccessfulEntryResponse>)
  | undefined;

export type EntryLoginResponse =
  | (Partial<SocialEntry2faResponse> & Partial<SuccessfulEntryResponse>)
  | undefined;

export interface EntryResendPhoneVerificationResponse {
  confirmToken: string;
  flow: EEntryFlow;
  phoneNumber: string;
}

export interface IAccount {
  connected: boolean | null;
  image?: string;
  canBeReferral?: boolean;
  wallet: string | null;
  username: string;
  analytics_id?: string;
  investorCreatingTime?: number;
  activeQuests?: number;
  totalQuests?: number;
  isReferral?: boolean;
  referralCode?: string;
  investorId?: number | string;
  connectedAccounts: {
    twitter: string | null;
    discord: string | null;
    telegram: string | null;
    google: string | null;
    email: string | null;
    phone: string | null;
  };
  security?: {
    twoFactorAuth: boolean;
    phoneNumber: string | null;
  };
  referralInfo: {
    // levels: ILevel[];
    availableReferralIncome: IAvailableReferralIncome | null;
    currentReferralRank: ICurrentReferralRank | null;
    referralProfitByMonth: IReferralProfitByMonth | null;
    referralProfit: IReferralProfit;
    referralProfitValue: number;
    claimableReferralProfit: number;
    referralCode: string;
    referralsCount: number;
    referralsByRanks: any;
  };
  questInfo: IQuestInfo | null;
  currentLevel?: ExperienceLevel | null;
  referrerCode: IReferrerCode | null;
  pendingInvitesToPartnerProject: IPendingInviteToPartnerProject[];
}

export interface IGetUseAnalyticsInfo {
  analytics_id: string;
  wallet: string | null;
  activeQuests: number;
  experienceLevel: ExperienceLevel;
  totalQuests: number;
  investorCreatingTime: number;
  investorId: number;
  isReferral: boolean;
  username: string;
  referrerCode: IReferrerCode;
  isNewNotificationsExist: boolean;
  pendingInvitesToPartnerProject: IPendingInviteToPartnerProject[];
}

export interface IGetUserProfile {
  canBeReferral: boolean;
  connectedAccounts: {
    twitter: string | null;
    discord: string | null;
    telegram: string | null;
    google: string | null;
    email: string | null;
    phone: string | null;
  };
  referralInfo: {
    referralProfit: number;
    claimableReferralProfit: number;
    referralCode: string;
  };
  questInfo: IQuestInfo;
  security: {
    twoFactorAuth: boolean;
    phoneNumber: string | null;
  };
}

export interface IGetUserReferral {
  ReferralProfit: IReferralProfit;
  CurrentReferralRank: ICurrentReferralRank;
  ReferralProfitByMonth: IReferralProfitByMonth;
  code: string;
}

export interface IALoyaltyProjects {
  profit: number;
  title: string;
}

export interface IReferralInfoHistory {
  amount: number;
  createdAt: Date;
}

export interface ReferralRanksRule {
  code: string;
  max_value: number;
  min_value: number;
  percentage: number;
}

interface IAvailableReferralIncome {
  availableToClaim: number;
  referralIncomesLastMounth: number;
}

export interface I2FaData {
  phoneNumber?: string;
  code?: string;
  twoFactorAuthToken?: string;
}

export enum TwoFASecurityType {
  PHONE = "phone",
  EMAIL = "email",
  GOOGLE = "google",
  TWITTER = "twitter",
  WALLET = "wallet",
}

export enum EResetPasswordSteps {
  VERIFY = "verify",
  CONFIRM = "confirm",
  RESET = "reset",
}

export enum EResetPasswordFlow {
  EMAIL = "email",
  PHONE = "phone",
}

interface IQuestInfo {
  questProfit: number;
  completedTasksNumber: number;
  completedQuests: IALoyaltyProjects[];
}

interface IReferrerCode {
  investor_id: number;
  referrer_code: null | string;
}

interface IReferralProfit {
  referralProfit: number;
  groupVolume: number;
  referralsByRanks: IReferralsByRanks;
  referralsCount: number;
  referralsRanksCount: number;
}

interface ICurrentReferralRank {
  currentRank: ReferralRanksRule;
  nextRanks: ReferralRanksRule[];
  groupVolume: number;
  groupVolumeForNextRank: number;
}

interface IReferralProfitByMonth {
  averageByMonth: number;
  referralProfitByMonth: IReferralInfoHistory[];
}

interface IReferralsByRanks {
  [k: string]: number;
}

export interface IProfileReward {
  isClaimed: boolean;
  id: number;
  amount: number;
  isClaimable: boolean;
  description: string;
  startPlace: number;
  endPlace: number;
  loyaltyProject: ILoyaltyProject;
  investor: any;
  contract: IContract;
  verified: boolean;
  tokenIds: number[];
}

export interface IProfileQuest {
  isWinner: boolean;
  place: number;

  projectType: EProjectType;
  id: number;
  linkTitle: string;
  title: string;
  projectName: string;
  backgroundImage?: string | null;
  previewImage?: string;
  description: string;
  socialDescription: string;
  sortOrder: number;
  startAt: string;
  endAt: string;
  claimingStartAt: string;
  claimingEndAt: string;
  featured: boolean;
  preview_img: string | null;
  visible: boolean;
  threshold?: number | null;
  eligibleUsersCount?: number | null;
  rewards: IProfileReward[];
  status: LoyaltyProjectStatuses;
}

export interface ExperienceTask {
  id: number;
  name: string;
  points: number;
  body: any;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyLoginExp {
  points: number;
  completed: boolean;
  isClaimed: boolean;
}

export interface LevelExp {
  id: number;
  name: string;
  image: string;
  benefits: any[];
  pointsFrom: number;
  pointsTo: number;
  bonusLuckyDrawPercentage: number;
  bonusPointsPercentage: number;
  questLimit: number;
  level: number;
  createdAt: string;
  updatedAt: string;
  isClaimed: boolean;
  linkTitle: string;
  nftImage: string;
  chainId: string;
}

export interface IBodyWithConcurrentReferralPoints {
  concurrentReferralPoints: number;
}

export interface IUserExpData {
  notCompletedExpTasks: ExperienceTask[];
  dailyVisitData: DailyLoginExp[];
  totalExpPoints: number;
  levels: LevelExp[];
  currentLevel: LevelExp;
  nextLevel: LevelExp;
}

export interface IPendingInviteToPartnerProject {
  id: number;
  status: "pending";
  partnerProjectId: number;
  investorId: number;
}

export interface ITgMiniAppEnter {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
}
