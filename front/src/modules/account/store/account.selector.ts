import { RootState } from "@store/store";

const STATE_KEY = "account";

export const getAccountState = (state: RootState) => state[STATE_KEY];
export const getAccountInfo = (state: RootState) =>
  state[STATE_KEY].accountInfo;
export const getLocalReferralCode = (state: RootState) =>
  state[STATE_KEY].localReferralCode;
export const getIsSocialAuthLoaded = (state: RootState) =>
  state[STATE_KEY].isSocialAuthLoaded;
export const getIsRestrictionPopupOpen = (state: RootState) =>
  state[STATE_KEY].isRestrictionForCreationPopupOpen;
export const getCurrentPartnerProject = (state: RootState) =>
  state[STATE_KEY].partnerProjects[0];
export const getPartnerProjectsLoaded = (state: RootState) =>
  state[STATE_KEY].isPartnerProjectsLoaded;
export const getPartnerProject = (linkTitle: string) => (state: RootState) =>
  state[STATE_KEY].partnerProjects.find(item => item.linkTitle === linkTitle);
export const getPartnerProjects = (state: RootState) =>
  state[STATE_KEY].partnerProjects;
export const getQuestReferralCode = (state: RootState) =>
  state[STATE_KEY].questReferralCode;
