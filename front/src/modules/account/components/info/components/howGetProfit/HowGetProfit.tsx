import { useMemo } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";
import classnames from "classnames";

import { HowGetProfitWrapper } from "./howGetProfit.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { Button } from "@components/UI/button";
import { ELinks } from "@/models";

const HowGetProfit = () => {
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
    <HowGetProfitWrapper
      className={classnames({ ["active"]: referralTotal > 0 })}
    >
      {referralTotal > 0 ? (
        <Box className={classnames("number", "c-font-12-14 c-font-color-3")}>
          3
        </Box>
      ) : (
        <div className="image">
          <div className="decor" />
        </div>
      )}

      <Box className="content">
        <Box className="c-font-12-16 c-font-color" mb={2}>
          <Trans id="1Wjo9myoYtGntW8LV8LAPW-account">
            Get up 25% of friends profits by building referral empire
          </Trans>
        </Box>

        <Button
          className="button"
          style="task"
          size="task"
          type="button"
          href={ELinks.faq}
          target="_blank"
        >
          <Trans id="6zm3inrxc4P5xVLYTp29VY-account">Learn How</Trans>
        </Button>
      </Box>
    </HowGetProfitWrapper>
  );
};

export default HowGetProfit;
