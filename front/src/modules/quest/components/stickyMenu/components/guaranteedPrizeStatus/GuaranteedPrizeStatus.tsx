import classNames from "classnames";
import { Wrapper } from "./guaranteedPrizeStatus.styles";
import { FC, useMemo } from "react";
import { Box } from "@mui/material";
import { Trans } from "@lingui/macro";

interface Props {
  earnedPoints: number;
  threshold: number;
  endAt: string;
  className?: string;
  isClaimPeriodExpired: boolean;
  availableToClaim: boolean;
}

enum EGuaranteedStatus {
  COMPLETED = "completed",
  NOT_COMPLETED = "notCompleted",
  NOT_WINNER = "notWinner",
  EXPIRED_CLAIM = "expiredClaim",
}

const GuaranteedPrizeStatus: FC<Props> = ({
  earnedPoints,
  threshold,
  endAt,
  className,
  isClaimPeriodExpired,
  availableToClaim,
}) => {
  const status = useMemo(() => {
    if (isClaimPeriodExpired && availableToClaim)
      return EGuaranteedStatus.EXPIRED_CLAIM;
    if (
      endAt &&
      new Date(endAt).getTime() < new Date().getTime() &&
      earnedPoints < threshold
    )
      return EGuaranteedStatus.NOT_WINNER;
    if (earnedPoints < threshold) return EGuaranteedStatus.NOT_COMPLETED;
    return EGuaranteedStatus.COMPLETED;
  }, [availableToClaim, earnedPoints, endAt, isClaimPeriodExpired, threshold]);

  return (
    <Wrapper
      className={classNames(
        "c-font-color c-font-16-22",
        {
          shadow: [EGuaranteedStatus.COMPLETED].includes(status),
        },
        className,
      )}
    >
      {status === EGuaranteedStatus.NOT_COMPLETED && (
        <Trans id="hWE2nmHL4ZfH3QRKBDu84b-quest">
          Complete all tasks to claim
          <br />
          your prize!
        </Trans>
      )}
      {status === EGuaranteedStatus.COMPLETED && (
        <Box
          component="span"
          className="c-font-color-3 c-font-14-16 c-fw-500"
          textTransform="uppercase"
        >
          <Trans id="ib3R3t2kp4r35p9iF61UEE-quest">
            You can claim your reward!
          </Trans>
        </Box>
      )}
      {status === EGuaranteedStatus.NOT_WINNER && (
        <Trans id="gfvjfW5odaJn4XyUuvnueG-quest">
          You didn&apos;t win a prize.
          <br />
          Try your luck in another quest!
        </Trans>
      )}
      {status === EGuaranteedStatus.EXPIRED_CLAIM && (
        <Trans id="nwHnKqtArZfDvqRc4bKskH-quest">
          Claiming period has expired
        </Trans>
      )}
    </Wrapper>
  );
};

export default GuaranteedPrizeStatus;
