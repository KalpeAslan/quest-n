import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import classnames from "classnames";

import { Button } from "@components/UI/button";
import { LoginInfoWrapper } from "./loginInfo.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setIsInviteReferralsPopupOpen } from "@/modules/account/store/account.slice";
import { getAccountInfo } from "@modules/account/store/account.selector";

const LoginInfo = () => {
  const accountInfo = useTypedSelector(getAccountInfo);
  const dispatch = useAppDispatch();

  return (
    <LoginInfoWrapper>
      <div className="image">
        <div className="decor" />
      </div>

      <Box className="content" mt="auto">
        <Box className="c-font-20-24 c-font-grad" mb={2}>
          <Trans id="dx3qATga7W62JdjMSFQhRk-account">
            If you invite 20 friends, YOUR REFERRAL INCOME WILL BE 120AQ ($120)
          </Trans>
        </Box>

        <div>
          <div className="buttons">
            {!accountInfo?.connected && (
              <>
                <Button
                  className="button"
                  style="task"
                  size="task"
                  type="button"
                  href="/login"
                  target="_self"
                >
                  <Trans id="b3Xr61nEuYmdBxzukonajJ-account">Login</Trans>
                </Button>

                <Button
                  className="button"
                  style="task"
                  size="task"
                  type="button"
                  href="/sign-up"
                  target="_self"
                >
                  <Trans id="cDGURqAeARPtNZsiCX9Cne-account">
                    Create account
                  </Trans>
                </Button>
              </>
            )}

            {accountInfo?.connected && (
              <Button
                className={classnames("button", "max")}
                style="task"
                size="task"
                type="button"
                onClick={() => {
                  dispatch(setIsInviteReferralsPopupOpen(true));
                }}
              >
                <Trans id="ankTRrA3S2kNC3Rr2hTHM3-account">
                  Invite New Referrals
                </Trans>
              </Button>
            )}
          </div>

          <Box mt={1} className={"c-font-12-12 c-font-color-2"}>
            <Trans id="nzbLd6hLJep3We8NfZEdAX-account">
              The value is only estimation of possible referral income, it can
              vary
            </Trans>
          </Box>
        </div>
      </Box>
    </LoginInfoWrapper>
  );
};

export default LoginInfo;
