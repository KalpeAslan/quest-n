import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useContextSelector } from "use-context-selector";
import { Box } from "@mui/material";
import { DateTime } from "luxon";
import {
  ELoyaltyTasks,
  ILoyaltyProjectFullReward,
  ILoyaltyTask,
} from "@models";
import {
  ECreateQuestSteps,
  ILoyaltyProject,
  IQuestForPreview,
  LoyaltyProjectsScoreboard,
  StickyMenuInvestorInfo,
} from "@modules/quest/models";
import { AppContext } from "@context";
import { LoggerService } from "@services";
import { loyaltyService } from "@api";
import { useRouter } from "next/router";
import { Tasks } from "@modules/quest/components/tasks";
import { Header } from "@modules/quest/components/header";
import { Wrapper } from "./questComponent.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import {
  getAccountInfo,
  getAccountState,
} from "@modules/account/store/account.selector";
import { useGetUserProfileQuery } from "@modules/account/store/account.api";
import { PageLoader } from "@/components/pageLoader";
import { getDoneTasksCount } from "../../helpers/tasks";
import { StickyMenu } from "../stickyMenu";
import { ExpiredQuestPopup } from "@modules/quest/components/expiredQuestPopup/ExpiredQuestPopup";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { setFinishTourPopupOpen } from "@store/slices/system/system.slice";

interface Props {
  projectLinkTitle?: string;
  setProjectName?: Dispatch<SetStateAction<string>>;
  preview?: boolean;
  quest?: IQuestForPreview;
  maxWidth?: string;
  step?: ECreateQuestSteps;
  fullPreview?: boolean;
}

const QuestComponent: FC<Props> = ({
  projectLinkTitle,
  quest,
  preview,
  maxWidth,
  setProjectName,
  step,
  fullPreview,
}) => {
  const { pathname, push } = useRouter();

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );
  const accountInfo = useTypedSelector(getAccountInfo);
  const { isAccountLoaded } = useTypedSelector(getAccountState);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isScoresLoaded, setIsScoresLoaded] = useState<boolean>(!!quest);

  const [projectInvestorInfo, setProjectInvestorInfo] =
    useState<StickyMenuInvestorInfo>(null);
  const [scores, setScores] = useState<LoyaltyProjectsScoreboard[]>([]);
  const [projectData, setProjectData] = useState<ILoyaltyProject | null>(null);
  const [localTasksData, setLocalTasksData] = useState<ILoyaltyTask[]>([]);
  const [userPlace, setUserPlace] = useState<number | null>(null);
  const [localPoints, setLocalPoints] = useState<number>(0);
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const [scoreboardPage, setScoreboardPage] = useState(1);
  const [scoreboardHasMore, setScoreboardHasMore] = useState(true);
  const [isInitial, setIsInitial] = useState(true);
  const [tasksDone, setTasksDone] = useState(0);
  const [expiredQuestPopup, setExpiredQuestPopup] = useState<boolean>(false);

  const _ = useGetUserProfileQuery(null, {
    refetchOnMountOrArgChange: true,
    skip: !accountInfo.connected,
  });

  const [scoresMoreLoading, setSoresMoreLoading] = useState<boolean>(false);

  const projectSoonStatus = useMemo(() => {
    if (!projectData) {
      return false;
    }

    const now = DateTime.now().toMillis();
    const start = projectData.startAt
      ? DateTime.fromISO(`${projectData.startAt}`).toUTC().toMillis()
      : null;

    if (!start) {
      return true;
    }

    if (now < start) {
      return true;
    }

    return false;
  }, [projectData]);

  const projectExpiredStatus = useMemo(() => {
    if (!projectData) {
      return {
        status: false,
        date: "",
      };
    }

    const now = DateTime.now().toMillis();
    const end = projectData.endAt
      ? DateTime.fromISO(`${projectData.endAt}`).toUTC().toMillis()
      : null;

    if (end && now > end) {
      return {
        status: true,
        date: projectData.endAt,
      };
    }

    return {
      status: false,
      date: "",
    };
  }, [projectData]);
  const dispatch = useAppDispatch();

  const getProjectData = useCallback(async () => {
    if (!projectLinkTitle) {
      return;
    }

    try {
      const { data } = await loyaltyService.getLoyaltyProjectData(
        projectLinkTitle,
      );
      dispatch(setFinishTourPopupOpen(false));

      if (!data) {
        push("/404");
      }

      setProjectName && setProjectName(data.title);
      setProjectData(data);
      setTasksDone(getDoneTasksCount(data.loyaltyTasks));

      if (data.loyaltyTasks) {
        setLocalTasksData([...data.loyaltyTasks]);
      }
    } catch (error: any) {
      LoggerService.error("Failed during get project data", error);
    } finally {
      setIsLoaded(true);
      setIsScoresLoaded(true);
    }
  }, [dispatch, projectLinkTitle, push, setProjectName]);

  const getProjectInvestorInfo = useCallback(async () => {
    try {
      const { data } = await loyaltyService.getLoyaltyProjectInvestorInfo(
        projectLinkTitle,
      );

      if (data) {
        setLocalPoints(data.earnedPoints);
        setUserPlace(data.scoreboard.place);
        setProjectInvestorInfo(data);
      }
    } catch (error) {
      LoggerService.error("Failed during get project investor data", error);
    }
  }, [projectLinkTitle]);

  const getScores = async () => {
    if (!projectLinkTitle) {
      return;
    }

    try {
      setIsScoresLoaded(false);
      const { data: scoreboardData } =
        await loyaltyService.getLoyaltyScoreboard(projectLinkTitle, 1, 50);

      setScores([
        ...(scoreboardData?.scoreboard
          ? scoreboardData?.scoreboard.map(score => ({
              ...score,
              selected: accountInfo?.username
                ? accountInfo?.username === score.wallet
                : false,
            }))
          : []),
      ]);
      await getProjectData();
    } catch (error) {
      LoggerService.error("Failed during getScores", error);
    } finally {
      setIsScoresLoaded(true);
    }
  };

  const getScoresPaginate = useCallback(
    async (initial?: boolean) => {
      if (!projectLinkTitle || !scoreboardHasMore) {
        return;
      }

      if (!initial) {
        setSoresMoreLoading(true);
      }

      try {
        const { data: scoreboardData } =
          await loyaltyService.getLoyaltyScoreboard(
            projectLinkTitle,
            initial ? 1 : scoreboardPage,
            50,
          );
        setScoreboardHasMore(
          +scoreboardData.pageSize <= scoreboardData.scoreboard.length,
        );
        setScores(prev => {
          const newScores: LoyaltyProjectsScoreboard[] =
            scoreboardData.scoreboard.map(
              (score: LoyaltyProjectsScoreboard, i: number) => {
                if (!prev.length || initial) {
                  return {
                    ...score,
                    selected: accountInfo?.username
                      ? accountInfo?.username === score.wallet
                      : false,
                  };
                }

                const place = prev[prev.length - 1].place + (i + 1);

                return {
                  ...score,
                  selected: accountInfo?.username
                    ? accountInfo?.username === score.wallet
                    : false,
                  place,
                };
              },
            );

          return initial ? [...newScores] : [...prev, ...newScores];
        });
        setScoreboardPage(initial ? 2 : prevState => prevState + 1);
      } catch (error) {
        LoggerService.error("Failed during getScores", error);
      } finally {
        setSoresMoreLoading(false);
      }
    },
    [
      accountInfo?.username,
      projectLinkTitle,
      scoreboardHasMore,
      scoreboardPage,
    ],
  );

  useEffect(() => {
    if (isInitial) {
      getScoresPaginate(true);
      if (!quest) getProjectData();
      getProjectInvestorInfo();
      setIsInitial(false);
    }
  }, [
    accountInfo,
    isInitial,
    getProjectInvestorInfo,
    getProjectData,
    getScoresPaginate,
    projectLinkTitle,
    quest,
  ]);

  useEffect(() => {
    if (quest) {
      setProjectName && setProjectName(quest.title);
      setProjectData(quest);
      setIsLoaded(true);
      setLocalTasksData([...quest.loyaltyTasks]);
    }
  }, [quest]);

  useEffect(() => {
    return () => {
      if (prevLocation) {
        prevLocation.current = pathname;
      }
    };
  }, [projectData]);

  useEffect(() => {
    if (!isAccountLoaded && projectExpiredStatus.status) {
      setExpiredQuestPopup(true);
    }
  }, [projectExpiredStatus, isAccountLoaded]);

  const setClaimingTransactionHash = useCallback(
    (rewardId: number, txHash: string) => {
      setProjectInvestorInfo(prev => {
        const newClaimingTransactions = { ...prev.claimingTransactions };
        newClaimingTransactions[rewardId] = txHash;
        return { ...prev, claimingTransactions: newClaimingTransactions };
      });
    },
    [],
  );

  const computeShowStickyMenu = () => {
    if (fullPreview) return true;
    if (preview && step === ECreateQuestSteps.Rewards) return true;
    return !preview;
  };

  const computeHeightOfLivePreview = () => {
    if (!(preview && step === ECreateQuestSteps.Rewards && !fullPreview))
      return "auto";
    if (projectData.loyaltyTasks.length === 1) return "auto";
    return 700;
  };

  return (
    <>
      {!isLoaded ? (
        <PageLoader />
      ) : (
        <Wrapper
          maxWidth={maxWidth ? maxWidth : "100%"}
          sx={{ flexDirection: "column" }}
          mt={5}
          mb={5}
          preview={preview}
          fullPreview={fullPreview}
        >
          <>
            {projectData && (
              <>
                <Box className="header">
                  <Header
                    fullPreview={fullPreview}
                    isPreview={preview}
                    projectData={projectData}
                  />
                </Box>

                {computeShowStickyMenu() && (
                  <Box className="sticky" mb={{ xs: 3, md: 0 }}>
                    <StickyMenu
                      projectStatus={projectData.status}
                      projectType={projectData.projectType}
                      currentPrizePool={
                        projectInvestorInfo?.scoreboard?.currentPrizePool
                      }
                      nftOrder={projectInvestorInfo?.scoreboard?.nftOrder}
                      nextPrizePool={
                        projectInvestorInfo?.scoreboard?.nextPrizePool
                      }
                      totalParticipants={projectData?.participants}
                      eligibleParticipants={
                        projectInvestorInfo?.luckyDraw?.eligibleUsersCount
                      }
                      rewards={
                        (
                          projectData?.fullRewards as {
                            rewards: ILoyaltyProjectFullReward[];
                          }
                        )?.rewards ||
                        (projectData?.fullRewards as ILoyaltyProjectFullReward[]) ||
                        []
                      }
                      tasksDone={tasksDone}
                      totalTasks={projectData?.loyaltyTasks?.length || 0}
                      earnedPoints={projectInvestorInfo?.earnedPoints}
                      userPlace={
                        userPlace || projectInvestorInfo?.scoreboard?.place
                      }
                      threshold={projectData?.threshold}
                      endAt={projectData?.endAt}
                      isWinner={projectInvestorInfo?.luckyDraw?.isWinner}
                      claimingStartAt={projectData?.claimingStartAt}
                      claimingEndAt={projectData?.claimingEndAt}
                      scores={scores}
                      isScoresLoaded={isScoresLoaded}
                      isShowDetails={isShowDetails}
                      setIsShowDetails={setIsShowDetails}
                      handleNext={getScoresPaginate}
                      moreLoading={scoresMoreLoading}
                      eligibleUsersCount={projectData?.eligibleUsersCount}
                      rewardsTable={
                        projectInvestorInfo?.scoreboard?.rewardsTable || []
                      }
                      questLinkTitle={projectLinkTitle}
                      claimingTransactions={
                        projectInvestorInfo?.claimingTransactions
                      }
                      setClaimingTransactionHash={setClaimingTransactionHash}
                      isAqClaimed={Boolean(projectInvestorInfo?.isAqClaimed)}
                      isOnboarding={Boolean(
                        projectData.loyaltyTasks?.find(
                          item => item.type === ELoyaltyTasks.SIGN_UP,
                        ),
                      )}
                    />
                  </Box>
                )}

                <Box
                  className="tasks"
                  mt={
                    preview &&
                    step === ECreateQuestSteps.Rewards &&
                    !fullPreview &&
                    4
                  }
                  overflow={
                    preview &&
                    step === ECreateQuestSteps.Rewards &&
                    !fullPreview &&
                    "hidden"
                  }
                  sx={{
                    pointerEvents: "all",
                  }}
                >
                  <Tasks
                    projectData={projectData}
                    localTasksData={localTasksData}
                    localPoints={localPoints}
                    projectSoonStatus={projectSoonStatus}
                    projectExpiredStatus={projectExpiredStatus}
                    setLocalTasksData={setLocalTasksData}
                    setLocalPoints={setLocalPoints}
                    getScores={getScores}
                    setUserPlace={setUserPlace}
                    projectId={projectLinkTitle}
                    setProjectInvestorInfo={setProjectInvestorInfo}
                    preview={preview}
                    fullPreview={fullPreview}
                    step={step}
                    setTasksDoneCount={setTasksDone}
                  />
                </Box>
              </>
            )}
          </>
          <ExpiredQuestPopup
            onClose={() => setExpiredQuestPopup(false)}
            isOpen={expiredQuestPopup}
          />
        </Wrapper>
      )}
    </>
  );
};

export default QuestComponent;
