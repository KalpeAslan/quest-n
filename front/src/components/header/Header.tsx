import { useMemo } from "react";
import classnames from "classnames";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Icon } from "@components/UI/icon";
import { Button } from "@components/UI/button";
import { Image } from "@components/UI/image";
import { Account } from "@components/account";
import { useRouter } from "next/router";

import {
  HeaderStylesAccount,
  HeaderStylesAccountWrapper,
  HeaderStylesHeader,
  HeaderStylesLogo,
  HeaderStylesLogoItem,
  HeaderStylesMenu,
  HeaderStylesWallet,
  NavBar,
  Wrapper,
} from "./header.styles";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  setIsAccountMenuOpen,
  setIsAuthPopupOpen,
} from "@modules/account/store/account.slice";
import {
  setLoginPrevLocation,
  setIsMenuOpen,
  setChangesWarningPopupPath,
} from "@store/slices/system/system.slice";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import {
  getAccountState,
  getCurrentPartnerProject,
} from "@modules/account/store/account.selector";
import {
  getIsAdminCreatePageOpened,
  getIsAdminPanelOpened,
  getPartnerProjectSettingsLinkTitle,
  getSystemState,
} from "@store/slices/system/system.selector";
import LanguagesSelector from "@components/languagesSelector/LanguagesSelector";
import { appConfig } from "@/app.config";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { CBreakpoints } from "@styles/variables";
import NextImage from "next/image";
import { Bell } from "@components/Notifications/Bell";
import Link from "next/link";
import { EPATH_IDS, IMenuItem } from "@/models";

const Header = () => {
  const { pathname, push, query, asPath } = useRouter();
  const { id } = query as { id: string };

  const partnerProjectSettingsLinkTitle = useTypedSelector(
    getPartnerProjectSettingsLinkTitle,
  );
  const currentPartnerProject = useTypedSelector(getCurrentPartnerProject);
  const isAdminPanelOpened = useTypedSelector(getIsAdminPanelOpened);

  const MENU: IMenuItem[] = [
    {
      id: EPATH_IDS.QUEST,
      path: "/quest",
      icon: "menu-loyalty",
      title: "Quests",
      type: "self",
      status: "active",
      closeMenu: true,
      includeSubpaths: true,
    },
    {
      id: EPATH_IDS.EXPLORE,
      path: "/explore",
      icon: "menu-explore",
      title: "Explore",
      type: "self",
      status: "active",
      closeMenu: true,
      includeSubpaths: true,
    },
  ];

  const partnerProjectSettingsMenu: IMenuItem[] = useMemo(
    () => [
      // {
      //   id: 2,
      //   path: `/admin/project/dashboard`,
      //   icon: "menu-dashboard",
      //   title: t({
      //     id: "xAx2XVYDx4CktZfcBTaaWX-sidebar",
      //     message: "Dashboard",
      //   }),
      //   type: "self",
      //   status: "soon",
      //   closeMenu: true,
      //   includeSubpaths: false,
      // },
      // {
      //   id: 3,
      //   path:
      //     partnerProjectSettingsLinkTitle || currentPartnerProject?.linkTitle
      //       ? `/admin/project/edit`
      //       : "/admin/project/create",
      //   icon: "menu-settings",
      //   title: t({
      //     id: "83zJUBJ7c7nVR69Asyfxvf-sidebar",
      //     message: "Project Profile",
      //   }),
      //   type: "self",
      //   status: "active",
      //   closeMenu: true,
      //   includeSubpaths: false,
      // },
    ],
    [partnerProjectSettingsLinkTitle, currentPartnerProject?.linkTitle],
  );

  const isMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.md),
  );

  const isXLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.xLg),
  );

  const isLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.lg),
  );
  const dispatch = useAppDispatch();

  const adminCreatePageOpened = useTypedSelector(getIsAdminCreatePageOpened);
  const { accountInfo, isAccountMenuOpen } = useTypedSelector(getAccountState);
  const { isMenuOpen } = useTypedSelector(getSystemState);

  const avatar: string = useMemo(() => {
    if (accountInfo?.currentLevel?.image) {
      return `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${accountInfo.currentLevel.image}`;
    }

    return "";
  }, [accountInfo]);

  const iframe = useMemo(() => pathname.includes("iframe"), [pathname]);

  const { buttonName, path } = (() => {
    if (pathname.includes("/admin"))
      return {
        buttonName: "Switch to User App",
        path: "/",
      };

    return {
      buttonName: "Quests Control Panel",
      path: "/admin/projects",
    };
  })();

  return (
    <HeaderStylesHeader iframe={iframe}>
      <Wrapper className="c-wrap">
        {(accountInfo?.connected || iframe) && (
          <HeaderStylesAccountWrapper iframe={iframe}>
            <HeaderStylesAccount
              className={classnames({
                image: avatar !== "",
                svg: avatar === "",
              })}
              style="icon"
              iframe={iframe}
              loggedIn={accountInfo.connected && avatar}
              size="small"
              isMd={isMd}
              onClick={() => {
                if (iframe) {
                  if (accountInfo.connected) {
                    window.open(
                      `${window.location.protocol}//${window.location.host}/account`,
                      "_blank",
                    );
                    return;
                  }

                  dispatch(setIsAuthPopupOpen(true));
                  return;
                }

                dispatch(setIsMenuOpen(false));
                dispatch(setIsAccountMenuOpen(!isAccountMenuOpen));
              }}
            >
              {isXLg ? (
                <>
                  {isMd && (
                    <Icon
                      name={"dots"}
                      width={3}
                      height={17}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  {avatar ? (
                    <NextImage
                      className={"header__md__avatar"}
                      src={avatar}
                      alt={""}
                      width={22}
                      height={22}
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <Icon
                      className={"header__md__avatar"}
                      name="account-user"
                      size="24"
                    />
                  )}
                </>
              ) : (
                <>
                  {avatar !== "" ? (
                    <Image src={avatar} alt={accountInfo.username} size="10" />
                  ) : (
                    <Icon name="account-user" size="24" />
                  )}
                </>
              )}
            </HeaderStylesAccount>
          </HeaderStylesAccountWrapper>
        )}

        {pathname === "/" ? (
          <HeaderStylesLogoItem
            className={classnames({ acc: accountInfo?.connected })}
            onClick={() => {
              if (pathname === "/") {
                window.location.reload();
              }
            }}
          >
            <Icon name="logo" height="32" width="187" />
          </HeaderStylesLogoItem>
        ) : (
          <HeaderStylesLogo
            className={classnames({ acc: accountInfo?.connected })}
            href="/"
            onClick={e => {
              if (iframe) {
                e.preventDefault();
                window.open(
                  `${window.location.protocol}//${window.location.host}/quest/${id}`,
                  "_blank",
                );
                return;
              }

              if (pathname === "/") {
                window.location.reload();
              }

              if (adminCreatePageOpened) {
                e.preventDefault();
                dispatch(setChangesWarningPopupPath("/"));
              }
            }}
            iframe={iframe}
          >
            <Icon name="logo" height="32" width="187" />
          </HeaderStylesLogo>
        )}

        <NavBar>
          {(partnerProjectSettingsLinkTitle || isAdminPanelOpened
            ? partnerProjectSettingsMenu
            : MENU
          ).map(item => (
            <Link
              href={item.path}
              className={classnames("c-font-color c-font-14-14 c-fw-500 link", {
                active:
                  item.path === "/"
                    ? item.path === pathname
                    : (item.includeSubpaths && pathname.includes(item.path)) ||
                      asPath === item.path,
              })}
              onClick={e => {
                if (adminCreatePageOpened) {
                  e.preventDefault();
                  dispatch(setChangesWarningPopupPath(item.path));
                }
              }}
              key={item.path}
            >
              {item.title}
            </Link>
          ))}
        </NavBar>

        {isLg && !iframe && accountInfo?.connected && (
          <Box mr={2}>
            <Bell />
          </Box>
        )}
        {!pathname.includes("whitelisting") && !iframe && (
          <HeaderStylesMenu
            style="icon"
            size="small"
            onClick={() => {
              if (isMenuOpen || isAccountMenuOpen) {
                dispatch(setIsMenuOpen(false));
                dispatch(setIsAccountMenuOpen(false));
              }

              if (!isMenuOpen && !isAccountMenuOpen) {
                dispatch(setIsMenuOpen(true));
              }
            }}
          >
            <Icon
              name={
                isMenuOpen || isAccountMenuOpen ? "menu-close" : "menu-open"
              }
              height="24"
              width="24"
            />
          </HeaderStylesMenu>
        )}

        <>
          <HeaderStylesWallet ml="auto">
            <Account redirectUrl={asPath} />
          </HeaderStylesWallet>

          <HeaderStylesWallet sx={{ ml: 1.5 }}>
            <Button
              style="colorfull"
              size="small"
              className="adminButton"
              onClick={() => {
                dispatch(
                  sendAnalyticsDataThunk({ type: "create_quest", options: {} }),
                );

                if (adminCreatePageOpened) {
                  dispatch(setChangesWarningPopupPath("/admin/projects"));
                  return;
                }

                if (!accountInfo?.connected) {
                  dispatch(setLoginPrevLocation("/admin/projects"));
                  push("/sign-up");
                } else {
                  push(path);
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Icon name="menu-loyalty" width="18" height="18" />

                <Box component="span" sx={{ ml: 1 }}>
                  {buttonName}
                </Box>
              </Box>
            </Button>
          </HeaderStylesWallet>

          <HeaderStylesWallet
            sx={{ ml: 1.5, alignSelf: "flex-start", mt: "15px" }}
          >
            <LanguagesSelector />
          </HeaderStylesWallet>
        </>
      </Wrapper>
    </HeaderStylesHeader>
  );
};

export default Header;
