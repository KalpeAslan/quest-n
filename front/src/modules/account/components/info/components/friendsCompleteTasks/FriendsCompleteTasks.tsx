import { useMemo } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import classnames from "classnames";

import { FriendsCompleteTasksWrapper } from "./friendsCompleteTasks.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";

const FriendsCompleteTasks = () => {
  const accountInfo = useTypedSelector(getAccountInfo);

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
    <FriendsCompleteTasksWrapper
      className={classnames({ ["active"]: referralTotal > 0 })}
    >
      {referralTotal > 0 ? (
        <Box
          className={classnames("number", "c-font-12-14 c-font-color-3")}
          mb={1.5}
        >
          2
        </Box>
      ) : (
        <div className="image">
          <div className="decor" />
        </div>
      )}

      <Box className="content">
        <Box className="c-font-12-16 c-font-color">
          <Trans id="9F5oTWWR7kzyEygetn5Pt8-account">
            Your friends complete tasks to earn tokens. The more tasks they’ll
            complete, the bigger % of profits you&apos;ll get
          </Trans>
        </Box>
      </Box>
    </FriendsCompleteTasksWrapper>
  );
};

export default FriendsCompleteTasks;
