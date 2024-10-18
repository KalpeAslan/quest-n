import { FC, useMemo } from "react";
import { Wrapper } from "./scoreboardPrizeStatus.styles";
import { ETokenType } from "@/models";
import { IPrizePool } from "@/modules/quest/models";
import { Box } from "@mui/material";
import classNames from "classnames";
import { Trans, t } from "@lingui/macro";

interface Props {
  currentPrizePool: IPrizePool;
  nextPrizePool: IPrizePool;
  tasksDone: number;
  claimingStartAt: string;
  claimingEndAt: string;
  endAt: string;
  className?: string;
  isClaimed: boolean;
  isClaimPeriodExpired: boolean;
  availableToClaim: boolean;
}

enum EScoreboardStatus {
  START = "start",
  NOT_PRIZE = "notPrize",
  PRIZE = "prize",
  FIRST_PRIZE = "firstPrize",
  CLAIM = "claim",
  CLAIMED = "claimed",
  NOT_WINNER = "notWinner",
  EXPIRED_CLAIM = "expiredClaim",
}

const ScoreboardPrizeStatus: FC<Props> = ({
  currentPrizePool,
  nextPrizePool,
  tasksDone,
  claimingStartAt,
  claimingEndAt,
  endAt,
  className,
  isClaimed,
  isClaimPeriodExpired,
  availableToClaim,
}) => {
  const isActiveQuest = useMemo(
    () => new Date(endAt).getTime() > new Date().getTime(),
    [endAt],
  );

  const status = useMemo(() => {
    if (isClaimPeriodExpired && availableToClaim)
      return EScoreboardStatus.EXPIRED_CLAIM;
    if (!tasksDone && isActiveQuest) return EScoreboardStatus.START;
    if (!currentPrizePool?.rewards?.length && isActiveQuest)
      return EScoreboardStatus.NOT_PRIZE;
    if (
      currentPrizePool?.rewards?.length &&
      nextPrizePool?.rewards?.length &&
      isActiveQuest
    )
      return EScoreboardStatus.PRIZE;
    if (
      currentPrizePool?.rewards?.length &&
      (!nextPrizePool?.rewards?.length ||
        new Date(endAt).getTime() < new Date().getTime()) &&
      (claimingStartAt || endAt) &&
      new Date(claimingStartAt || endAt).getTime() > new Date().getTime() &&
      (isActiveQuest ||
        new Date(endAt).getTime() < new Date().getTime())
    )
      return EScoreboardStatus.FIRST_PRIZE;

    if (
      currentPrizePool?.rewards?.length &&
      (claimingStartAt || endAt) &&
      new Date(claimingStartAt || endAt).getTime() <= new Date().getTime() &&
      (!claimingEndAt ||
        new Date(claimingEndAt).getTime() > new Date().getTime()) &&
      !isClaimed
    )
      return EScoreboardStatus.CLAIM;

    if (currentPrizePool?.rewards?.length && isClaimed)
      return EScoreboardStatus.CLAIMED;

    return EScoreboardStatus.NOT_WINNER;
  }, [
    availableToClaim,
    claimingEndAt,
    claimingStartAt,
    currentPrizePool?.rewards,
    endAt,
    isActiveQuest,
    isClaimPeriodExpired,
    isClaimed,
    nextPrizePool?.rewards?.length,
    tasksDone,
  ]);

  const nextPrizePoolRewards = useMemo(
    () =>
      nextPrizePool
        ? nextPrizePool.rewards
            .map(item =>
              item.contract.type == ETokenType.Nft
                ? `${item.amount} ${
                    item.amount > 1
                      ? t({
                          id: "cqrUwqzGVGKkvjzMHBNCJu-quest",
                          message: "NFTs",
                        })
                      : t({
                          id: "sPAecdud3VDSTXpJPDurk6-quest",
                          message: "NFT",
                        })
                  }`
                : `${item.amount} ${item.contract.symbol}`,
            )
            .join(" + ")
        : "",
    [nextPrizePool],
  );

  const pintsToNextPrize = useMemo(
    () => (nextPrizePool?.points || 0) - (currentPrizePool?.points || 0),
    [currentPrizePool?.points, nextPrizePool?.points],
  );

  return (
    <Wrapper
      className={classNames(
        "c-font-color c-font-16-22",
        {
          shadow: [
            EScoreboardStatus.NOT_PRIZE,
            EScoreboardStatus.CLAIM,
          ].includes(status),
        },
        className,
      )}
    >
      {status === EScoreboardStatus.START && (
        <Trans id="pi6gMb27JvcRVpNVJSohv8-quest">
          Start completing tasks
          <br />
          to get rewards
        </Trans>
      )}
      {status === EScoreboardStatus.NOT_PRIZE && (
        <Trans id="3i1R9hNs8gJGTevtjv33Fd-quest">
          To raise the reward to {nextPrizePoolRewards}
          <br />
          you need to score {pintsToNextPrize} points
        </Trans>
      )}
      {status === EScoreboardStatus.PRIZE && (
        <>
          <Box
            component="p"
            className="c-font-color c-font-16-22 c-fw-500"
            mb="10px"
          >
            <Trans id="fsKz2QAsysrFySjVpy9Lzg-quest">
              Your current prize pool
            </Trans>
          </Box>

          <Box className="rewards">
            {currentPrizePool &&
              currentPrizePool.rewards.map(item => (
                <Box key={item.id} className="rewardItem">
                  {item.amount}{" "}
                  {item.contract.type === ETokenType.Nft
                    ? item.amount > 1
                      ? t({
                          id: "1JskQWZGbGMT1WKG512D2R-quest",
                          message: "NFTs",
                        })
                      : t({
                          id: "ttn8nFufjCeH8bbTidwz7r-quest",
                          message: "NFT",
                        })
                    : item.contract.symbol}
                </Box>
              ))}
          </Box>

          <Box
            component="p"
            className="c-font-color c-font-14-16 c-fw-500"
            mb={2}
          >
            <Trans id="9owfPLEx4geZ743fgRcnzF-quest">
              To raise the reward to {nextPrizePoolRewards} you need to score{" "}
              {pintsToNextPrize}{" "}
              {pintsToNextPrize > 1
                ? t({ id: "x38No5RVYLqHFkexVU5g5R-quest", message: "points" })
                : t({ id: "1mD55mJgfEpfXZAsJdVtdq-quest", message: "point" })}
              .
            </Trans>
          </Box>

          <Box component="p" className="c-font-color c-font-14-16">
            <Trans id="sodYjJDwhLb9y7baezGcYd-quest">
              Continue completing tasks! Others still can overtake you.
            </Trans>
          </Box>
        </>
      )}
      {status === EScoreboardStatus.FIRST_PRIZE && (
        <>
          <Box
            component="p"
            className="c-font-color c-font-16-22 c-fw-500"
            mb="10px"
          >
            <Trans id="wQWW7AjDYzzwb2B7sBG5rY-quest">
              Your current prize pool
            </Trans>
          </Box>

          <Box className="rewards">
            {currentPrizePool &&
              currentPrizePool.rewards.map(item => (
                <Box key={item.id} className="rewardItem">
                  {item.amount}{" "}
                  {item.contract.type === ETokenType.Nft
                    ? item.amount > 1
                      ? t({
                          id: "11PseBqnGVgtBC1YavhSsB-quest",
                          message: "NFTs",
                        })
                      : t({
                          id: "tPhVn9uXXwMZhx9mAsycve-quest",
                          message: "NFT",
                        })
                    : item.contract.symbol}
                </Box>
              ))}
          </Box>

          <Box component="p" className="c-font-color c-font-14-16">
            <Trans id="uhCJGavfgY6tcbuw4djmFi-quest">
              Wait for the claimable period
            </Trans>
          </Box>
        </>
      )}
      {status === EScoreboardStatus.CLAIM && (
        <>
          <Box
            component="p"
            className="c-font-color c-font-16-22 c-fw-500"
            mb="10px"
          >
            <Trans id="2pELMVfiB4WTnF9F4yPSNg-quest">
              Your current prize pool
            </Trans>
          </Box>

          <Box className="rewards">
            {currentPrizePool &&
              currentPrizePool.rewards.map(item => (
                <Box key={item.id} className="rewardItem">
                  {item.amount}{" "}
                  {item.contract.type === ETokenType.Nft
                    ? item.amount > 1
                      ? t({
                          id: "bPZ4KqHQejQ5Dd7Ei1kApR-quest",
                          message: "NFTs",
                        })
                      : t({
                          id: "9yyKbgcLNnotDAeKahFgMm-quest",
                          message: "NFT",
                        })
                    : item.contract.symbol}
                </Box>
              ))}
          </Box>

          <Box
            component="p"
            className="c-font-color-3 c-font-14-16 c-fw-500"
            textTransform="uppercase"
          >
            <Trans id="naRZhnpjmHTWh2gGMCv3uX-quest">
              You can claim your reward!
            </Trans>
          </Box>
        </>
      )}
      {status === EScoreboardStatus.CLAIMED && (
        <>
          <Box
            component="p"
            className="c-font-color c-font-16-22 c-fw-500"
            mb="10px"
          >
            <Trans id="oEgpQdCQGUUjSfxMFWR7pb-quest">
              Your current prize pool
            </Trans>
          </Box>

          <Box className="rewards">
            {currentPrizePool &&
              currentPrizePool.rewards.map(item => (
                <Box key={item.id} className="rewardItem">
                  {item.amount}{" "}
                  {item.contract.type === ETokenType.Nft
                    ? item.amount > 1
                      ? t({
                          id: "jh4gbg5pY78QxH17WyuTqH-quest",
                          message: "NFTs",
                        })
                      : t({
                          id: "h6zqkUTiyiquu4HfQz1MjA-quest",
                          message: "NFT",
                        })
                    : item.contract.symbol}
                </Box>
              ))}
          </Box>

          <Box component="p" className="c-font-color c-font-14-16">
            <Trans id="3inE5JKVUGeVcCR4u11UPJ-quest">
              By clicking on the button below you can check the reward claiming
              status.
            </Trans>
          </Box>
        </>
      )}
      {status === EScoreboardStatus.NOT_WINNER && (
        <Trans id="to6QVUNMGGm9htLg2Jsg9x-quest">
          You didn&apos;t win a prize.
          <br />
          Try your luck in another quest!
        </Trans>
      )}
      {status === EScoreboardStatus.EXPIRED_CLAIM && (
        <Trans id="izeVMoXVUjAyj1zS5mTEvQ-quest">
          Claiming period has expired
        </Trans>
      )}
    </Wrapper>
  );
};

export default ScoreboardPrizeStatus;
