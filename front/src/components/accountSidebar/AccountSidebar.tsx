import { Box, Divider } from "@mui/material";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { Scroll } from "@components/UI/scroll";
import { Button } from "@components/UI/button";
import { Icon } from "@components/UI/icon";

import { useRouter } from "next/router";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  AccountSidebarStyledFooter,
  AccountSidebarStyledNavWrapper,
  AccountSidebarStylesWrapper,
} from "@/components/accountSidebar/accountSidebar.styles";
import { setIsAccountMenuOpen } from "@/modules/account/store/account.slice";
import {
  getAccountState,
  getCurrentPartnerProject,
} from "@modules/account/store/account.selector";
import { disconnectAccountThunk } from "@modules/account/store/account.thunks";
import { AccountEditButton } from "@components/accountSidebar/components/AccountEditButton/AccountEditButton";
import { useWalletConnect } from "@/hooks";
import { isSelectedTab } from "@components/account/account.utils";
import { useCallback } from "react";
import { getIsAdminCreatePageOpened } from "@/store/slices/system/system.selector";
import { setChangesWarningPopupPath } from "@/store/slices/system/system.slice";

const AccountSidebar = () => {
  const { pathname, push } = useRouter();
  const dispatch = useAppDispatch();

  const { isAccountMenuOpen } = useTypedSelector(getAccountState);
  const adminCreatePageOpened = useTypedSelector(getIsAdminCreatePageOpened);

  const { disconnect: disconnectWallet } = useWalletConnect();

  const handleClick = useCallback(
    (path: string) => {
      if (adminCreatePageOpened) {
        dispatch(setChangesWarningPopupPath(path));
        return;
      }

      push(path).then(() => {
        dispatch(setIsAccountMenuOpen(false));
      });
    },
    [adminCreatePageOpened, dispatch, push],
  );

  const currentPartnerProject = useTypedSelector(getCurrentPartnerProject);

  const handleClickCreateQuest = () => {
    if (currentPartnerProject && currentPartnerProject.linkTitle) {
      return handleClick("/admin/projects");
    }
    return handleClick("/admin/project/create");
  };

  return (
    <AccountSidebarStylesWrapper
      className={classnames({ opend: isAccountMenuOpen })}
    >
      <AccountSidebarStyledNavWrapper>
        <Scroll>
          <div className={"account-edit-button"}>
            <AccountEditButton />
          </div>
          <div style={{ padding: "0 20px" }}>
            <Divider />
          </div>

          <div className={"nav"}>
            <Button
              className={classnames("button c-button-main", {
                active: isSelectedTab("AQ Balance", pathname),
              })}
              style="icon"
              size="small"
              type="button"
              onClick={() => handleClick("/profile/experience")}
            >
              <>
                <Icon name="account-main-activity" size="24" />

                <Box component="p" className="c-font-12-16">
                  <Trans id="x4e2gQkiTnWGgHbCr58ofZ-accountSidebar">
                    Experience
                  </Trans>
                </Box>
              </>
            </Button>

            <Button
              className={classnames("button c-button-main", {
                active: isSelectedTab("accountsAndSecurity", pathname),
              })}
              onClick={() => handleClick("/profile/security")}
              style="icon"
              size="small"
              type="button"
            >
              <>
                <Icon name="accountsAndSecurity" size="24" />

                <Box component="p" className="c-font-12-16">
                  <Trans id="xhyv4BNFbRCorUmZMZNqVx-accountSidebar">
                    Accounts & Security
                  </Trans>
                </Box>
              </>
            </Button>

            <Button
              className={classnames("button c-button-main", {
                active: isSelectedTab("Quests", pathname),
              })}
              onClick={() => handleClick("/profile/quests")}
              style="icon"
              size="small"
              type="button"
            >
              <>
                <Icon name="agIconQuests" size="24" />

                <Box component="p" className="c-font-12-16">
                  <Trans id="cphyv4BNFbRCorUmZMZNqVx-accountSidebar">
                    Quests
                  </Trans>
                </Box>
              </>
            </Button>

            <Button
              className={classnames("button c-button-main", {
                active: isSelectedTab("Rewards", pathname),
              })}
              onClick={() => handleClick("/profile/rewards")}
              style="icon"
              size="small"
              type="button"
            >
              <>
                <Icon name="rewards" size="24" />

                <Box component="p" className="c-font-12-16">
                  <Trans id="dlkfjphyv4BNFbRCorUmZMZNqVx-accountSidebar">
                    Rewards
                  </Trans>
                </Box>
              </>
            </Button>

            <Button
              className={"button c-button-main"}
              style="icon"
              size="small"
              type="button"
              onClick={async () => {
                await disconnectWallet();
                await dispatch(disconnectAccountThunk());
                dispatch(setIsAccountMenuOpen(false));
              }}
            >
              <>
                <Icon name="account-logout" size="24" />

                <Box component="p" className="c-font-12-16">
                  <Trans id="8tPSRjjWwNaNouZxrk45N5-accountSidebar">
                    Log Out
                  </Trans>
                </Box>
              </>
            </Button>
          </div>
        </Scroll>
      </AccountSidebarStyledNavWrapper>

      <AccountSidebarStyledFooter>
        <Button
          className={"btn"}
          style="colorfull"
          type="button"
          onClick={handleClickCreateQuest}
        >
          <div>
            <Icon name="menu-loyalty" width="18" height="20" />

            <Box component="p" ml={1.5}>
              <Trans id="xmXs6BsdftYzzZa4dLBHcstKE-accountSidebar">
                Quests Control Panel
              </Trans>
            </Box>
          </div>
        </Button>
      </AccountSidebarStyledFooter>
    </AccountSidebarStylesWrapper>
  );
};

export default AccountSidebar;
