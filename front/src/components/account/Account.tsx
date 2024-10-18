/** @jsxRuntime classic /
 /* @jsx jsx */
import { jsx } from "@emotion/react";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box } from "@mui/material";
import classnames from "classnames";
import { useContextSelector } from "use-context-selector";
import { Trans } from "@lingui/macro";
import { useAccount } from "wagmi";
import { isMobile } from "react-device-detect";

import { HelperService, LocalStorageService } from "@services";
import { Image } from "@components/UI/image";
import { Icon } from "@components/UI/icon";
import { Button } from "@components/UI/button";
import { AppContext } from "@context";

import { useRouter } from "next/router";
import {
  AccountStyledButtons,
  AccountStyledButton,
  AccountStyledDecor,
  AccountDropdown,
  AccountStyledButtonStyles,
} from "@components/account/account.styles";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  setChangesWarningPopupPath,
  setIsMenuOpen,
  setIsWalletPopupOpen,
  setLoginPrevLocation,
} from "@store/slices/system/system.slice";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import {
  getIsAdminCreatePageOpened,
  getSystemState,
} from "@store/slices/system/system.selector";
import { appConfig } from "@/app.config";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { setIsDisconnectWalletPopupOpen } from "@/modules/account/store/account.slice";
import { useWalletConnect } from "@/hooks";
import { disconnectAccountThunk } from "@/modules/account/store/account.thunks";
import useClickOutside from "@hooks/useClickOutside";
import { Bell } from "@components/Notifications/Bell";
import Link from "next/link";

interface AccountProps {
  redirectUrl?: string;
}

const Account: FC<AccountProps> = ({ redirectUrl = "" }) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const { push, pathname } = useRouter();

  const { address } = useAccount();

  const dispatch = useAppDispatch();

  const [entryType, setEntryType] = useState<string>("");

  const accountInfo = useTypedSelector(getAccountInfo);
  const { isWalletConnected } = useTypedSelector(getSystemState);
  const adminCreatePageOpened = useTypedSelector(getIsAdminCreatePageOpened);

  const { disconnect: disconnectWallet } = useWalletConnect();

  const connectWallet = useContextSelector(
    AppContext,
    state => state.connectWallet,
  );

  const getEntryType = useCallback(async () => {
    const authType = await LocalStorageService.getItemAsync("entryType");

    if (authType) {
      setEntryType(authType);
      return;
    }

    setEntryType("");
  }, [accountInfo]);

  useEffect(() => {
    getEntryType();
  }, [getEntryType]);

  const handleConnect = async () => {
    if (!connectWallet) {
      return;
    }

    if (
      isWalletConnected &&
      typeof window !== "undefined" &&
      pathname !== "/profile/experience"
    ) {
      setDropdownOpen(true);

      return;
    }

    if (
      isWalletConnected &&
      typeof window !== "undefined" &&
      pathname === "/profile/experience"
    ) {
      setDropdownOpen(true);

      return;
    }

    if (address) {
      if (entryType === "wallet") {
        dispatch(setIsDisconnectWalletPopupOpen(true));
        return;
      }
      await disconnectWallet();
    }

    dispatch(
      sendAnalyticsDataThunk({
        type: "wallet_connect_click",
        options: {},
      }),
    );

    if (isMobile) {
      connectWallet("WalletConnect");

      return;
    }

    dispatch(setIsWalletPopupOpen({ status: true, chainId: null }));
  };

  const shortAddress = useMemo(() => {
    if (accountInfo?.wallet) {
      return HelperService.getShortAddress(
        accountInfo.wallet,
        4,
      ).toLocaleLowerCase();
    }

    return "";
  }, [accountInfo]);

  const avatar: string = useMemo(() => {
    if (accountInfo?.currentLevel?.image) {
      return `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${accountInfo.currentLevel.image}`;
    }

    return "";
  }, [accountInfo]);

  const handleClick = (e: any) => {
    setDropdownOpen(true);
  };

  const logout = useCallback(async () => {
    setDropdownOpen(false);

    if (adminCreatePageOpened) {
      dispatch(setChangesWarningPopupPath("logout"));
      return;
    }

    await disconnectWallet();
    await dispatch(disconnectAccountThunk());
    window.location.reload();
  }, [adminCreatePageOpened, disconnectWallet, dispatch]);

  const accountStylesButtonRef = useRef<HTMLDivElement>(null);

  useClickOutside(accountStylesButtonRef, () => {
    setDropdownOpen(false);
  });

  return (
    <>
      {accountInfo?.connected ? (
        <AccountStyledButtons ref={accountStylesButtonRef}>
          <Button
            css={AccountStyledButtons}
            className={classnames("button-left", "c-font-16-20 c-font-color")}
            style="ghost"
            size="small"
            type="button"
            onClick={handleConnect}
          >
            {isWalletConnected && accountInfo?.wallet ? (
              shortAddress
            ) : (
              <Trans id="5b9kQD8xobQuTBdCqcN6Yy-account">Connect wallet</Trans>
            )}
          </Button>

          <AccountStyledDecor />

          <AccountStyledButton
            style="secondary"
            onClick={handleClick}
            className={
              "button-right button-connected c-font-16-20 c-font-color"
            }
          >
            <Box
              className={classnames({
                image: avatar !== "",
                svg: avatar === "",
              })}
            >
              {avatar !== "" ? (
                <Image src={avatar} alt={accountInfo.username} size="10" />
              ) : (
                <Icon name="account-user" size="24" />
              )}
            </Box>
          </AccountStyledButton>

          <AccountStyledDecor />

          <Box px={1} py={1.5}>
            <Bell />
          </Box>

          {dropdownOpen && (
            <AccountDropdown>
              <Button
                style="ghost"
                onClick={() => {
                  setDropdownOpen(false);

                  if (adminCreatePageOpened) {
                    dispatch(setChangesWarningPopupPath("/profile/experience"));
                    return;
                  }

                  push("/profile/experience");
                }}
                className="button"
              >
                <Trans id="6AgEiWArG8ivGXWuMyR4cU-account">My Account</Trans>
              </Button>

              <Box className="divider" />

              <Button
                style="ghost"
                className="c-font-color-4 button"
                onClick={logout}
              >
                <Trans id="vwZSfeB8qzK1jyhJnWrSTw-account">Log out</Trans>
              </Button>
            </AccountDropdown>
          )}
        </AccountStyledButtons>
      ) : (
        <AccountStyledButtons
          className={classnames({
            active:
              typeof window !== "undefined" &&
              (pathname === "/login" || pathname === "/sign-up"),
          })}
        >
          <Link
            href="/login"
            css={AccountStyledButtonStyles}
            className={classnames(
              "button-left",
              { active: pathname.includes("/login") },
              "c-font-16-20 c-font-color",
            )}
            onClick={() => {
              dispatch(setIsMenuOpen(false));
              if (
                !redirectUrl.includes("login") &&
                !redirectUrl.includes("sign-up")
              ) {
                dispatch(setLoginPrevLocation(redirectUrl));
              }
            }}
          >
            <Trans id="t5BjAxPiUysD2r13iD3EZs-account">Login</Trans>
          </Link>

          <AccountStyledDecor />

          <Link
            href="/sign-up"
            css={AccountStyledButtonStyles}
            className={classnames(
              "button-right",
              { active: pathname.includes("/sign-up") },
              "c-font-16-20 c-font-color",
            )}
            onClick={() => {
              dispatch(setIsMenuOpen(false));
              if (
                !redirectUrl.includes("login") &&
                !redirectUrl.includes("sign-up")
              ) {
                dispatch(setLoginPrevLocation(redirectUrl));
              }
            }}
          >
            <Trans id="6fp3BiH6XH91EqytRRWeqM-account">Sign Up</Trans>
          </Link>
        </AccountStyledButtons>
      )}
    </>
  );
};

export default Account;

{
  /* <LoginButton
          style="primary"
          href="/login?wallet=true"
          target="_self"
          size="small"
          onClick={() => {
            dispatch(setIsMenuOpen(false));
            if (
              !redirectUrl.includes("login") &&
              !redirectUrl.includes("sign-up")
            ) {
              dispatch(setLoginPrevLocation(redirectUrl));
            }
          }}
        >
          Connect wallet
        </LoginButton> */
}
