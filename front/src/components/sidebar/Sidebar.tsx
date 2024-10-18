import { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";

import { Scroll } from "@components/UI/scroll";
import { Decor } from "@components/decor";
import { Account } from "@components/account";
import { PATHS, IMenuItem, ELinks, EPATH_IDS } from "@models";

import { Sublinks } from "./components/sublinks";
import { SLink } from "./components/link";

import { useRouter } from "next/router";
import {
  SidebarStylesAccount,
  SidebarStylesFooter,
  SidebarStylesFooterBord,
  SidebarStylesFooterContent,
  SidebarStylesFooterTitle,
  SidebarStylesLanguageSelector,
  SidebarStylesNav,
  SidebarStylesNavItem,
  SidebarStylesNavWrapper,
  SidebarStylesWrapper,
} from "./sidebar.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import {
  getAccountState,
  getCurrentPartnerProject,
} from "@modules/account/store/account.selector";
import {
  getPartnerProjectSettingsLinkTitle,
  getSystemState,
  getIsAdminPanelOpened,
} from "@store/slices/system/system.selector";
import { LanguagesSelector } from "@components/languagesSelector";
import { Button } from "../UI/button";
import { Icon } from "../UI/icon";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import {
  setIsMenuOpen,
  setLoginPrevLocation,
} from "@/store/slices/system/system.slice";
import classNames from "classnames";
import { PartnerProjectsDropdown } from "@modules/quest/components/partnerProjectsDropdown/PartnerProjectsDropdown";
import { adminConstants } from "@modules/quest/types/admin.constants";

const Sidebar = () => {
  const MENU: IMenuItem[] = [
    {
      id: EPATH_IDS.HOME,
      path: "/",
      icon: "menu-loyalty",
      title: t({ id: "uCZRgGzunzHtz57eY4d8pK-Sidebar", message: "Home" }),
      type: "self",
      status: "active",
      closeMenu: true,
      includeSubpaths: true,
    },
    // {
    //   id: EPATH_IDS.QUEST,
    //   path: "/quest",
    //   icon: "menu-loyalty",
    //   title: t({ id: "rq1Y8a9g4ZWFhvekSggPuD-sidebar", message: "Quests" }),
    //   type: "self",
    //   status: "active",
    //   closeMenu: true,
    //   includeSubpaths: true,
    // },
    {
      id: EPATH_IDS.EXPLORE,
      path: "/explore",
      icon: "menu-explore",
      title: t({ id: "5kJ1WXzsA9CXUUVqF5f2Ms-sidebar", message: "Explore" }),
      type: "self",
      status: "active",
      closeMenu: true,
      includeSubpaths: true,
    },
    {
      id: EPATH_IDS.GAMES,
      path: "/games",
      icon: "menu-games",
      title: t({ id: "tHq65n6dzJhVVZ13U5c2PE-sidebar", message: "Games" }),
      type: "self",
      status: "new",
      closeMenu: true,
      includeSubpaths: true,
    },
  ];

  const { pathname, push } = useRouter();

  const dispatch = useAppDispatch();

  const [openedMenu, setOpenedMenu] = useState<number | null>(null);

  const { accountInfo } = useTypedSelector(getAccountState);
  const { isMenuOpen } = useTypedSelector(getSystemState);
  const partnerProjectSettingsLinkTitle = useTypedSelector(
    getPartnerProjectSettingsLinkTitle,
  );
  const currentPartnerProject = useTypedSelector(getCurrentPartnerProject);
  const isAdminPanelOpened = useTypedSelector(getIsAdminPanelOpened);

  const isAdminPage = adminConstants.paths.includes(pathname);

  const partnerProjectSettingsMenu = useMemo(
    () => [
      {
        id: "quests",
        path: `/admin/projects`,
        icon: "menu-loyalty",
        title: t({
          id: "sHj2LDWZ23K7ntwVDkFQSz-sidebar",
          message: "My Quests",
        }),
        type: "self",
        status: "active",
        closeMenu: true,
        includeSubpaths: false,
      },
      {
        id: "dashboard",
        path: `/admin/project/dashboard`,
        icon: "menu-dashboard",
        title: t({
          id: "xAx2XVYDx4CktZfcBTaaWX-sidebar",
          message: "Dashboard",
        }),
        type: "self",
        status: "soon",
        closeMenu: true,
        includeSubpaths: false,
      },
      {
        id: "settings",
        path:
          partnerProjectSettingsLinkTitle || currentPartnerProject?.linkTitle
            ? `/admin/project/edit`
            : "/admin/project/create",
        icon: "menu-settings",
        title: t({
          id: "83zJUBJ7c7nVR69Asyfxvf-sidebar",
          message: "Project Profile",
        }),
        type: "self",
        status: "active",
        closeMenu: true,
        includeSubpaths: false,
      },
    ],
    [partnerProjectSettingsLinkTitle, currentPartnerProject?.linkTitle],
  );

  const defineOpenedMenu = (path: string) => {
    if ((PATHS as any)[path]) {
      setOpenedMenu((PATHS as any)[path]);
    } else {
      setOpenedMenu(null);
    }
  };

  const handleOpenMenu = (id: number) => {
    if (id !== openedMenu) {
      setOpenedMenu(id);
    } else {
      defineOpenedMenu(pathname);
    }
  };

  useEffect(() => {
    defineOpenedMenu(pathname);
  }, [pathname]);

  return (
    <SidebarStylesWrapper opend={isMenuOpen}>
      <SidebarStylesNavWrapper>
        <Scroll>
          {isAdminPage ? (
            <SidebarStylesNav>
              <SidebarStylesNavItem>
                <PartnerProjectsDropdown />
              </SidebarStylesNavItem>
            </SidebarStylesNav>
          ) : (
            <SidebarStylesNav>
              {(partnerProjectSettingsLinkTitle || isAdminPanelOpened
                ? partnerProjectSettingsMenu
                : MENU
              ).map(link => {
                return (
                  (link.path || link.sublist) && (
                    <>
                      <SidebarStylesNavItem
                        key={link.id}
                        className={classNames({
                          explore: link.id === EPATH_IDS.EXPLORE,
                        })}
                      >
                        {link.sublist && link.sublist.length && (
                          <Sublinks
                            openedMenu={openedMenu}
                            link={link}
                            handleOpenMenu={handleOpenMenu}
                            status={link.status}
                          />
                        )}

                        {link.path && !link.sublist && (
                          <SLink link={link} status={link.status} />
                        )}
                      </SidebarStylesNavItem>

                      {link.id === EPATH_IDS.EXPLORE && (
                        <Box className="divider" />
                      )}
                    </>
                  )
                );
              })}
            </SidebarStylesNav>
          )}
        </Scroll>
      </SidebarStylesNavWrapper>

      <SidebarStylesFooter>
        <SidebarStylesLanguageSelector>
          <LanguagesSelector className="selector" />
        </SidebarStylesLanguageSelector>

        <Button
          className="mobile createQuest"
          style="colorfull"
          size="small"
          onClick={() => {
            dispatch(
              sendAnalyticsDataThunk({ type: "create_quest", options: {} }),
            );

            if (!accountInfo?.connected) {
              dispatch(setLoginPrevLocation("/admin/projects"));
              push("/sign-up");
            } else {
              push(isAdminPage ? "/" : "/admin/projects");
            }
            dispatch(setIsMenuOpen(false));
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Icon name="menu-loyalty" width="18" height="18" />

            <Box component="span" sx={{ ml: 1 }}>
              {isAdminPage ? (
                <Trans id={"bkjl5-bdfkbn2-db-12-dsvljb"}>
                  Switch on user app
                </Trans>
              ) : (
                <Trans id="5cnt1SspSKyAC1xAMCqJWH-sidebar">
                  Quests Control Panel
                </Trans>
              )}
            </Box>
          </Box>
        </Button>

        {!accountInfo?.connected && (
          <SidebarStylesAccount mx={2} mb={2}>
            <Account redirectUrl="/profile/experience" />
          </SidebarStylesAccount>
        )}

        <SidebarStylesFooterBord>
          <SidebarStylesFooterContent>
            <SidebarStylesFooterTitle
              component="p"
              className="c-font-16-20"
              sx={{ mb: 1.5, fontWeight: 600 }}
            >
              <Trans id="f9HpiocUqqWMGzBFoA1viL-sidebar">
                Want to Boost community of your Project?
              </Trans>
            </SidebarStylesFooterTitle>

            <Box
              component="a"
              className="c-font-16-22 c-text-link"
              sx={{ fontWeight: 500, zIndex: 1 }}
              href={ELinks.getInTouch}
              target="_blank"
              rel="noreferrer"
            >
              <Trans id="kwp5ajsuwPZCAeMRKrG7HX-sidebar">Get in Touch</Trans>
            </Box>
          </SidebarStylesFooterContent>

          <Decor />
        </SidebarStylesFooterBord>
      </SidebarStylesFooter>
    </SidebarStylesWrapper>
  );
};
export default Sidebar;
