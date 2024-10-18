import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EProjectType,
  IPrizePool,
  LoyaltyProjectsLuckyDrawWinner,
  LoyaltyProjectsScoreboard,
  LoyaltyProjectStatuses,
  RewardTable,
} from "../../models";
import { Trop } from "./components/trop";
import { Wrapper } from "./stickyMenu.styles";
import { Box } from "@mui/material";
import {
  ETokenType,
  IFullRewardWithNft,
  ILoyaltyProjectFullReward,
  INft,
} from "@/models";
import { NftRewardContainer } from "./components/nftRewardContainer";
import { ParticipantsBlock } from "./components/participantsBlock";
import { TaskProgressBar } from "./components/taskProgressBar";
import { TokenRewardContainer } from "./components/tokenRewardContainer";
import { adminRewardService } from "@/api/services/admin/rewards";
import { LuckyDrawPrizeStatus } from "./components/luckyDrawPrizeStatus";
import { GuaranteedPrizeStatus } from "./components/guaranteedPrizeStatus";
import { ScoreboardPrizeStatus } from "./components/scoreboardPrizeStatus";
import { LuckyDrawWinnersBoard, Scoreboard } from "../scoreboard";
import { RewardsTable } from "./components/rewardsTable";
import { ClaimPopup } from "./components/claimPopup";
import { Button } from "@/components/UI/button";
import { CountDown } from "@/components/countDown";
import classNames from "classnames";
import { getClaimingStatus } from "../../helpers/claim";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { useClaimExperienceStarter } from "@/hooks";
import { ConnectWalletPopup } from "@/components/ConnectWalletPopup";
import { CSSTransition } from "react-transition-group";
import { Trans, t } from "@lingui/macro";
import { loyaltyService } from "@api";

interface Props {
  projectType: EProjectType;
  rewards: ILoyaltyProjectFullReward[];
  currentPrizePool: IPrizePool;
  nextPrizePool: IPrizePool;
  totalParticipants: number;
  eligibleParticipants?: number;
  eligibleUsersCount: number;
  tasksDone: number;
  totalTasks: number;
  earnedPoints: number;
  userPlace: number;
  threshold: number;
  endAt: string;
  isWinner: boolean;
  claimingStartAt: string;
  claimingEndAt: string;
  scores: LoyaltyProjectsScoreboard[];
  isScoresLoaded: boolean;
  isShowDetails: boolean;
  setIsShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
  isInfoPopup?: boolean;
  handleNext: () => any;
  moreLoading?: boolean;
  rewardsTable: RewardTable[];
  nftOrder: Record<string, number>;
  questLinkTitle: string;
  claimingTransactions: Record<number, string>;
  setClaimingTransactionHash: (rewardId: number, txHash: string) => void;
  isAqClaimed: boolean;
  isOnboarding: boolean;
  projectStatus: LoyaltyProjectStatuses;
}

const StickyMenu: FC<Props> = ({
  projectType,
  rewards,
  currentPrizePool,
  nextPrizePool,
  totalParticipants,
  eligibleParticipants,
  tasksDone,
  totalTasks,
  earnedPoints,
  userPlace,
  threshold,
  endAt,
  isWinner,
  claimingStartAt,
  claimingEndAt,
  scores,
  isScoresLoaded,
  isShowDetails,
  setIsShowDetails,
  handleNext,
  moreLoading,
  eligibleUsersCount,
  rewardsTable,
  nftOrder,
  questLinkTitle,
  claimingTransactions,
  setClaimingTransactionHash,
  isAqClaimed,
  isOnboarding,
  projectStatus,
}) => {
  const [groupedRewards, setGroupedRewards] = useState<IFullRewardWithNft[]>(
    [],
  );
  const [scoreboardOpen, setScoreboardOpen] = useState<boolean>(false);
  const [claimPopupOpen, setClaimPopupOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [claimStatuses, setClaimStatuses] = useState<Record<number, boolean>>(
    {},
  );

  const { investorId } = useTypedSelector(getAccountInfo);

  const isProjectPeriodExpired = useMemo(() => {
    return new Date(endAt).getTime() <= new Date().getTime();
  }, [endAt]);

  const [winners, setWinners] = useState<LoyaltyProjectsLuckyDrawWinner[]>([]);

  const {
    isClaimed: isStarterClaimed,
    claim: claimStarter,
    isWalletPopupOpen,
    needConnect,
    getNeedSwitchChain,
    chainToConnect,
    setIsWalletPopupOpen,
    loading: claimStarterLoading,
    isConnectLoading,
    isNetworkLoading,
  } = useClaimExperienceStarter();

  const verifiedRewards = useMemo(
    () => rewards.filter(item => item.verified),
    [rewards],
  );

  const rewardsToClaim = useMemo(
    () =>
      projectType === EProjectType.Scoreboard
        ? currentPrizePool?.rewards || []
        : verifiedRewards,
    [currentPrizePool?.rewards, projectType, verifiedRewards],
  );

  const getGroupedRewards = useCallback(async () => {
    const result: IFullRewardWithNft[] = [];

    for (const item of verifiedRewards) {
      if (item.contract.type === ETokenType.Nft) {
        let nftMetadata: INft | null = null;

        try {
          const { data } = await adminRewardService.getNftMetadata(
            item.contract.id,
            item.tokenIds[0],
          );

          nftMetadata = data;
        } catch {
          console.log("Error getting nft metadata");
        }

        const existedIndex = result.findIndex(
          existedItem =>
            existedItem.contractId === item.contractId &&
            existedItem.nftMetadata?.image === nftMetadata.image,
        );

        if (existedIndex === -1) {
          const nftItemOrder =
            nftOrder?.[`${item.contract.id} ${nftMetadata?.image}`];
          result.push({
            ...item,
            description: nftItemOrder ? `#${nftItemOrder}` : "",
            amount:
              projectType === EProjectType.Scoreboard
                ? item.amount * (item.endPlace - item.startPlace + 1)
                : item.amount,
            nftMetadata,
          });
        } else {
          result[existedIndex].amount +=
            projectType === EProjectType.Scoreboard
              ? item.amount * (item.endPlace - item.startPlace + 1)
              : item.amount;
        }
      } else {
        const existedIndex = result.findIndex(
          existedItem => existedItem.contractId === item.contractId,
        );

        if (existedIndex === -1) {
          result.push({
            ...item,
            amount:
              projectType === EProjectType.Scoreboard
                ? item.amount * (item.endPlace - item.startPlace + 1)
                : item.amount,
          });
        } else {
          result[existedIndex].amount +=
            projectType === EProjectType.Scoreboard
              ? item.amount * (item.endPlace - item.startPlace + 1)
              : item.amount;
        }
      }
    }

    setGroupedRewards(result);
  }, [nftOrder, projectType, verifiedRewards]);


  useEffect(() => {
    getGroupedRewards();
  }, [getGroupedRewards]);

  useEffect(() => {
    const interval = setInterval(() => setCounter(prev => prev + 1), 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (projectType === EProjectType.LuckyDraw && isProjectPeriodExpired) {
      loyaltyService.getLoyaltyProjectWinners(questLinkTitle).then(res => {
        setWinners(res.data);
      });
    }
  }, []);

  const getRewardsStatuses = useCallback(async () => {
    if (!investorId) return;

    const result: Record<number, boolean> = {};

    for (const reward of rewardsToClaim) {
      if (reward.contract.type === ETokenType.Aq) {
        result[reward.id] = isAqClaimed;
        continue;
      }

      result[reward.id] = await getClaimingStatus(
        reward.loyaltyProjectId,
        reward.id,
        Number(investorId),
        reward.contract.chainId,
      );
    }

    setClaimStatuses(result);
  }, [investorId, isAqClaimed, rewardsToClaim]);

  useEffect(() => {
    getRewardsStatuses();
  }, [getRewardsStatuses]);

  const availableToClaim = useMemo(() => {
    if (projectType === EProjectType.Scoreboard) {
      return !!currentPrizePool?.rewards?.length;
    }
    const hasRewards = !!verifiedRewards.length;
    if (projectType === EProjectType.LuckyDraw) {
      return isWinner && hasRewards;
    }
    if (projectType === EProjectType.Guaranteed) {
      return earnedPoints >= threshold && hasRewards;
    }
    return false;
  }, [
    currentPrizePool?.rewards?.length,
    earnedPoints,
    isWinner,
    projectType,
    threshold,
    verifiedRewards.length,
  ]);

  const isClaimPeriodExpired = useMemo(
    () =>
      claimingEndAt &&
      new Date(claimingEndAt).getTime() <= new Date().getTime(),
    [claimingEndAt],
  );

  const isClaimPeriod = useMemo(
    () =>
      new Date(claimingStartAt || endAt).getTime() <= new Date().getTime() &&
      !isClaimPeriodExpired &&
      availableToClaim,
    [claimingStartAt, isClaimPeriodExpired, endAt, availableToClaim, counter],
  );

  const isClaimDisabled = useMemo(
    () =>
      !availableToClaim || !isClaimPeriod || (isOnboarding && isStarterClaimed),
    [availableToClaim, isClaimPeriod, isStarterClaimed, isOnboarding],
  );

  const claimedRewardsCount = useMemo(
    () =>
      Object.values(claimStatuses).reduce((acc, item) => {
        if (item) return acc + 1;
        return acc;
      }, 0),
    [claimStatuses],
  );

  const buttonContent = useMemo(() => {
    if (isClaimPeriodExpired) {
      return <>Claim Reward</>;
    }

    if (!isClaimPeriod && availableToClaim) {
      return (
        <Trans id="sx1V2DW15B18ChwHbtjtZw-quest">
          Claim in{" "}
          <CountDown
            date={new Date(claimingStartAt || endAt).getTime()}
            color="#87F696"
          />
        </Trans>
      );
    }

    if (claimedRewardsCount < rewardsToClaim.length && claimedRewardsCount) {
      return (
        <Trans id="jV3EoJYzgxRT79nmZA2yeK-quest">
          Claimed Rewards {claimedRewardsCount}/{rewardsToClaim.length}
        </Trans>
      );
    }

    if (claimedRewardsCount >= rewardsToClaim.length && claimedRewardsCount) {
      return (
        <Trans id="wnaJLCBBSSRDtPFrTXop3V-quest">Check Claim Status</Trans>
      );
    }

    return <>Claim Reward</>;
  }, [
    availableToClaim,
    claimedRewardsCount,
    claimingStartAt,
    endAt,
    isClaimPeriod,
    isClaimPeriodExpired,
    rewardsToClaim.length,
  ]);

  const setClaimStatus = useCallback(
    (rewardId: number, value: boolean) =>
      setClaimStatuses(prev => ({ ...prev, [rewardId]: value })),
    [],
  );

  const onClaimClick = useCallback(() => {
    if (!isOnboarding) {
      setClaimPopupOpen(true);
      return;
    }
    claimStarter();
  }, [claimStarter, isOnboarding]);

  const computeToShowScoreboard = () => {
    if (projectType === EProjectType.LuckyDraw) {
      return !!winners.length;
    }
    return scores;
  };

  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Wrapper>
        <Trop projectType={projectType} />

        <Box className="mainBlock">
          {projectType === EProjectType.LuckyDraw && (
            <Box className="winnersCount c-font-color-3 c-font-18-20 c-fw-500">
              <Trans id="ef2hQTjDot7yzhv472iDFL-quest">
                {eligibleUsersCount} winners
              </Trans>
            </Box>
          )}

          {projectType === EProjectType.Scoreboard &&
            Boolean(earnedPoints) &&
            Boolean(userPlace) && (
              <Box
                className="c-font-color c-font-20-20 c-fw-500"
                margin="0 auto 24px auto"
                width="fit-content"
              >
                <Trans id="w6ib1j69RCvkuPe5ph15S8-quest">
                  {userPlace} place |{" "}
                  {earnedPoints
                    ? Number(earnedPoints).toFixed(2)
                    : earnedPoints}{" "}
                  points
                </Trans>
              </Box>
            )}

          <Box
            className="c-font-color c-font-16-20 c-fw-500"
            mb="20px"
            ml="auto"
            mr="auto"
            width="fit-content"
          >
            {projectType === EProjectType.Scoreboard && (
              <Trans id="re4cfwHQq9iyxDW6ZT99wW-quest">Quest prize-pool</Trans>
            )}
            {projectType === EProjectType.LuckyDraw && (
              <Trans id="fUhtsFysxojbUn4UcPH3tn-quest">
                Lucky Draw Prize
                <br />
                for each winner
              </Trans>
            )}

            {projectType === EProjectType.Guaranteed && (
              <Trans id="6Kmxu4ruJzSPyUhSMcUJj3-quest">
                Your Guaranteed Reward
              </Trans>
            )}
          </Box>

          <Box>
            {groupedRewards.length === 1 &&
            groupedRewards[0].contract.type === ETokenType.Nft &&
            groupedRewards[0].nftMetadata?.image &&
            projectType !== EProjectType.Scoreboard ? (
              <NftRewardContainer reward={groupedRewards[0]} />
            ) : (
              groupedRewards.map(item => (
                <TokenRewardContainer
                  key={item.id}
                  reward={item}
                  className="tokenRewardContainer"
                />
              ))
            )}
          </Box>

          <TaskProgressBar
            tasksDone={tasksDone}
            totalTasks={totalTasks}
            className="taskProgressBar"
          />

          {projectType === EProjectType.LuckyDraw && (
            <LuckyDrawPrizeStatus
              tasksDone={tasksDone}
              earnedPoints={earnedPoints}
              threshold={threshold}
              endAt={endAt}
              isWinner={isWinner}
              className="statusText"
              isClaimPeriodExpired={isClaimPeriodExpired}
              availableToClaim={availableToClaim}
            />
          )}

          {projectType === EProjectType.Guaranteed && (
            <GuaranteedPrizeStatus
              earnedPoints={earnedPoints}
              threshold={threshold}
              endAt={endAt}
              className="statusText"
              isClaimPeriodExpired={isClaimPeriodExpired}
              availableToClaim={availableToClaim}
            />
          )}

          {projectType !== EProjectType.Scoreboard && (
            <Button
              style="primary"
              disabled={isClaimDisabled}
              loading={
                claimStarterLoading || isNetworkLoading || isConnectLoading
              }
              onClick={onClaimClick}
              className={classNames("claimButton", {
                countDownColor: !isClaimPeriod && availableToClaim,
              })}
            >
              {buttonContent}
            </Button>
          )}

          {projectType === EProjectType.Scoreboard && (
            <>
              <ScoreboardPrizeStatus
                currentPrizePool={currentPrizePool}
                nextPrizePool={nextPrizePool}
                tasksDone={tasksDone}
                claimingStartAt={claimingStartAt}
                claimingEndAt={claimingEndAt}
                isClaimed={claimedRewardsCount > 0}
                endAt={endAt}
                className="statusText"
                isClaimPeriodExpired={isClaimPeriodExpired}
                availableToClaim={availableToClaim}
              />

              <Button
                style="primary"
                disabled={isClaimDisabled}
                onClick={onClaimClick}
                loading={
                  claimStarterLoading || isNetworkLoading || isConnectLoading
                }
                className={classNames("claimButton", {
                  countDownColor:
                    !isClaimPeriod && availableToClaim && !isClaimPeriodExpired,
                })}
              >
                {buttonContent}
              </Button>

              <RewardsTable
                rewardsTable={rewardsTable}
                className="statusText"
              />
            </>
          )}
        </Box>

        {projectType !== EProjectType.Guaranteed && (
          <ParticipantsBlock
            projectType={projectType}
            totalParticipants={totalParticipants}
            setScoreboardOpen={setScoreboardOpen}
            scoreboardOpen={scoreboardOpen}
            eligibleParticipants={eligibleParticipants}
            projectStatus={projectStatus}
          />
        )}

        {computeToShowScoreboard() && (
          <CSSTransition
            in={scoreboardOpen}
            timeout={500}
            nodeRef={nodeRef as null}
            classNames={"scoreboard-animation"}
            unmountOnExit
          >
            <>
              {projectType === EProjectType.Scoreboard && (
                <Scoreboard
                  className="scoreboard"
                  scores={scores}
                  isScoresLoaded={isScoresLoaded}
                  isShowDetails={isShowDetails}
                  setIsShowDetails={setIsShowDetails}
                  handleNext={handleNext}
                  moreLoading={moreLoading}
                  hideShowMore
                />
              )}
              {projectType === EProjectType.LuckyDraw && (
                <div ref={nodeRef}>
                  <LuckyDrawWinnersBoard
                    className="scoreboard"
                    scores={winners}
                    isScoresLoaded={isScoresLoaded}
                    isShowDetails={isShowDetails}
                    setIsShowDetails={setIsShowDetails}
                    handleNext={handleNext}
                    moreLoading={moreLoading}
                    hideShowMore
                  />
                </div>
              )}
            </>
          </CSSTransition>
        )}

        {!isClaimDisabled && (
          <ClaimPopup
            rewards={rewardsToClaim}
            isOpen={claimPopupOpen}
            setIsOpen={setClaimPopupOpen}
            questLinkTitle={questLinkTitle}
            claimingTransactions={claimingTransactions}
            setClaimingTransactionHash={setClaimingTransactionHash}
            claimStatuses={claimStatuses}
            setClaimStatus={setClaimStatus}
          />
        )}
      </Wrapper>

      <ConnectWalletPopup
        isOpen={
          isWalletPopupOpen &&
          (needConnect || getNeedSwitchChain(chainToConnect))
        }
        handleClose={() => setIsWalletPopupOpen(false)}
        chainToConnect={chainToConnect}
        needConnect={needConnect}
        needSwitchChain={getNeedSwitchChain(chainToConnect)}
        actionName={t({
          id: "wqKJuKpH7ZLaSr6JAwWJfA-quest",
          message: "claim reward",
        })}
      />
    </>
  );
};

export default StickyMenu;
