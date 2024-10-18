import { useCallback, useEffect, useRef, useState } from "react";
import { createContext } from "use-context-selector";
import { useAccount } from "wagmi";

import { ISourceInfo, TWallet, TWalletEntry } from "@models";
import {
  setIsWalletConnected,
  setIsWalletConnectLoading,
  setIsWalletMobileConnectInit,
} from "@store/slices/system/system.slice";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsAccountLoaded } from "@modules/account/store/account.slice";
import { useTypedSelector } from "@hooks/useTypedSelector";
import {
  getAccountInfo,
  getLocalReferralCode,
} from "@modules/account/store/account.selector";
import {
  disconnectAccountThunk,
  getUserPartnerProjectsThunk,
  saveWalletThunk,
} from "@modules/account/store/account.thunks";
import { LocalStorageService } from "../../services/LocalStorageService";

import { useRouter } from "next/router";
import {
  setInitialSourceInfoItem,
  setSourceInfoItem,
  setAccountUserProperties,
  setSystemUserProperties,
  setUserId,
  setCurrentLocation,
  setIsAnalyticsEventPropsLoaded,
} from "@/store/slices/analytics/analytics.slice";
import { getIsWalletConnected } from "@/store/slices/system/system.selector";
import { getDeviceType, getOS, getQueryVariable } from "@/utils";
import {
  getUserMetaDataThunk,
  sendAnalyticsDataThunk,
} from "@/store/slices/analytics/analytics.thunks";
import { useGetUserAnalyticsInfoQuery } from "@modules/account/store/account.api";
import { IAccount } from "@modules/account/models";
import { useWalletConnect } from "@/hooks";
import { SignWalletPopup } from "@/components/signWalletPopup";
import { WalletWarningPopup } from "@/components/walletWarningPopup";
import { experienceService } from "@/api";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

export const AppContext = createContext<Partial<IAppContext>>({});

interface IAppContext {
  prevLocation: React.MutableRefObject<string | null>;
  connectWallet: (connector: TWallet) => Promise<void>;
  sourceInfo: ISourceInfo;
}

export const AppProvider = ({ children }: any) => {
  const [walletWarningData, setWalletWarningData] = useState<{
    address: string;
    signature: string;
    prevAddress: string;
  } | null>(null);

  const prevLocation = useRef<string | null>(null);
  const { query, asPath } = useRouter();
  const dispatch = useAppDispatch();
  const accountInfo: IAccount = useTypedSelector(getAccountInfo);
  const localReferralCode = useTypedSelector(getLocalReferralCode);
  const questReferralCode = useQuestReferralCode();
  const isWalletConnected = useTypedSelector(getIsWalletConnected);
  const { address } = useAccount();
  const [isUserLogin, setIsUserLogin] = useState(false);
  const _ = useGetUserAnalyticsInfoQuery(null, {
    skip: !isUserLogin,
  });

  const { disconnect: disconnectWallet } = useWalletConnect();
  const [isDailyLoginSent, setIsDailyLoginSent] = useState(false);

  const handleData = useCallback(
    async ({ address, signature }: TWalletEntry) => {
      if (
        accountInfo?.wallet &&
        accountInfo?.wallet?.toLocaleLowerCase() !== address.toLocaleLowerCase()
      ) {
        setWalletWarningData({
          address,
          signature,
          prevAddress: accountInfo.wallet,
        });
        return;
      }

      dispatch(
        sendAnalyticsDataThunk({ type: "wallet_connect_done", options: {} }),
      );

      await dispatch(
        saveWalletThunk({
          address,
          signature,
          type: "MetaMask",
        }),
      );

      dispatch(
        sendAnalyticsDataThunk({ type: "wallet_verify_done", options: {} }),
      );
    },
    [accountInfo?.wallet, dispatch],
  );

  const connectError = useCallback(() => {
    dispatch(setIsWalletConnectLoading(false));
  }, [dispatch]);

  const {
    handleConnect,
    isSignOpen,
    isSignLoading,
    isSignError,
    handleSignClose,
    sign,
  } = useWalletConnect({ handleData, connectError });

  const connectWallet = async (connector: TWallet) => {
    dispatch(setIsWalletMobileConnectInit(false));
    dispatch(setIsWalletConnectLoading(true));

    if (connector === "Metamask") {
      handleConnect("metamask");
      return;
    }

    if (connector === "WalletConnect") {
      handleConnect("walletconnect");
    }
  };

  const getInitialSourceInfoItem = useCallback(
    async (itemName: keyof ISourceInfo) =>
      (await LocalStorageService.getItemAsync(itemName)) ||
      (query[itemName.replace("user_property_initial_", "")] as string) ||
      getQueryVariable(itemName.replace("user_property_initial_", "")) ||
      null,
    [query],
  );

  const getSourceInfoItem = useCallback(
    (itemName: keyof ISourceInfo) =>
      (query[itemName.replace("user_property_", "")] as string) ||
      getQueryVariable(itemName.replace("user_property_", "")) ||
      null,
    [query],
  );

  const getMetadata = useCallback(async () => {
    dispatch(getUserMetaDataThunk());

    const token = await LocalStorageService.getItemAsync("au-t");

    if (!token) {
      setIsAccountLoaded(true);
      await disconnectWallet();
      await dispatch(disconnectAccountThunk());
      return;
    }
    setIsUserLogin(true);
  }, [disconnectWallet, dispatch]);

  useEffect(() => {
    getMetadata();
  }, [getMetadata]);

  useEffect(() => {
    if (!accountInfo.connected || !accountInfo.wallet) {
      dispatch(setIsWalletConnected(false));
      dispatch(setIsWalletConnectLoading(false));

      return;
    }

    if (accountInfo.connected && accountInfo.wallet) {
      dispatch(setIsWalletConnected(true));
      dispatch(setIsWalletConnectLoading(false));
    }
  }, [accountInfo, address, dispatch]);

  useEffect(() => {
    if (accountInfo.connected && !isDailyLoginSent) {
      const key = `lastPingDate__${accountInfo.investorId}`;
      const lastPingDate = localStorage.getItem(key);
      const today = new Date().toDateString();

      if (lastPingDate !== today || !lastPingDate) {
        experienceService.dailyLogin().then(() => setIsDailyLoginSent(true));
        localStorage.setItem(key, today);
      }
    }
  }, [accountInfo, isDailyLoginSent]);

  useEffect(() => {
    dispatch(setIsAnalyticsEventPropsLoaded(false));

    const os = getOS();
    const deviceType = getDeviceType();

    dispatch(
      setSystemUserProperties({
        user_property_user_os: os,
        user_property_user_platform: deviceType,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(setIsAnalyticsEventPropsLoaded(false));

    dispatch(
      setAccountUserProperties({
        user_property_user_creation_time: accountInfo?.investorCreatingTime
          ? new Date(accountInfo?.investorCreatingTime)
          : null,
        user_property_is_wallet_connected: Boolean(isWalletConnected),
        user_property_active_quests: accountInfo?.activeQuests || 0,
        user_property_is_logined: Boolean(accountInfo?.connected),
        user_property_investor_id: accountInfo?.investorId || null,
        user_property_is_referral: Boolean(accountInfo?.isReferral),
        user_property_total_quests: accountInfo?.totalQuests || 0,
        user_property_referral_code: accountInfo?.referrerCode
          ? accountInfo.referrerCode.referrer_code
          : localReferralCode || questReferralCode || null,
      }),
    );

    dispatch(setUserId(accountInfo?.analytics_id || null));
  }, [
    dispatch,
    accountInfo,
    isWalletConnected,
    localReferralCode,
    questReferralCode,
  ]);

  const fillAnalytics = useCallback(async () => {
    dispatch(setIsAnalyticsEventPropsLoaded(false));
    const initialUtmSource = await getInitialSourceInfoItem(
      "user_property_initial_utm_source",
    );
    const initialUtmMedium = await getInitialSourceInfoItem(
      "user_property_initial_utm_medium",
    );
    const initialUtmCampaign = await getInitialSourceInfoItem(
      "user_property_initial_utm_campaign",
    );

    const utmSource = getSourceInfoItem("user_property_utm_source");
    const utmMedium = getSourceInfoItem("user_property_utm_medium");
    const utmCampaign = getSourceInfoItem("user_property_utm_campaign");

    dispatch(
      setInitialSourceInfoItem({
        itemName: "user_property_initial_utm_source",
        value: initialUtmSource,
      }),
    );
    dispatch(
      setInitialSourceInfoItem({
        itemName: "user_property_initial_utm_medium",
        value: initialUtmMedium,
      }),
    );
    dispatch(
      setInitialSourceInfoItem({
        itemName: "user_property_initial_utm_campaign",
        value: initialUtmCampaign,
      }),
    );

    dispatch(
      setSourceInfoItem({
        itemName: "user_property_utm_source",
        value: utmSource,
      }),
    );
    dispatch(
      setSourceInfoItem({
        itemName: "user_property_utm_medium",
        value: utmMedium,
      }),
    );
    dispatch(
      setSourceInfoItem({
        itemName: "user_property_utm_campaign",
        value: utmCampaign,
      }),
    );
  }, [getInitialSourceInfoItem, getSourceInfoItem, dispatch]);

  useEffect(() => {
    fillAnalytics();
  }, [fillAnalytics]);

  useEffect(() => {
    dispatch(setIsAnalyticsEventPropsLoaded(false));
    dispatch(setCurrentLocation(asPath));
  }, [asPath, dispatch]);

  useEffect(() => {
    if (accountInfo?.connected) {
      dispatch(getUserPartnerProjectsThunk());
    }
  }, [accountInfo.connected, dispatch]);

  const value = {
    prevLocation,
    connectWallet,
  };

  return (
    <AppContext.Provider value={value}>
      <SignWalletPopup
        isOpen={isSignOpen}
        handleClose={handleSignClose}
        isError={isSignError}
        isLoading={isSignLoading}
        onSign={sign}
      />

      <WalletWarningPopup
        handleClose={() => setWalletWarningData(null)}
        isOpen={Boolean(
          walletWarningData?.address &&
            walletWarningData?.signature &&
            walletWarningData?.prevAddress,
        )}
        address={walletWarningData?.address}
        signature={walletWarningData?.signature}
        prevAddress={walletWarningData?.prevAddress}
      />
      {children}
    </AppContext.Provider>
  );
};
