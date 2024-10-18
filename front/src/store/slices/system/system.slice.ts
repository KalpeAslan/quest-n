import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import { initialState } from "./system.state";
import { IRestrictionForWallet, IWaleltPopup } from "@models";

const systemSlice = createSlice({
  name: "systemSlice",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setIsMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMenuOpen = action.payload;
    },
    setIsBunnerClosed(state, action: PayloadAction<boolean>) {
      state.isBunnerClosed = action.payload;
    },
    setIsWalletPopupOpen(state, action: PayloadAction<IWaleltPopup>) {
      state.isWalletPopupOpen = action.payload;
    },
    setIsWalletConnected(state, action: PayloadAction<boolean>) {
      state.isWalletConnected = action.payload;
    },
    setIsWalletConnectLoading(state, action: PayloadAction<boolean>) {
      state.isWalletConnectLoading = action.payload;
    },
    setIsWalletMobileConnectInit(state, action: PayloadAction<boolean>) {
      state.isWalletMobileConnectInit = action.payload;
    },
    setIsRestrictionForWalletPopupOpen(
      state,
      action: PayloadAction<IRestrictionForWallet>,
    ) {
      state.isRestrictionForWalletPopupOpen = action.payload;
    },
    setIsOnboardingPopupOpen(state, action: PayloadAction<boolean>) {
      state.isOnboardingPopupOpen = action.payload;
    },
    setIsOnboardingPopupDataLoaded(state, action: PayloadAction<boolean>) {
      state.isOnboardingPopupDataLoaded = action.payload;
    },
    setIsOnboardingTaskDone(state, action: PayloadAction<boolean>) {
      state.isOnboardingTaskDone = action.payload;
    },
    setLoginPrevLocation(state, action: PayloadAction<string>) {
      state.loginPrevLocation = action.payload;
    },
    setOnboardingPopupFlow(state, action: PayloadAction<"auth" | "task">) {
      state.onboardingPopupFlow = action.payload;
    },
    setIsCreateQuestPopupOpen(state, action: PayloadAction<boolean>) {
      state.isCreateQuestPopupOpen = action.payload;
    },
    setIsWalletConnectTracked(state, action: PayloadAction<boolean>) {
      state.isWalletConnectTracked = action.payload;
    },
    setIsAdminCreatePageOpened(state, action: PayloadAction<boolean>) {
      state.isAdminCreatePageOpened = action.payload;
    },
    setChangesWarningPopupPath(state, action: PayloadAction<string | null>) {
      state.changesWarningPopupPath = action.payload;
    },
    setIsAdminPanelOpened(state, action: PayloadAction<boolean>) {
      state.isAdminPanelOpened = action.payload;
    },
    setPartnerProjectSettingsLinkTitle(
      state,
      action: PayloadAction<string | null>,
    ) {
      state.partnerProjectSettingsLinkTitle = action.payload;
    },
    forceScrollRerender(state) {
      state.forceScrollRerender += 1;
    },
    setDisclaimerPopupOpen(state, action: PayloadAction<boolean>) {
      state.disclaimerPopupOpen = action.payload;
    },
    setPreviewPanel(
      state,
      action: PayloadAction<{
        open: boolean;
        onClick: "redirect" | "close";
        redirectPath?: string;
      }>,
    ) {
      state.previewPanel = action.payload;
    },
    setPreviewOpen(state, action: PayloadAction<boolean>) {
      state.previewOpen = action.payload;
    },
    setPartnerProjectCreationPopup(
      state,
      action: PayloadAction<{
        open: boolean;
        partnerProjectLinkTitle: string | null;
        isUpdate?: boolean;
      }>,
    ) {
      state.partnerProjectCreationPopup = action.payload;
    },
    setFinishTourPopupOpen(state, action: PayloadAction<boolean>) {
      state.isFinishTourPopupOpen = action.payload;
    },
    setIsShowExperienceTour(state, action: PayloadAction<boolean>) {
      state.isShowExperienceTour = action.payload;
    },
  },
  extraReducers: builder => {
    //Matchers
    builder.addMatcher(isPending, state => {
      state.isLoading = true;
    });

    builder.addMatcher(isRejected, state => {
      state.isLoading = false;
      state.isError = true;
    });

    builder.addMatcher(isFulfilled, state => {
      state.isLoading = false;
    });
  },
});

export const {
  setIsMenuOpen,
  setIsRestrictionForWalletPopupOpen,
  setIsWalletPopupOpen,
  setIsWalletConnected,
  setIsWalletConnectLoading,
  setIsWalletMobileConnectInit,
  setLoading,
  setIsBunnerClosed,
  setIsOnboardingPopupDataLoaded,
  setIsOnboardingPopupOpen,
  setIsOnboardingTaskDone,
  setLoginPrevLocation,
  setOnboardingPopupFlow,
  setIsCreateQuestPopupOpen,
  setIsAdminPanelOpened,
  setIsWalletConnectTracked,
  setIsAdminCreatePageOpened,
  setPartnerProjectSettingsLinkTitle,
  setPreviewPanel,
  setPreviewOpen,
  setPartnerProjectCreationPopup,
  forceScrollRerender,
  setDisclaimerPopupOpen,
  setChangesWarningPopupPath,
  setFinishTourPopupOpen,
  setIsShowExperienceTour,
} = systemSlice.actions;

export default systemSlice.reducer;
