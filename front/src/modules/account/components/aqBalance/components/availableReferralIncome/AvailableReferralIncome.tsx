import { useMemo, useState } from "react";
import { Box } from "@mui/system";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { accountService } from "@api";
import { Button } from "@components/UI/button";
import { LoggerService } from "@services";
import {
  AvailableReferralIncomeWrapper,
  AccountButton,
  AccountLink,
} from "./availableReferralIncome.styles";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import {
  setAccountInfo,
  setIsInviteReferralsPopupOpen,
} from "@/modules/account/store/account.slice";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { IAccount } from "@modules/account/models";
import { Theme, useMediaQuery } from "@mui/material";
import { CBreakpoints } from "@styles/variables";
import { Icon } from "@/components/UI/icon";
import { ELinks } from "@/models";

const AvailableReferralIncome = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const isNotMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.md),
  );

  const accountInfo: IAccount = useTypedSelector(getAccountInfo);

  const availableToClaim: number = useMemo(() => {
    if (accountInfo?.referralInfo?.claimableReferralProfit) {
      return accountInfo?.referralInfo?.claimableReferralProfit;
    }

    return 0;
  }, [accountInfo]);

  const referralIncomesLastMounth: number = useMemo(() => {
    if (
      accountInfo?.referralInfo?.availableReferralIncome &&
      accountInfo?.referralInfo?.availableReferralIncome
        .referralIncomesLastMounth
    ) {
      return accountInfo?.referralInfo?.availableReferralIncome
        .referralIncomesLastMounth;
    }

    return 0;
  }, [accountInfo]);

  const claim = async () => {
    if (!accountInfo || !accountInfo.referralInfo) {
      return;
    }

    try {
      setIsLoaded(false);

      const {
        data: { referralProfit, claimableReferralProfit, referralCode },
      } = await accountService.putClaimReferralTokens();

      dispatch(
        setAccountInfo({
          ...accountInfo,
          referralInfo: {
            ...accountInfo.referralInfo,
            referralProfit: {
              ...accountInfo.referralInfo.referralProfit,
              referralProfit,
            },
            claimableReferralProfit,
            referralCode,
          },
        }),
      );

      dispatch(
        sendAnalyticsDataThunk({ type: "account_claim_tap", options: {} }),
      );
    } catch (error: any) {
      LoggerService.error("Failed during claim", error);
    } finally {
      setIsLoaded(true);
    }
  };

  return (
    <AvailableReferralIncomeWrapper>
      <Box component="header" className="header" mb={1.5}>
        <p className="c-font-14-20 c-font-color">
          <Trans id="6m9gachj6qfphPdY79qPh2-account">
            Available Referral Income
          </Trans>
        </p>
      </Box>

      <Box
        component="p"
        className={classnames(
          "title",
          "c-font-grad c-font-32-36 c-inline-block",
        )}
        mb={2}
      >
        {availableToClaim && availableToClaim > 0
          ? `${availableToClaim} AQ`
          : "0 AQ"}{" "}
      </Box>

      <Button
        className="button"
        style="task"
        size="task"
        type="button"
        loading={!isLoaded}
        disabled={availableToClaim === 0 || !isLoaded}
        onClick={claim}
      >
        <Trans id="uKJZ8u161nD4jabP6T26bR-account">Claim</Trans>
      </Button>

      <AccountButton
        style="colorfull"
        type="button"
        onClick={() => {
          dispatch(setIsInviteReferralsPopupOpen(true));
        }}
      >
        <div>
          <Icon
            style={{ transform: "rotate(45deg)" }}
            name="menu-close"
            size="15"
          />

          <Box component="p" ml={1.5}>
            <Trans id="pYpdsoiDYMkBxt8wk3tvC1-account">Add new referrals</Trans>
          </Box>
        </div>
      </AccountButton>

      <AccountLink
        className="link"
        style="link"
        size="task"
        type="button"
        href={ELinks.faq}
        target="_blank"
      >
        <Trans id="wN77aLvWfiN1LWxkCf7Qyb-account">Learn More</Trans>
      </AccountLink>
    </AvailableReferralIncomeWrapper>
  );
};

export default AvailableReferralIncome;
