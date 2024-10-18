import { IRestrictionForWallet, IWaleltPopup, TThemne } from "@models";

interface ISystemState {
  isLoading: boolean;
  isError: boolean;
  theme: TThemne;
  isBunnerClosed: boolean;
  isMenuOpen: boolean;
  isWalletPopupOpen: IWaleltPopup;
  isWalletConnected: boolean;
  isWalletConnectLoading: boolean;
  // prevLocation: React.MutableRefObject<string | null> | null;
  isWalletMobileConnectInit: boolean;
  isRestrictionForWalletPopupOpen: IRestrictionForWallet | null;
  isOnboardingPopupOpen: boolean;
  isOnboardingPopupDataLoaded: boolean;
  isOnboardingTaskDone: boolean;
  loginPrevLocation: string;
  onboardingPopupFlow: "auth" | "task";
  isCreateQuestPopupOpen: boolean;
  changesWarningPopupPath: string | null;
  isWalletConnectTracked: boolean;
  isAdminCreatePageOpened: boolean;
  isFinishTourPopupOpen: boolean;
  isAdminPanelOpened: boolean;
  partnerProjectSettingsLinkTitle: string | null;
  forceScrollRerender: number;
  disclaimerPopupOpen: boolean;
  previewPanel: {
    open: boolean;
    onClick: "redirect" | "close";
    redirectPath?: string;
  };
  previewOpen: boolean;
  isShowExperienceTour: boolean;
  partnerProjectCreationPopup: {
    open: boolean;
    partnerProjectLinkTitle: string | null;
    isUpdate?: boolean;
  };
}

export const initialState: ISystemState = {
  isError: false,
  isLoading: false,
  theme: "dark",
  isBunnerClosed: false,
  isMenuOpen: false,
  isWalletPopupOpen: {
    status: false,
    chainId: null,
  },
  isWalletConnected: false,
  isWalletConnectLoading: false,
  // prevLocation: null,
  isWalletMobileConnectInit: false,
  isRestrictionForWalletPopupOpen: null,
  isOnboardingPopupOpen: false,
  isOnboardingPopupDataLoaded: true,
  isOnboardingTaskDone: false,
  isFinishTourPopupOpen: false,
  isShowExperienceTour: false,
  loginPrevLocation: "",
  onboardingPopupFlow: "auth",
  isCreateQuestPopupOpen: false,
  isAdminPanelOpened: false,
  isWalletConnectTracked: false,
  isAdminCreatePageOpened: false,
  changesWarningPopupPath: null,
  partnerProjectSettingsLinkTitle: null,
  forceScrollRerender: 0,
  disclaimerPopupOpen: false,
  previewPanel: {
    open: false,
    onClick: "redirect",
  },
  previewOpen: false,
  partnerProjectCreationPopup: {
    open: false,
    partnerProjectLinkTitle: null,
    isUpdate: false,
  },
};
