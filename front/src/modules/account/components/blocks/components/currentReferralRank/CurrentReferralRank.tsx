import { useMemo } from "react";
import { Box } from "@mui/system";
import classnames from "classnames";
import { Trans } from "@lingui/macro";

import { IAccount, ReferralRanksRule } from "@modules/account/models";
import { InviteReferralButton } from "@components/inviteReferralButton";
import { Button } from "@components/UI/button";

import { Profit } from "./components/profit";
import { CurrentReferralRankWrapper } from "./currentReferralRank.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { ELinks } from "@/models";

const CurrentReferralRank = () => {
  const accountInfo: IAccount = useTypedSelector(getAccountInfo);

  const currentRank: ReferralRanksRule = useMemo(() => {
    if (
      accountInfo?.referralInfo?.currentReferralRank.currentRank &&
      accountInfo?.referralInfo?.currentReferralRank.currentRank
    ) {
      return accountInfo.referralInfo.currentReferralRank
        .currentRank as ReferralRanksRule;
    }

    return {
      percentage: 0,
      code: "N",
      max_value: 0,
      min_value: 0,
    };
  }, [accountInfo]);

  const nextRank: ReferralRanksRule | null = useMemo(() => {
    if (accountInfo?.referralInfo?.currentReferralRank.nextRanks) {
      return accountInfo.referralInfo.currentReferralRank.nextRanks[0] || null;
    }

    return null;
  }, [accountInfo]);

  const nextRanks: ReferralRanksRule[] = useMemo(() => {
    if (accountInfo?.referralInfo?.currentReferralRank.nextRanks) {
      return accountInfo.referralInfo.currentReferralRank.nextRanks;
    }

    return [];
  }, [accountInfo]);

  const referralRankReachedVolume = useMemo(() => {
    if (accountInfo?.referralInfo?.currentReferralRank.groupVolume) {
      return accountInfo.referralInfo.currentReferralRank.groupVolume;
    }

    return 0;
  }, [accountInfo]);

  const referralRankProgress = useMemo(() => {
    if (referralRankReachedVolume && nextRank?.min_value) {
      return (referralRankReachedVolume * 100) / nextRank?.min_value;
    }

    return 0;
  }, [referralRankReachedVolume, nextRank]);

  const neededPoints = useMemo(() => {
    if (accountInfo?.referralInfo?.currentReferralRank.groupVolumeForNextRank) {
      return accountInfo.referralInfo.currentReferralRank
        .groupVolumeForNextRank;
    }

    return null;
  }, [accountInfo]);

  return (
    <CurrentReferralRankWrapper>
      <Box component="header" className="header">
        <p className="c-font-14-20 c-font-color">
          <Trans id="sTESm8cwFDECjDWYxwJmqe-account">
            Current Referral Rank
          </Trans>
        </p>

        <Button
          className="link"
          href={ELinks.faq}
          type="button"
          style="link"
          target="_blank"
        >
          <Trans id="woPMmYSqKMX1tK3n9degmS-account">FAQ</Trans>
        </Button>
      </Box>

      <Box mb={2}>
        <Profit currentRank={currentRank} nextRanks={nextRanks} />
      </Box>

      <Box className="cont">
        <Box className="info" mb={1.5}>
          <Box className="info-item">
            <p
              className={classnames(
                "info-item-title",
                "c-font-12-16 c-font-color",
              )}
            >
              <Trans id="iZj66Unjsi242ftJLWywAb-account">
                Monthly vol. for referral rank transfer
              </Trans>
            </p>

            <div className="info-decor" />

            <p className="c-font-12-16 c-font-color c-nowrap c-text-right">
              {referralRankReachedVolume} AQ
            </p>
          </Box>
        </Box>

        <Box className="progress">
          <div className="progress-wrapper">
            <p
              className="progress-score"
              style={{ width: `${referralRankProgress}%` }}
            ></p>
            <p
              className="progress-score-point"
              style={{ left: `calc(${referralRankProgress}% - 4px)` }}
            ></p>
          </div>

          <div className="progress-footer">
            {currentRank && currentRank.code && currentRank.min_value >= 0 && (
              <p className="c-font-12-16 c-font-color-2">
                {currentRank.min_value} AQ -{" "}
                <Trans id="cWaMFdxCHPgSxh14EuV6Mq-account">Rank</Trans>{" "}
                {currentRank.code}
              </p>
            )}

            {nextRank && nextRank.code && nextRank.min_value >= 0 && (
              <Box
                component="p"
                className="c-font-12-16 c-font-color-2"
                ml="auto"
              >
                {nextRank.min_value}AQ -{" "}
                <Trans id="q9vLuVMo25aLvXscKUp3T4-account">Rank</Trans>{" "}
                {nextRank.code}
              </Box>
            )}
          </div>
        </Box>
      </Box>

      <Box>
        <InviteReferralButton>
          <Box className="c-font-12-16 c-font-color" component="p">
            <Trans id="pddnp1HxJJCD7hpL7pom5q-account">You need</Trans>{" "}
            <Box component="span" mr={0.5}>
              {neededPoints ? neededPoints : "... "} AQ
            </Box>
            <Trans id="dNYdzUjSxKvKig8Fy8Q1CU-account">
              to get the next referral level
            </Trans>
          </Box>
        </InviteReferralButton>
      </Box>
    </CurrentReferralRankWrapper>
  );
};

export default CurrentReferralRank;
