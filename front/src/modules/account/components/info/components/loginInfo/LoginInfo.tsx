import { useMemo } from "react";
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

  const referralTotal = useMemo(() => {
    if (
      accountInfo?.referralInfo?.referralsCount &&
      accountInfo?.referralInfo?.referralsCount > 0
    ) {
      return accountInfo.referralInfo.referralsCount;
    }

    return 0;
  }, [accountInfo]);

  return (
    <LoginInfoWrapper className={classnames({ ["active"]: referralTotal > 0 })}>
      {referralTotal > 0 ? (
        <Box
          className={classnames("number", "c-font-12-14 c-font-color-3")}
          mb={1.5}
        >
          1
        </Box>
      ) : (
        <div className="image">
          <div className="decor" />
        </div>
      )}

      <Box className="content">
        <Box className="c-font-12-16 c-font-color" mb={2}>
          <Trans id="qnyCwVFpodyzEKnsoSkJka-account">
            Share the referral link. Invite your friends to Sign Up
          </Trans>
        </Box>

        {!accountInfo?.connected && (
          <Button
            className="button"
            style="task"
            size="task"
            type="button"
            href="/login"
            target="_self"
          >
            <Trans id="vatELsqHhw3Lyf2iGJvRPq-account">Login</Trans>
          </Button>
        )}

        {accountInfo?.connected && (
          <Button
            className="button"
            style="task"
            size="task"
            type="button"
            onClick={() => {
              dispatch(setIsInviteReferralsPopupOpen(true));
            }}
          >
            <Trans id="j2cLWfcnrgC7WmEhnry1rc-account">Invite Now</Trans>
          </Button>
        )}
      </Box>
    </LoginInfoWrapper>
  );
};

export default LoginInfo;
