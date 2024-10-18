import { useMemo } from "react";
import { Box } from "@mui/system";
import classnames from "classnames";
import { t, Trans } from "@lingui/macro";

import { Button } from "@components/UI/button";
import { Icon } from "@components/UI/icon";
import { ELinks, ExperienceLevel } from "@models";

import { User } from "./components/user";
import { AccountWrapper } from "./account.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { getAccountState } from "@modules/account/store/account.selector";
import { disconnectAccountThunk } from "@modules/account/store/account.thunks";
import { appConfig } from "@/app.config";
import { useWalletConnect } from "@/hooks";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";
import { isSelectedTab } from "@components/account/account.utils";

const AccountBar = () => {
  const dispatch = useAppDispatch();
  const { accountInfo } = useTypedSelector(getAccountState);

  const { disconnect: disconnectWallet } = useWalletConnect();

  const { push, pathname } = useRouter();

  const currentLevel: ExperienceLevel | null = useMemo(() => {
    if (accountInfo?.currentLevel) {
      return accountInfo.currentLevel;
    }

    return null;
  }, [accountInfo]);

  const avatar: string = useMemo(() => {
    if (currentLevel) {
      return `${appConfig.NEXT_PUBLIC_S3_BUCKET}/${currentLevel.image}`;
    }

    return "";
  }, [accountInfo, currentLevel]);

  return (
    <>
      <AccountWrapper mb={1.5}>
        <Box mb={2}>
          <User
            name={accountInfo?.username}
            lvl={
              currentLevel
                ? `${currentLevel.name}, ${currentLevel.level} ${t({
                    id: "qqjjfLcJ2wobeiE4bSPMqc-account",
                    message: "level",
                  })}`
                : ""
            }
            image={avatar}
          />
        </Box>

        <Box className="buttons" mb={2}>
          <Button
            className={classnames("button", {
              active: isSelectedTab("experience", pathname),
            })}
            style="task"
            size="medium"
            type="button"
            onClick={() => push("/profile/experience")}
          >
            <>
              <Icon name="account-main-activity" size="24" />

              <Box component="p" className="c-font-12-16" mt={0.75}>
                <Trans id="xtAaX7RJtf3f3ceL3Q1tyb-account">Experience</Trans>
              </Box>
            </>
          </Button>

          <Button
            className={classnames("button", {
              active: isSelectedTab("accountsAndSecurity", pathname),
            })}
            onClick={() => push("/profile/security")}
            style="task"
            size="medium"
            type="button"
          >
            <>
              <Icon name="accountsAndSecurity" size="24" />

              <Box component="p" className="c-font-12-16" mt={0.75}>
                <Trans id="92v4HSgGd1nYABxhtyXTnzY-account">
                  Accounts & Security
                </Trans>
              </Box>
            </>
          </Button>

          <Button
            className={classnames("button", {
              active: isSelectedTab("Quests", pathname),
            })}
            style="task"
            size="medium"
            type="button"
            onClick={() => {
              push("/profile/quests");
            }}
          >
            <>
              <Icon name="agIconQuests" size="24" />

              <Box component="p" className="c-font-12-16" mt={0.75}>
                <Trans id="1zZ89kTDu1NCRx15oEKTpRQ-account">Quests</Trans>
              </Box>
            </>
          </Button>

          <Button
            className={classnames("button", {
              active: isSelectedTab("Rewards", pathname),
            })}
            style="task"
            size="medium"
            type="button"
            onClick={() => push("/profile/rewards")}
          >
            <>
              <Icon name="rewards" size="24" />

              <Box component="p" className="c-font-12-16" mt={0.75}>
                <Trans id="8p5MLAqE9zQ7jNUnfbSU23-account">Rewards</Trans>
              </Box>
            </>
          </Button>
        </Box>

        <footer className="footer">
          <Box display={"flex"} alignItems={"center"}>
            <Icon name="loyalty-email" size="18" />

            <Button
              className="footer-button"
              style="link"
              type="button"
              target="_blank"
              href={ELinks.telegram}
            >
              <Trans id="2wWvcmVWLaBh35XSB8CCpN-account">Contact Support</Trans>
            </Button>
          </Box>
          <Divider sx={{ width: "100%", my: 2 }} />

          <Box
            className={"c-font-color-4 c-pointer"}
            display={"flex"}
            alignItems={"center"}
            gap={1}
            onClick={async () => {
              await disconnectWallet();
              await dispatch(disconnectAccountThunk());
            }}
          >
            <Icon name="account-logout" size="24" />

            <Box component="p" className="c-font-12-16">
              <Trans id="7p5MLAqE9zQ7jNUnfbSU23-account">Log Out</Trans>
            </Box>
          </Box>
        </footer>
      </AccountWrapper>
    </>
  );
};

export default AccountBar;
