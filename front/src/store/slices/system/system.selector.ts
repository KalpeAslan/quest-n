import { RootState } from "@store/store";

const STATE_KEY = "system";

export const getSystemState = (state: RootState) => state[STATE_KEY];
export const getIsWalletConnected = (state: RootState) =>
  state[STATE_KEY].isWalletConnected;
export const getIsOnboardingPopupOpen = (state: RootState) =>
  state[STATE_KEY].isOnboardingPopupOpen;
export const getIsOnboardingPopupDataLoaded = (state: RootState) =>
  state[STATE_KEY].isOnboardingPopupDataLoaded;
export const getIsOnboardingTaskDone = (state: RootState) =>
  state[STATE_KEY].isOnboardingTaskDone;
export const getLoginPrevLocation = (state: RootState) =>
  state[STATE_KEY].loginPrevLocation;
export const getOnboardingPopupflow = (state: RootState) =>
  state[STATE_KEY].onboardingPopupFlow;
export const getIsCreateQuestPopupOpen = (state: RootState) =>
  state[STATE_KEY].isCreateQuestPopupOpen;
export const getIsFinishPopupOpen = (state: RootState) =>
  state[STATE_KEY].isFinishTourPopupOpen;
export const getIsShowExperienceTour = (state: RootState) =>
  state[STATE_KEY].isShowExperienceTour;
export const getIsBannerClosed = (state: RootState) =>
  state[STATE_KEY].isBunnerClosed;
export const getIsLoading = (state: RootState) => state[STATE_KEY].isLoading;
export const getIsAdminCreatePageOpened = (state: RootState) =>
  state[STATE_KEY].isAdminCreatePageOpened;
export const getIsAdminPanelOpened = (state: RootState) =>
  state[STATE_KEY].isAdminPanelOpened;
export const getPartnerProjectSettingsLinkTitle = (state: RootState) =>
  state[STATE_KEY].partnerProjectSettingsLinkTitle;
export const getForceScrollRerender = (state: RootState) =>
  state[STATE_KEY].forceScrollRerender;
export const getDisclaimerPopupOpen = (state: RootState) =>
  state[STATE_KEY].disclaimerPopupOpen;
export const getPreviewPanel = (state: RootState) =>
  state[STATE_KEY].previewPanel;
export const getPreviewOpen = (state: RootState) =>
  state[STATE_KEY].previewOpen;
export const getPartnerProjectCreationPopup = (state: RootState) =>
  state[STATE_KEY].partnerProjectCreationPopup;
export const getChangesWarningPopupPath = (state: RootState) =>
  state[STATE_KEY].changesWarningPopupPath;
