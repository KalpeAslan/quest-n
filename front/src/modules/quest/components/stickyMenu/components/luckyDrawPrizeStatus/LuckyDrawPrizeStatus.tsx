import { FC, useMemo } from "react";
import { Wrapper } from "./luckyDrawPrizeStatus.styles";
import { CountDown } from "@/components/countDown";
import classNames from "classnames";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

interface Props {
  tasksDone: number;
  earnedPoints: number;
  threshold: number;
  endAt: string;
  isWinner: boolean;
  className?: string;
  isClaimPeriodExpired: boolean;
  availableToClaim: boolean;
}

enum ELuckyDrawStatus {
  START = "start",
  NOT_ELIGIBLE = "notEligible",
  ELIGIBLE = "eligible",
  NOT_WINNER = "notWinner",
  WINNER = "winner",
  EXPIRED_CLAIM = "expiredClaim",
}

const LuckyDrawPrizeStatus: FC<Props> = ({
  tasksDone,
  earnedPoints,
  threshold,
  endAt,
  isWinner,
  className,
  isClaimPeriodExpired,
  availableToClaim,
}) => {
  const status = useMemo(() => {
    if (new Date(endAt).getTime() < new Date().getTime()) {
      if (isWinner) return ELuckyDrawStatus.WINNER;

      if (isClaimPeriodExpired && availableToClaim)
        return ELuckyDrawStatus.EXPIRED_CLAIM;

      return ELuckyDrawStatus.NOT_WINNER;
    }
    if (tasksDone === 0) return ELuckyDrawStatus.START;
    if (tasksDone > 0 && earnedPoints < threshold)
      return ELuckyDrawStatus.NOT_ELIGIBLE;
    if (earnedPoints >= threshold) return ELuckyDrawStatus.ELIGIBLE;
    return ELuckyDrawStatus.NOT_WINNER;
  }, [
    availableToClaim,
    earnedPoints,
    endAt,
    isClaimPeriodExpired,
    isWinner,
    tasksDone,
    threshold,
  ]);

  return (
    <Wrapper
      className={classNames(
        "c-font-color c-font-16-22",
        {
          shadow: [
            ELuckyDrawStatus.NOT_ELIGIBLE,
            ELuckyDrawStatus.ELIGIBLE,
            ELuckyDrawStatus.WINNER,
          ].includes(status),
        },
        className,
      )}
    >
      {status === ELuckyDrawStatus.START && (
        <Trans id="uoXqUmZrNZmZY4D9tBZHxq-quest">
          Start completing tasks
          <br />
          to be eligible for the main draw
        </Trans>
      )}

      {status === ELuckyDrawStatus.NOT_ELIGIBLE && (
        <Trans id="sFMhTCWcoSFKFhb91XFaWk-quest">
          Earn {threshold - earnedPoints} more{" "}
          {threshold - earnedPoints > 1 ? "points" : "point"} to become eligible
          for the main draw
        </Trans>
      )}

      {status === ELuckyDrawStatus.ELIGIBLE && (
        <Box component="span" className="c-font-color-3 c-fw-500">
          <Trans id="tMiHahz2vdkMya8wzpzAyV-quest">
            <Box
              component="span"
              className="c-font-color"
              textTransform="uppercase"
            >
              You are eligible
              <br />
              for the main draw
            </Box>
            <br />
            in <CountDown date={new Date(endAt).getTime()} color="#87F696" />
          </Trans>
        </Box>
      )}

      {status === ELuckyDrawStatus.NOT_WINNER && (
        <Trans id="qqh2SDeEB43pLGSJPtPrDQ-quest">
          You didn&apos;t win a prize.
          <br />
          Try your luck in another quest!
        </Trans>
      )}

      {status === ELuckyDrawStatus.WINNER && (
        <Box
          component="span"
          className="c-font-color-3 c-fw-500"
          textTransform="uppercase"
        >
          <Trans id="4tx1fa5EHhaaqfnfefEnea-quest">
            You are one of the winners! 🎉
            <br />
            You can claim you prize!
          </Trans>
        </Box>
      )}
      {status === ELuckyDrawStatus.EXPIRED_CLAIM && (
        <Trans id="6vPWvwmw4JxG2i5qawfuA8-quest">
          Claiming period has expired
        </Trans>
      )}
    </Wrapper>
  );
};

export default LuckyDrawPrizeStatus;
