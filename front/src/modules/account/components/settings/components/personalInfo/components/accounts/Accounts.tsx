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
        <Trans id={"dshfi40-34g8rehi"}>
          These accounts are used for AlphaQuest tasks and other activities
        </Trans>
      </Box>

      <Box className="accounts">
        <Box className="accountItem">
          <WalletButton />
        </Box>

        <Box className="accountItem">
          {!accountInfo?.connectedAccounts.twitter ? (
            <TwitterLogin
              className={classnames("button", "button-twitter")}
              type="task"
              text={t({
                id: "8MEJ1BTqTx31FY5u5CgYiH-account",
                message: "Connect Twitter",
              })}
              handleData={(data: TSocialDataType) => {
                handleConnectAccount({ data, type: "twitter" });
              }}
              iconSize="24"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={clickInitFn}
            />
          ) : (
            <div className="soc-wrapper">
              <Box className={classnames("soc", "button-twitter")} mr={2}>
                <Icon name="twitter" size="24" />

                <Box
                  className="c-font-16-22 c-fw-500 c-font-color"
                  component="p"
                  ml={1.25}
                >
                  @{accountInfo?.connectedAccounts.twitter}
                </Box>
              </Box>

              <Button
                className={classnames("butt", "c-font-color")}
                style="task"
                size="medium"
                type="button"
                loading={!isLoaded || !isSocialAuthLoaded}
                disabled={!isLoaded || !isSocialAuthLoaded}
                onClick={() => {
                  setRemoveType("twitter");
                  setIsPopupOpen(true);
                }}
              >
                <>
                  <Box
                    className={classnames("c-font-16-20 c-fw-500 c-font-color")}
                    component="p"
                  >
                    <Icon name={"menu-close"} />
                  </Box>
                </>
              </Button>
            </div>
          )}
        </Box>

        <Box className="accountItem">
          {!accountInfo?.connectedAccounts.discord ? (
            <DiscordLogin
              className={classnames("button", "button-discord")}
              text={t({
                id: "9uAaAGouYb84PQqDcxfiLk-account",
                message: "Connect Discord",
              })}
              handleData={(data: TSocialDataType) => {
                handleConnectAccount({ data, type: "discord" });
              }}
              iconSize="24"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={clickInitFn}
            />
          ) : (
            <div className={"soc-wrapper"}>
              <Box className={classnames("soc", "button-discord")} mr={2}>
                <Icon name="discord" size="24" />

                <Box
                  className="c-font-16-22 c-fw-500 c-font-color"
                  component="p"
                  ml={1.25}
                >
                  @{accountInfo?.connectedAccounts.discord}
                </Box>
              </Box>

              <Button
                className={classnames("butt", "c-font-color")}
                style="task"
                size="medium"
                type="button"
                loading={!isLoaded || !isSocialAuthLoaded}
                disabled={!isLoaded || !isSocialAuthLoaded}
                onClick={() => {
                  setRemoveType("discord");
                  setIsPopupOpen(true);
                }}
              >
                <>
                  <Icon name="menu-close" size="20" />
                </>
              </Button>
            </div>
          )}
        </Box>

        <Box className="accountItem">
          {!accountInfo?.connectedAccounts.telegram ? (
            <TelegramLogin
              className={classnames("button", "button-telegram")}
              text={t({
                id: "eFmQdnKtJ3199KciUy8wo1-account",
                message: "Connect Telegram",
              })}
              handleData={() => {
                handleConnectAccount({ type: "telegram" });
              }}
              iconSize="24"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={clickInitFn}
            />
          ) : (
            <div className="soc-wrapper">
              <Box className={classnames("soc", "button-telegram")} mr={2}>
                <Icon name="telegram" size="24" />

                <Box
                  className="c-font-16-22 c-fw-500 c-font-color"
                  component="p"
                  ml={1.25}
                >
                  {accountInfo?.connectedAccounts.telegram}
                </Box>
              </Box>

              <Button
                className={classnames("butt", "c-font-color")}
                style="task"
                size="medium"
                type="button"
                loading={!isLoaded || !isSocialAuthLoaded}
                disabled={!isLoaded || !isSocialAuthLoaded}
                onClick={() => {
                  setRemoveType("telegram");
                  setIsPopupOpen(true);
                }}
              >
                <>
                  <Icon name="menu-close" size="20" />
                </>
              </Button>
            </div>
          )}
        </Box>

        <Box className="accountItem">
          {!accountInfo?.connectedAccounts.google ? (
            <GoogleLogin
              className={classnames("button", "button-google")}
              text={t({
                id: "vjiZrDhuLxjCVwK2K9uxgh-accounts",
                message: "Connect Google",
              })}
              handleData={(data: TSocialDataType) => {
                handleConnectAccount({ data, type: "google" });
              }}
              iconSize="24"
              isSocialLoaded={isLoaded && isSocialAuthLoaded}
              clickInitFn={clickInitFn}
            />
          ) : (
            <div className="soc-wrapper">
              <Box className={classnames("soc", "button-google")} mr={2}>
                <Icon name="google" size="24" />

                <Box
                  className="c-font-16-22 c-fw-500 c-font-color"
                  component="p"
                  ml={1.25}
                >
                  {accountInfo?.connectedAccounts.google}
                </Box>
              </Box>

              <Button
                className={classnames("butt", "c-font-color")}
                style="task"
                size="medium"
                type="button"
                loading={!isLoaded || !isSocialAuthLoaded}
                disabled={!isLoaded || !isSocialAuthLoaded}
                onClick={() => {
                  setRemoveType("google");
                  setIsPopupOpen(true);
                }}
              >
                <>
                  <Box
                    className={classnames("c-font-16-20 c-fw-500 c-font-color")}
                    component="p"
                  >
                    <Icon name={"menu-close"} />
                  </Box>
                </>
              </Button>
            </div>
          )}
        </Box>
      </Box>

      {isCredsAuth && (
        <Box className="credsAuth">
          <Box className="c-font-color c-font-20-20 c-fw-500" mb="20px">
            {accountInfo.connectedAccounts.phone
              ? t({
                  id: "wpEV9rCrVNyvJThrj2Nd6f-accounts",
                  message: "Phone",
                })
              : t({ id: "t7i4bjtsDK2KiZ8Y7ofWcu-accounts", message: "Email" })}
          </Box>

          <div className="soc-wrapper">
            <Box className={classnames("soc", "button-creds")} mr={2}>
              <Icon
                name={accountInfo.connectedAccounts.phone ? "phone" : "email"}
                size="24"
              />

              <Box
                className="c-font-16-22 c-fw-500 c-font-color"
                component="p"
                ml={1.25}
              >
                {accountInfo.connectedAccounts.phone ||
                  accountInfo.connectedAccounts.email}
              </Box>
            </Box>

            <Button
              className={classnames("butt", "c-font-color")}
              style="task"
              size="medium"
              type="button"
              loading={!isLoaded || !isSocialAuthLoaded}
              disabled={!isLoaded || !isSocialAuthLoaded}
              onClick={() => {
                setRemoveType(
                  accountInfo.connectedAccounts.phone ? "phone" : "email",
                );
                setIsPopupOpen(true);
              }}
            >
              <>
                <Box
                  className={classnames("c-font-16-20 c-fw-500 c-font-color")}
                  component="p"
                >
                  <Icon name={"menu-close"} />
                </Box>
              </>
            </Button>
          </div>

          <button
            className="c-font-16-22 c-fw-500 changePasswordBtn"
            onClick={() => {
              setChangePasswordType(
                accountInfo.connectedAccounts.phone ? "phone" : "email",
              );
              setIsChangePasswordPopupOpen(true);
            }}
          >
            <Trans id="cgWvMLZWF1iwWYe69gBPNB-accounts">Change Password</Trans>
          </button>
        </Box>
      )}

      <DisconnectPopup
        isPopupOpen={isPopupOpen}
        accountInfo={accountInfo}
        removeType={removeType}
        setIsPopupOpen={setIsPopupOpen}
        handleRemove={handleRemove}
        setRemoveType={setRemoveType}
      />

      <ChangePasswordPopup
        isOpen={isChangePasswordPopupOpen}
        setIsOpen={setIsChangePasswordPopupOpen}
        type={changePasswordType}
        setSuccessOpen={setChangePasswordSuccessOpen}
      />

      <ChangePasswordSuccessPopup
        isOpen={changePasswordSuccessOpen}
        setIsOpen={setChangePasswordSuccessOpen}
      />
    </AccountsWrapper>
  );
};

export default Accounts;
