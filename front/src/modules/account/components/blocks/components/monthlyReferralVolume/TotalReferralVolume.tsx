import { useMemo } from "react";
import { Box } from "@mui/system";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { InviteReferralButton } from "@components/inviteReferralButton";
import { IAccount } from "@modules/account/models";
import { Button } from "@components/UI/button";

import { Progress } from "./components/progress";
import { MonthlyReferralVolumeWrapper } from "./monthlyReferralVolume.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { ELinks } from "@/models";

const TotalReferralVolume = () => {
  const accountInfo: IAccount = useTypedSelector(getAccountInfo);

  const monthlyReferralVolume = useMemo(() => {
    if (accountInfo?.referralInfo.referralProfit.groupVolume) {
      return accountInfo.referralInfo.referralProfit.groupVolume;
    }

    return 0;
  }, [accountInfo]);

  const currentProfit = useMemo(() => {
    if (
      accountInfo?.referralInfo.currentReferralRank &&
      accountInfo?.referralInfo.currentReferralRank.currentRank &&
      accountInfo?.referralInfo.currentReferralRank.currentRank.percentage
    ) {
      return accountInfo?.referralInfo.currentReferralRank.currentRank
        .percentage;
    }

    return 0;
  }, [accountInfo]);

  const monthlyGroupVolume = useMemo(() => {
    if (accountInfo?.referralInfo?.referralProfit.groupVolume) {
      return accountInfo.referralInfo.referralProfit.groupVolume;
    }

    return 0;
  }, [accountInfo]);

  const referralTotal = useMemo(() => {
    if (accountInfo?.referralInfo?.referralsCount) {
      return accountInfo.referralInfo.referralsCount;
    }

    return 0;
  }, [accountInfo]);

  const ranksTotal = useMemo(() => {
    if (accountInfo?.referralInfo?.referralsByRanks) {
      return accountInfo.referralInfo.referralsByRanks;
    }

    return 0;
  }, [accountInfo]);

  const referralsByRanks = useMemo(() => {
    if (accountInfo?.referralInfo?.referralsByRanks) {
      return Object.entries(accountInfo.referralInfo.referralsByRanks).map(
        ([code, value]) => ({
          code,
          total: +value,
        }),
      );
    }

    return [];
  }, [accountInfo]);

  const highestVal: number | null = useMemo(() => {
    if (referralsByRanks === null) {
      return 1;
    }

    const values: number[] = [];

    referralsByRanks.forEach(value => values.push(value.total));

    return Math.max(...values);
  }, [referralsByRanks]);

  return (
    <MonthlyReferralVolumeWrapper>
      <Box component="header" className="header" mb={1.5}>
        <p className="c-font-14-20 c-font-color">
          <Trans id="8JS9tKKiz9UkZEvxV8vRos-account">
            Total Referral Volume
          </Trans>
        </p>

        <Button
          className="link"
          href={ELinks.faq}
          type="button"
          style="link"
          target="_blank"
        >
          <Trans id="uX1qaQ9SVT9f5RE1y8MUUx-account">FAQ</Trans>
        </Button>
      </Box>

      <Box
        component="p"
        className={classnames(
          "title",
          "c-font-grad c-font-32-36 c-inline-block",
        )}
      >
        <Box mr={0.5} component="span">
          {monthlyReferralVolume}
        </Box>
        AQ
      </Box>

      <Box component="p" className="c-font-14-20 c-font-color" mb={2}>
        <Trans id="6ePxzudGSufgX3RUEz87oq-account">
          You get max{" "}
          <span className="c-font-color-3">{`${currentProfit}%`}</span> of AQ
          tokens from your referral volume{" "}
          <span className="c-font-color-3">{monthlyGroupVolume} AQ</span>
        </Trans>
      </Box>

      <Box
        mb={{
          xs: referralsByRanks && referralsByRanks.length > 0 ? 2 : 0,
        }}
      >
        <InviteReferralButton>
          <Box className="c-font-12-16 c-font-color" component="p">
            <Trans id="dYvVXHiBZTWTBjqvjDipJy-account">
              <span className="c-font-color-3">{referralTotal} referrals</span>{" "}
              ranks, invite new and increase your income
            </Trans>
          </Box>
        </InviteReferralButton>
      </Box>

      {referralsByRanks && referralsByRanks.length > 0 && (
        <Box className="cont">
          {referralsByRanks.map(item => (
            <Progress
              key={item.code}
              users={item.total}
              score={item.total} //TODO groupValue
              progress={(item.total * 100) / highestVal}
              label={item.code}
            />
          ))}
        </Box>
      )}
    </MonthlyReferralVolumeWrapper>
  );
};

export default TotalReferralVolume;
