import { createAsyncThunk } from "@reduxjs/toolkit";
import { LocalStorageService, LoggerService } from "@services";
import {
  ICommonEventProperties,
  IEventProperties,
  IUserProperties,
  TEventType,
} from "@models";
import { analyticService } from "@api";
import { RootState } from "@/store/store";
import { appConfig } from "@/app.config";
import { getCookies, setCookie } from "cookies-next";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { IAccount } from "@modules/account/models";
import { accountApiEndpoints } from "@modules/account/store/account.api";
import {
  getLocalReferralCode,
  getQuestReferralCode,
} from "@/modules/account/store/account.selector";
import { getShouldRefetch } from "./analytics.selector";
import { setShouldRefetch } from "./analytics.slice";
import { getQueryVariable } from "@/utils";

const SESSION_ID_EXPIRATION_TIME = 30;

export const getUserMetaDataThunk = createAsyncThunk(
  "createAsyncThunk",
  async (_, { rejectWithValue }) => {
    const cookies = getCookies();

    let ipAddress: any = cookies.userIp;
    let userCountry: any = cookies.userCountry;
    try {
      if (!ipAddress) {
        const locationData = await fetch("https://api.country.is");
        const res = await locationData.json();

        ipAddress = res.ip;
        userCountry = res?.country;

        setCookie("userIp", ipAddress, {
          expires: DateTime.now().plus({ minutes: 1440 }).toJSDate(),
        });
        setCookie("userCountry", userCountry, {
          expires: DateTime.now().plus({ minutes: 1440 }).toJSDate(),
        });
      }

      const lang = window?.navigator?.language || undefined;
      let cookieAG =
        (await LocalStorageService.getItemAsync("cookie-AG")) || undefined;
      const cookieGA = cookies["_ga"];
      const timezone = DateTime.local().offsetNameShort;
      const userAgent = window?.navigator?.userAgent || undefined;
      const fromAddress = document.referrer || "direct";
      const previousPage = undefined;

      if (!cookieAG) {
        const userId = uuidv4();
        LocalStorageService.setItem("cookie-AG", userId);

        cookieAG = userId;
      }

      return {
        cookieAG,
        cookieGA,
        lang,
        timezone,
        userAgent,
        ipAddress,
        country: userCountry,
        fromAddress,
        previousPage,
      };
    } catch (error) {
      LoggerService.error("Error during analitycs user data", error);
      return rejectWithValue(error);
    }
  },
);

export const sendAnalyticsDataThunk = createAsyncThunk(
  "sendAnalyticsData",
  async (
    data: {
      type: TEventType;
      options: IEventProperties;
      shouldRefetch?: boolean;
    },
    { getState, dispatch },
  ) => {
    const state = getState() as RootState;

    if (
      !(
        appConfig.NEXT_PUBLIC_ENVIRONMENT === "prod" ||
        appConfig.NEXT_PUBLIC_ENVIRONMENT === "stage"
      ) ||
      !state.analytics.isEventPropsLoaded
    )
      return;

    let sessionId: any = await LocalStorageService.getItemAsync("s-id");
    const lastEventTime = await LocalStorageService.getItemAsync("lst-evt");
    const authToken = await LocalStorageService.getItemAsync("auth-token");

    if (
      !sessionId ||
      (lastEventTime &&
        new Date().getTime() - Number(lastEventTime) >
          SESSION_ID_EXPIRATION_TIME * 60 * 1000)
    ) {
      const newSessionId = new Date().getTime();
      LocalStorageService.setItem("s-id", newSessionId);
      sessionId = newSessionId;
    }

    LocalStorageService.setItem("lst-evt", new Date().getTime());

    let deviceId = await LocalStorageService.getItemAsync("d-id");

    if (!deviceId) {
      const newDeviceId = uuidv4();
      LocalStorageService.setItem("d-id", newDeviceId);
      deviceId = newDeviceId;
    }

    const cookies = getCookies();

    let userCountry: any = cookies.userCountry;

    if (!userCountry) {
      try {
        const locationData = await fetch("https://api.country.is");
        const res = await locationData.json();
        userCountry = res?.country;
      } catch (error) {
        LoggerService.error("Couldn't get user country", error);
      }
    }

    const localReferralCode = getLocalReferralCode(state);
    const questReferralCode =
      getQuestReferralCode(state) ||
      (await LocalStorageService.getItemAsync("invite-task-ref")) ||
      null;
    const shouldRefetchState = getShouldRefetch(state);

    try {
      if (!authToken) {
        throw new Error("Set auth token");
      }

      let userData: IAccount = state.account.accountInfo;

      if (
        data.type !== "wallet_verify_done" &&
        data.type !== "wallet_connect_done"
      ) {
        userData = await dispatch(
          accountApiEndpoints.getUserAnalyticsInfo.initiate(null, {
            forceRefetch: true,
          }),
        ).then(res => res.data);
      }

      if (data.shouldRefetch || shouldRefetchState) {
        dispatch(setShouldRefetch(false));
      }

      await analyticService.postAnalyticsSendData({
        eventType: data.type,
        eventOptions: {
          ...(state.analytics.commonEventProps as ICommonEventProperties),
          ...(state.analytics.userData as IUserProperties),
          user_property_utm_source:
            state.analytics.userData.user_property_utm_source ||
            getQueryVariable("utm_source") ||
            null,
          user_property_utm_medium:
            state.analytics.userData.user_property_utm_medium ||
            getQueryVariable("utm_medium") ||
            null,
          user_property_utm_campaign:
            state.analytics.userData.user_property_utm_campaign ||
            getQueryVariable("utm_campaign") ||
            null,

          user_property_initial_utm_source:
            state.analytics.userData.user_property_initial_utm_source ||
            (await LocalStorageService.getItemAsync(
              "user_property_initial_utm_source",
            )) ||
            getQueryVariable("utm_source") ||
            null,
          user_property_initial_utm_medium:
            state.analytics.userData.user_property_initial_utm_medium ||
            (await LocalStorageService.getItemAsync(
              "user_property_initial_utm_medium",
            )) ||
            getQueryVariable("utm_medium") ||
            null,
          user_property_initial_utm_campaign:
            state.analytics.userData.user_property_initial_utm_campaign ||
            (await LocalStorageService.getItemAsync(
              "user_property_initial_utm_campaign",
            )) ||
            getQueryVariable("utm_campaign") ||
            null,
          user_property_active_quests: userData.activeQuests,
          user_property_total_quests: userData.totalQuests,
          user_property_user_creation_time: userData?.investorCreatingTime
            ? new Date(userData?.investorCreatingTime)
            : null,
          user_property_is_logined: true,
          user_property_investor_id: userData?.investorId || null,
          user_property_is_referral: Boolean(userData?.isReferral),
          user_property_referral_code: userData?.referrerCode
            ? userData.referrerCode.referrer_code
            : localReferralCode || questReferralCode || null,
          user_property_is_wallet_connected: Boolean(userData?.wallet),
          ...data.options,
        },
        userId: userData?.analytics_id || null,
        sessionId: String(sessionId),
        deviceId,
        country: userCountry,
      });
    } catch (error) {
      try {
        await analyticService.postAnalyticsSendData({
          eventType: data.type,
          eventOptions: {
            ...(state.analytics.commonEventProps as ICommonEventProperties),
            ...(state.analytics.userData as IUserProperties),
            ...data.options,
          },
          userId: state.analytics.userId,
          sessionId: String(sessionId),
          deviceId,
          country: userCountry,
        });
      } catch (error) {
        LoggerService.error("Error during send analitycs data", error);
      }
    }
  },
);
