import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  baseAccountInfo,
  initialState,
} from "@modules/account/store/account.state";
import {
  IAccount,
  IGetUseAnalyticsInfo,
  IGetUserProfile,
  IGetUserReferral,
  TAccountTabs,
} from "@modules/account/models";
import { IReferralPopupResult, IRestrictionForCreation } from "@models";
import { IPartnerProject } from "../../quest/models/Quest";
import {
  getUserProfileThunk,
  getUserPartnerProjectsThunk,
  saveWalletThunk,
  socialConnectThunk,
  acceptInviteToPartnerProjectThunk,
  declineInviteToPartnerProjectThunk,
} from "@modules/account/store/account.thunks";
import { accountApi } from "@modules/account/store/account.api";

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setAccountInfo(state, action: PayloadAction<IAccount>) {
      state.accountInfo = {
        ...state.accountInfo,
        ...action.payload,
      };
    },
    setIsAccountMenuOpen(state, action: PayloadAction<boolean>) {
      state.isAccountMenuOpen = action.payload;
    },
    setIsSocialAuthLoaded(state, action: PayloadAction<boolean>) {
      state.isSocialAuthLoaded = action.payload;
    },
    setAccountPageActiveTab(state, action: PayloadAction<TAccountTabs>) {
      state.accountPageActiveTab = action.payload;
    },
    setIsReferralCodeLoading(state, action: PayloadAction<boolean>) {
      state.isReferralCodeLoading = action.payload;
    },
    setIsReferralPopupResultOpen(
      state,
      action: PayloadAction<IReferralPopupResult | null>,
    ) {
      state.isReferralPopupResultOpen = action.payload;
    },
    setLocalReferralCode(state, action: PayloadAction<string>) {
      state.localReferralCode = action.payload;
    },
    setIsInviteReferralsPopupOpen(state, action: PayloadAction<boolean>) {
      state.isInviteReferralsPopupOpen = action.payload;
    },
    setIsDisconnectWalletPopupOpen(state, action: PayloadAction<boolean>) {
      state.isDisconnectWalletPopupOpen = action.payload;
    },
    setIsAuthPopupOpen(state, action: PayloadAction<boolean>) {
      state.isAuthPopupOpen = action.payload;
    },
    setIsRestrictionForCreationPopupOpen(
      state,
      action: PayloadAction<IRestrictionForCreation>,
    ) {
      state.isRestrictionForCreationPopupOpen = action.payload;
    },
    setIsAccountLoaded(state, action: PayloadAction<boolean>) {
      state.isAccountLoaded = action.payload;
    },
    addPartnerProject(state, action: PayloadAction<IPartnerProject>) {
      const newPartnerProjects = [...state.partnerProjects].filter(
        item => item.linkTitle !== action.payload.linkTitle,
      );

      state.partnerProjects = [...newPartnerProjects, action.payload];
    },
    setDisconnectAccount(state) {
      state.accountInfo = {
        ...baseAccountInfo,
        connected: false,
      };
    },
    setQuestReferralCode(state, action: PayloadAction<string>) {
      state.questReferralCode = action.payload;
    },
  },
  extraReducers: builder => {
    // socialConnectThunk
    builder.addCase(socialConnectThunk.pending, state => {
      state.isSocialAuthLoaded = false;
    });

    builder.addCase(socialConnectThunk.rejected, state => {
      state.isSocialAuthLoaded = false;
    });

    builder.addCase(
      socialConnectThunk.fulfilled,
      (state, action: PayloadAction<IAccount>) => {
        state.accountInfo = action.payload;
        state.isSocialAuthLoaded = true;
      },
    );

    // getUserPartnerProjectsThunk

    builder.addCase(getUserPartnerProjectsThunk.pending, state => {
      state.isPartnerProjectsLoaded = false;
    });

    builder.addCase(getUserPartnerProjectsThunk.rejected, state => {
      state.isPartnerProjectsLoaded = true;
    });

    builder.addCase(
      getUserPartnerProjectsThunk.fulfilled,
      (state, { payload }: PayloadAction<IPartnerProject[]>) => {
        state.partnerProjects = [...payload];
        state.isPartnerProjectsLoaded = true;
      },
    );

    //saveWalletThunk
    builder.addCase(
      saveWalletThunk.fulfilled,
      (state, action: PayloadAction<IAccount>) => {
        state.accountInfo = action.payload;
      },
    );

    //getUserProfileThunk

    builder.addCase(getUserProfileThunk.pending, state => {
      state.isAccountLoaded = false;
    });

    builder.addCase(getUserProfileThunk.rejected, state => {
      state.isAccountLoaded = false;
      state.accountInfo = {
        ...state.accountInfo,
        connected: false,
      };
    });

    builder.addCase(
      getUserProfileThunk.fulfilled,
      (state, { payload }: PayloadAction<IGetUserProfile>) => {
        const {
          connectedAccounts,
          referralInfo: {
            referralProfit,
            claimableReferralProfit,
            referralCode,
          },
          canBeReferral,
          questInfo,
          security,
        } = payload;

        state.accountInfo = {
          ...state.accountInfo,
          security,
          connectedAccounts,
          canBeReferral,
          questInfo,
          referralInfo: {
            ...state.accountInfo.referralInfo,
            referralProfitValue: referralProfit,
            claimableReferralProfit,
            referralCode,
          },
          connected: true,
        };
      },
    );

    builder.addCase(
      acceptInviteToPartnerProjectThunk.fulfilled,
      (state, { payload }) => {
        const accountInfo = state.accountInfo as IAccount;
        state.accountInfo.pendingInvitesToPartnerProject =
          accountInfo.pendingInvitesToPartnerProject.filter(
            item => item.partnerProjectId !== payload,
          );
        console.log("state.accountInfo", state.accountInfo);
        return state;
      },
    );

    builder.addCase(
      declineInviteToPartnerProjectThunk.fulfilled,
      (state, { payload }) => {
        const accountInfo = state.accountInfo as IAccount;
        state.accountInfo.pendingInvitesToPartnerProject =
          accountInfo.pendingInvitesToPartnerProject.filter(
            item => item.partnerProjectId !== payload,
          );
        console.log("state.accountInfo", state.accountInfo);
        return state;
      },
    );

    //Matchers

    builder.addMatcher(
      accountApi.endpoints.getUserProfile.matchFulfilled,
      (state, { payload }: PayloadAction<IGetUserProfile>) => {
        const {
          connectedAccounts,
          referralInfo: {
            referralProfit,
            claimableReferralProfit,
            referralCode,
          },
          canBeReferral,
          questInfo,
          security,
        } = payload;

        state.accountInfo = {
          ...state.accountInfo,
          security,
          connectedAccounts,
          canBeReferral,
          questInfo,
          referralInfo: {
            ...state.accountInfo.referralInfo,
            referralProfitValue: referralProfit,
            referralProfit: {
              ...state.accountInfo.referralInfo.referralProfit,
              referralProfit,
            },
            claimableReferralProfit,
            referralCode,
          },
          referralCode: referralCode,
          connected: true,
        };

        state.isAccountLoaded = true;
        return state;
      },
    );

    builder.addMatcher(
      accountApi.endpoints.getUserAnalyticsInfo.matchFulfilled,
      (state, action: PayloadAction<IGetUseAnalyticsInfo>) => {
        const {
          wallet,
          analytics_id,
          activeQuests,
          experienceLevel,
          totalQuests,
          username,
          investorId,
          referrerCode,
          isReferral,
          investorCreatingTime,
          pendingInvitesToPartnerProject,
        } = action.payload as IGetUseAnalyticsInfo;

        state.accountInfo = {
          ...state.accountInfo,
          pendingInvitesToPartnerProject,
          wallet,
          analytics_id,
          currentLevel: experienceLevel,
          connected: true,
          activeQuests,
          totalQuests,
          investorCreatingTime,
          investorId,
          isReferral,
          username,
          referrerCode,
        };
        state.isAccountLoaded = true;
      },
    );

    builder.addMatcher(
      accountApi.endpoints.getUserReferral.matchFulfilled,
      (state, { payload }: PayloadAction<IGetUserReferral>) => {
        const {
          CurrentReferralRank,
          ReferralProfit,
          ReferralProfitByMonth,
          code,
        } = payload;

        state.accountInfo.referralInfo = {
          ...state.accountInfo.referralInfo,
          currentReferralRank: CurrentReferralRank,
          referralProfit: ReferralProfit,
          referralProfitByMonth: ReferralProfitByMonth,
          referralsCount: ReferralProfit.referralsCount,
          referralsByRanks: ReferralProfit.referralsByRanks,
          referralCode: code,
        };
        state.accountInfo.referralCode = code;
        state.accountInfo.connected = true;

        state.isAccountLoaded = true;
        return state;
      },
    );

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
  setAccountInfo,
  setIsAccountMenuOpen,
  setIsInviteReferralsPopupOpen,
  setIsDisconnectWalletPopupOpen,
  setIsAuthPopupOpen,
  setIsReferralPopupResultOpen,
  setIsRestrictionForCreationPopupOpen,
  setIsReferralCodeLoading,
  setLocalReferralCode,
  setAccountPageActiveTab,
  setIsSocialAuthLoaded,
  setIsAccountLoaded,
  addPartnerProject,
  setDisconnectAccount,
  setQuestReferralCode,
} = accountSlice.actions;

export default accountSlice.reducer;
