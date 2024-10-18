import { TSocialDataType } from "@models";
import { TSocialAuthType } from "@modules/account/models";
import {
  accountService,
  adminProjectService,
  authService,
  entryService,
} from "@api";
import { LocalStorageService, LoggerService } from "@services";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@store/store";
import {
  setIsRestrictionForWalletPopupOpen,
  setIsWalletConnected,
  setIsWalletConnectLoading,
} from "@store/slices/system/system.slice";
import { setDisconnectAccount } from "@modules/account/store/account.slice";
import { commonApi } from "@store/common.api";
import {
  accountApi,
  accountApiEndpoints,
} from "@modules/account/store/account.api";

interface ISocialConnectThunk {
  data: TSocialDataType;
  type: TSocialAuthType;
}

interface ISaveWallet {
  address: string;
  signature?: string;
  type: "MetaMask" | "WalletConnect";
}

export const disconnectAccountThunk = createAsyncThunk(
  "disconnectAccountThunk",
  (_, { dispatch }) => {
    LocalStorageService.removeItem("au-t");
    LocalStorageService.removeItem("au-rt");
    LocalStorageService.removeItem("entryUN");
    LocalStorageService.removeItem("entryType");

    dispatch(setIsWalletConnected(false));
    dispatch(setIsWalletConnectLoading(false));
    dispatch(setDisconnectAccount());
    dispatch(commonApi.util.resetApiState());
    dispatch(accountApi.util.resetApiState());
  },
);

export const socialConnectThunk = createAsyncThunk(
  "socialConnectThunk",
  async (
    { data, type }: ISocialConnectThunk,
    { rejectWithValue, getState },
  ) => {
    const state = getState() as RootState;

    let fn = data => authService.confirmSocial("twitter", data);

    if (type == "discord") {
      fn = data => entryService.postSocialsConfirm("discord", data);
    }

    if (type === "telegram") {
      fn = data => entryService.postSocialsConfirm("telegram", data);
    }
    try {
      const { data: res } = await fn(data);

      return {
        ...state.account.accountInfo,
        connectedAccounts: {
          discord:
            type === "discord"
              ? res.username
              : state.account.accountInfo.connectedAccounts.discord,
          telegram:
            type === "telegram"
              ? res.username
              : state.account.accountInfo.connectedAccounts.telegram,
          twitter:
            type === "twitter"
              ? res.username
              : state.account.accountInfo.connectedAccounts.twitter,
          google:
            type === "google"
              ? res.username
              : state.account.accountInfo.connectedAccounts.google,
          email: state.account.accountInfo.connectedAccounts.email,
          phone: state.account.accountInfo.connectedAccounts.phone,
        },
      };
    } catch (error) {
      LoggerService.error(`Error during ${type} auth`, error);
      return rejectWithValue(error);
    }
  },
);

export const getUserPartnerProjectsThunk = createAsyncThunk(
  "getUserPartnerProjects",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await accountService.getUserPartnerProjects();

      return data;
    } catch (error) {
      LoggerService.error("Error during get user partner projects", error);
      return rejectWithValue(error);
    }
  },
);

export const saveWalletThunk = createAsyncThunk(
  "saveWalletThunk",
  async ({ address, signature, type }: ISaveWallet, { dispatch, getState }) => {
    const accountInfo = (getState() as RootState).account.accountInfo;

    if (accountInfo.wallet === address.toLocaleLowerCase()) {
      dispatch(setIsWalletConnected(true));
      dispatch(setIsWalletConnectLoading(false));
      return {
        ...accountInfo,
      };
    }

    try {
      await authService.confirmSocial("wallet", {
        signature,
        address,
      });

      dispatch(setIsWalletConnected(true));
      dispatch(setIsWalletConnectLoading(false));

      return {
        ...accountInfo,
        wallet: address.toLocaleLowerCase(),
      };
    } catch (error: any) {
      const { response } = error;

      dispatch(setIsWalletConnected(false));
      dispatch(setIsWalletConnectLoading(false));

      if (response.status === 409) {
        dispatch(
          setIsRestrictionForWalletPopupOpen({
            open: true,
            type,
            address,
          }),
        );
      }

      LoggerService.error("Error during save wallet info", error);
      return { ...accountInfo };
    }
  },
);

export const getUserProfileThunk = createAsyncThunk(
  "getUserProfileThunk",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await dispatch(
        accountApiEndpoints.getUserProfile.initiate(null, {
          forceRefetch: true,
        }),
      );

      return {
        ...data,
        connected: true,
      };
    } catch (error) {
      LoggerService.error("Error during get user info", error);
      return rejectWithValue(error);
    }
  },
);

export const acceptInviteToPartnerProjectThunk = createAsyncThunk(
  "acceptInviteToPartnerProjectThunk",
  async (body: { projectId: number }, { rejectWithValue }) => {
    try {
      console.log("acceptInviteToPartnerProject");
      await adminProjectService.acceptInviteToPartnerProject(body);
      window.location.reload();
      return body.projectId as any;
    } catch (e) {
      LoggerService.error("Error during acceptInviteToPartnerProjectThunk", e);
      return rejectWithValue(e);
    }
  },
);

export const declineInviteToPartnerProjectThunk = createAsyncThunk(
  "declineInviteToPartnerProjectThunk",
  async (body: { projectId: number }, { rejectWithValue }) => {
    try {
      await adminProjectService.declineInviteToPartnerProject(body);
      return body.projectId as any;
    } catch (e) {
      LoggerService.error("Error during declineInviteToPartnerProjectThunk", e);
      return rejectWithValue(e);
    }
  },
);
