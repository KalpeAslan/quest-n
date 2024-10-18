import { IAccount, TAccountTabs } from "@modules/account/models";
import {
  ExperienceLevel,
  IReferralPopupResult,
  IRestrictionForCreation,
} from "@models";
import { IPartnerProject } from "@/modules/quest/models";

interface IAccountState {
  isLoading: boolean;
  isError: boolean;
  accountInfo: IAccount;
  isAccountLoaded: boolean;
  isSocialAuthLoaded: boolean;
  isRestrictionForCreationPopupOpen: IRestrictionForCreation | null;
  isInviteReferralsPopupOpen: boolean;
  isDisconnectWalletPopupOpen: boolean;
  isAuthPopupOpen: boolean;
  localReferralCode: string | null;
  isAccountMenuOpen: boolean;
  accountPageActiveTab: TAccountTabs;
  isReferralPopupResultOpen: IReferralPopupResult | null;
  isReferralCodeLoading: boolean;
  partnerProjects: IPartnerProject[];
  isPartnerProjectsLoaded: boolean;
  questReferralCode: null | string;
  experienceLevel?: ExperienceLevel | null;
}

export const baseAccountInfo: IAccount = {
  connected: null,
  wallet: null,
  username: "",
  connectedAccounts: {
    twitter: null,
    discord: null,
    telegram: null,
    google: null,
    email: null,
    phone: null,
  },
  referralInfo: {
    // levels: [],
    availableReferralIncome: null,
    currentReferralRank: null,
    referralProfitByMonth: null,
    referralProfit: null,
    referralProfitValue: 0,
    claimableReferralProfit: 0,
    referralCode: "",
    referralsCount: 0,
    referralsByRanks: {},
  },
  questInfo: null, // Depends on your definition of IQuestInfo
  referrerCode: null, // Depends on your definition of IReferrerCode
  pendingInvitesToPartnerProject: [],
};

export const initialState: IAccountState = {
  accountInfo: {
    ...baseAccountInfo,
  },
  partnerProjects: [],
  isPartnerProjectsLoaded: false,
  isError: false,
  isLoading: false,
  isAccountLoaded: false,
  isSocialAuthLoaded: true,
  isRestrictionForCreationPopupOpen: null,
  isInviteReferralsPopupOpen: false,
  isDisconnectWalletPopupOpen: false,
  isAuthPopupOpen: false,
  localReferralCode: null,
  isAccountMenuOpen: false,
  accountPageActiveTab: "AQ Balance",
  isReferralPopupResultOpen: null,
  isReferralCodeLoading: false,
  questReferralCode: null,
  experienceLevel: null,
};
