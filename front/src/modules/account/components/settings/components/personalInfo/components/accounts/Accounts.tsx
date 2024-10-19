import { useCallback, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import { Button } from "@components/UI/button";

import { Icon } from "@components/UI/icon";
import { DiscordLogin } from "@components/socialsLogin/discord";
import { TwitterLogin } from "@components/socialsLogin/twitter";
import { TelegramLogin } from "@components/socialsLogin/telegram";

import { TSocialDataType } from "@models";

import { TAuthType, TSocialAuthType } from "@modules/account/models";
import { LoggerService } from "@services";
import { authService, entryService } from "@api";

import { DisconnectPopup } from "./components/disconnectPopup";
import { AccountsWrapper } from "./accounts.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  setAccountInfo,
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@/modules/account/store/account.slice";
import { getAccountState } from "@modules/account/store/account.selector";
import { getUserProfileThunk } from "@modules/account/store/account.thunks";
import WalletButton from "@components/walletButton/WalletButton";
import { GoogleLogin } from "@/components/socialsLogin/google";
import { ChangePasswordPopup } from "./components/changePasswordPopup";
import { ChangePasswordSuccessPopup } from "./components/changePasswordSuccessPopup";

interface Accounts {
  code: string;
}

const Accounts = () => {
  const dispatch = useAppDispatch();
  const { accountInfo, isSocialAuthLoaded } = useTypedSelector(getAccountState);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [iosRestrictionPopupOpened, setIosRestrictionPopupOpened] =
    useState<boolean>(false);
  const [isChangePasswordPopupOpen, setIsChangePasswordPopupOpen] =
    useState<boolean>(false);
  const [changePasswordType, setChangePasswordType] = useState<TAuthType | "">(
    "",
  );
  const [changePasswordSuccessOpen, setChangePasswordSuccessOpen] =
    useState<boolean>(false);
  const [removeType, setRemoveType] = useState<
    TSocialAuthType | TAuthType | ""
  >("");

  const isCredsAuth = useMemo(
    () =>
      Boolean(accountInfo?.connectedAccounts?.email) ||
      Boolean(accountInfo?.connectedAccounts?.phone),
    [
      accountInfo?.connectedAccounts?.email,
      accountInfo?.connectedAccounts?.phone,
    ],
  );

  const clickInitFn = () => {
    dispatch(setIsSocialAuthLoaded(false));
    setTimeout(() => setIosRestrictionPopupOpened(true), 6000);
    setTimeout(() => dispatch(setIsSocialAuthLoaded(true)), 7000);
  };

  const openIosRestrictionPopup = useCallback(() => {
    if (
      navigator.userAgent.toLowerCase().includes("safari") &&
      navigator.userAgent.toLowerCase().includes("iphone") &&
      !isSocialAuthLoaded &&
      iosRestrictionPopupOpened &&
      !accountInfo.connected
    ) {
      dispatch(setIsSocialAuthLoaded(true));
      dispatch(
        setIsRestrictionForCreationPopupOpen({
          open: true,
          type: "safari",
          username: "",
        }),
      );
      setIosRestrictionPopupOpened(false);
    }
  }, [
    dispatch,
    iosRestrictionPopupOpened,
    isSocialAuthLoaded,
    accountInfo.connected,
  ]);

  useEffect(() => {
    openIosRestrictionPopup();
  }, [openIosRestrictionPopup]);

  const handleConnectAccount = async ({
    data,
    type,
  }: {
    data?: TSocialDataType;
    type: TSocialAuthType;
  }) => {
    if (!accountInfo || data?.error) {
      dispatch(setIsSocialAuthLoaded(true));

      return;
    }

    let fn = data => authService.confirmSocial("twitter", data);

    if (type === "google") {
      fn = data => authService.confirmSocial("google", data);
    }

    if (type == "discord") {
      fn = data => entryService.postSocialsConfirm("discord", data);
    }

    try {
      if (type !== "telegram") {
        await fn(data);
      }
      await dispatch(getUserProfileThunk());
    } catch (error: any) {
      const response = error.response;

      if (response?.status === 409) {
        const { username } = response.data;

        if (type === "twitter") {
          dispatch(
            setIsRestrictionForCreationPopupOpen({
              open: true,
              type: "twitter",
              username: username,
            }),
          );
        }

        if (type === "discord") {
          dispatch(
            setIsRestrictionForCreationPopupOpen({
              open: true,
              type: "discord",
              username: username,
            }),
          );
        }

        if (type === "telegram") {
          dispatch(
            setIsRestrictionForCreationPopupOpen({
              open: true,
              type: "telegram",
              username: username,
            }),
          );
        }

        if (type === "google") {
          dispatch(
            setIsRestrictionForCreationPopupOpen({
              open: true,
              type: "google",
              username: username,
            }),
          );
        }

        return;
      }

      LoggerService.error(`Error during ${type} auth`, error);
    } finally {
      dispatch(setIsSocialAuthLoaded(true));
    }
  };

  const handleRemove = async (type: TSocialAuthType | TAuthType) => {
    if (!accountInfo || type === "creds") {
      return;
    }

    try {
      setIsLoaded(false);
      if (type === "telegram")
        await entryService.postSocialsDisconnect(type, {});
      else if (type === "discord")
        await entryService.postSocialsDisconnect(type, {});
      else {
        await authService.postDisconnect(type);
      }

      dispatch(
        setAccountInfo({
          ...accountInfo,
          connectedAccounts: {
            discord:
              type === "discord" ? null : accountInfo.connectedAccounts.discord,
            telegram:
              type === "telegram"
                ? null
                : accountInfo.connectedAccounts.telegram,
            twitter:
              type === "twitter" ? null : accountInfo.connectedAccounts.twitter,
            google:
              type === "google" ? null : accountInfo.connectedAccounts.google,
            email:
              type === "email" ? null : accountInfo.connectedAccounts.email,
            phone:
              type === "phone" ? null : accountInfo.connectedAccounts.phone,
          },
        }),
      );
    } catch (error) {
      LoggerService.error(`Error during disconnect soc: ${type}`, error);
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <AccountsWrapper>
      <Box component={"p"} mb={4} className={"c-font-16-18 c-font-color"}>
       Connect Your wallet for getting rewards!
      </Box>

      <Box className="accounts">
        <Box className="accountItem">
          <WalletButton />
        </Box>
      </Box>

    </AccountsWrapper>
  );
};

export default Accounts;
