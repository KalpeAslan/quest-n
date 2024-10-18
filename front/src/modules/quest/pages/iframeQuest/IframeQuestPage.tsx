import Head from "next/head";
import { Wrapper } from "@modules/quest/pages/iframeQuest/iframeQuest.styles";
import { Loader } from "@components/UI/loader";
import { InfoPopup } from "@/modules/quest/components/infoPopup";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";
import Image from "next/image";
import { appConfig } from "@/app.config";
import {
  ILoyaltyProject,
  LoyaltyProjectsScoreboard,
  LoyaltyProjectStatuses,
  RewardToken,
  StickyMenuInvestorInfo,
} from "@modules/quest/models";
import { QuestLabelItem } from "@components/questLabelItem";
import { setIsAuthPopupOpen } from "@modules/account/store/account.slice";
import { HelperService, LoggerService } from "@services";
import { CountDown } from "@components/countDown";
import { IframeTaskItem } from "@modules/quest/components/iframeTaskItem";
import { useRouter } from "next/router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ETaskStatus,
  ILoyaltyTask,
  ITaskMainTrackingData,
  ITaskTrackingData,
} from "@models";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { useAppDispatch } from "@hooks/useAppDispatch";
import { getAccountInfo } from "@modules/account/store/account.selector";
import { loyaltyService } from "@api";
import { DateTime } from "luxon";
import { sendAnalyticsDataThunk } from "@store/slices/analytics/analytics.thunks";
import Icon from "@components/UI/icon/Icon";
import { Button } from "@/components/UI/button";
import { Tooltip } from "@/components/UI/tooltip";
import { useDebouncedEffect } from "@/hooks";
import ReCAPTCHA from "react-google-recaptcha";

const IframeQuestPage = () => {
  const recaptchaRef = useRef<ReCAPTCHA>();

  const { query, push } = useRouter();

  const [projectData, setProjectData] = useState<ILoyaltyProject | null>(null);
  const [localTasksData, setLocalTasksData] = useState<ILoyaltyTask[]>([]);
  const [userPlace, setUserPlace] = useState<number | null>(null);
  const [localPoints, setLocalPoints] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [infoPopupOpen, setInfoPopupOpen] = useState<
    "prizePool" | "scoreboard" | null
  >(null);
  const [scoreboardPage, setScoreboardPage] = useState(1);
  const [scoreboardHasMore, setScoreboardHasMore] = useState(true);
  const [scores, setScores] = useState<LoyaltyProjectsScoreboard[]>([]);
  const [isScoresLoaded, setIsScoresLoaded] = useState<boolean>(false);
  const [isShowDetails, setIsShowDetails] = useState<boolean>(false);
  const [projectInvestorInfo, setProjectInvestorInfo] =
    useState<StickyMenuInvestorInfo>(null);

  const { id } = query as { id: string };

  const dispatch = useAppDispatch();

  const accountInfo = useTypedSelector(getAccountInfo);

  const getProjectData = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const { data } = await loyaltyService.getLoyaltyProjectData(id);

      if (!data) {
        push("/404");
      }

      setProjectData(data);

      if (data.loyaltyTasks) {
        if (localTasksData.length) {
          setLocalTasksData([...localTasksData, ...data.loyaltyTasks]);
        }
        setLocalTasksData(data.loyaltyTasks);
      }
    } catch (error: any) {
      LoggerService.error("Failed during get project data", error);
    } finally {
      setIsLoaded(true);
      setIsScoresLoaded(true);
    }
  }, [id, push]);

  const getProjectInvestorInfo = useCallback(async () => {
    try {
      const { data } = await loyaltyService.getLoyaltyProjectInvestorInfo(id);

      if (data) {
        setLocalPoints(data.earnedPoints);
        setUserPlace(data.scoreboard.place);
        setProjectInvestorInfo(data);
      }
    } catch (error) {
      LoggerService.error("Failed during get project investor data", error);
    }
  }, [id]);

  const getScores = async () => {
    if (!id) {
      return;
    }

    try {
      setIsScoresLoaded(false);
      const { data: scoreboardData } =
        await loyaltyService.getLoyaltyScoreboard(id, 1, 50);

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
      if (!id || !scoreboardHasMore) {
        return;
      }

      try {
        const { data: scoreboardData } =
          await loyaltyService.getLoyaltyScoreboard(
            id,
            initial ? 1 : scoreboardPage,
            50,
          );
        setScoreboardHasMore(
          +scoreboardData.pageSize <= scoreboardData.scoreboard.length,
        );
        const newScores: LoyaltyProjectsScoreboard[] =
          scoreboardData.scoreboard.map(
            (score: LoyaltyProjectsScoreboard, i: number) => {
              if (!scores.length) {
                return {
                  ...score,
                  selected: accountInfo?.username
                    ? accountInfo?.username === score.wallet
                    : false,
                };
              }

              const place = scores[scores.length - 1].place + (i + 1);

              return {
                ...score,
                selected: accountInfo?.username
                  ? accountInfo?.username === score.wallet
                  : false,
                place,
              };
            },
          );
        setScores([...scores, ...newScores]);
        setScoreboardPage(initial ? 2 : prevState => prevState + 1);
      } catch (error) {
        LoggerService.error("Failed during getScores", error);
      }
    },
    [accountInfo?.username, id, scoreboardHasMore, scoreboardPage, scores],
  );

  useDebouncedEffect(
    () => {
      getScoresPaginate(true);
      getProjectData();
      getProjectInvestorInfo();
    },
    { ignoreInitialCall: true, timeout: 50 },
    [accountInfo],
  );

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

  const trackTaskDone =
    ({
      taskName,
      taskPoints,
      taskId,
      taskPosition,
      taskType,
      taskData,
    }: ITaskMainTrackingData) =>
    async ({ questPointsSum, subTaskId }: ITaskTrackingData) => {
      const tasksDone = localTasksData.reduce((acc, item) => {
        if (item.status === ETaskStatus.DONE) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const tasksRemaining = localTasksData.reduce((acc, item) => {
        if (
          item.status === ETaskStatus.DONE ||
          item.status === ETaskStatus.EXPIRED
        ) {
          return acc;
        }
        return acc + 1;
      }, 0);

      const { data } = await loyaltyService.getLoyaltyProjectData(
        projectData.linkTitle,
      );
      const { data: projectInvestorInfo } =
        await loyaltyService.getLoyaltyProjectInvestorInfo(
          projectData.linkTitle,
        );

      if (projectInvestorInfo) {
        setProjectInvestorInfo(projectInvestorInfo);
        setLocalPoints(projectInvestorInfo.earnedPoints);
        setUserPlace(projectInvestorInfo.scoreboard.place);
      }
      if (taskType === "daily") {
        const selectedTask = data.loyaltyTasks.find(
          loyaltyTask => loyaltyTask.id === taskData.id,
        ) as ILoyaltyTask;
        const selectedSubTask = selectedTask.body.subTasks.find(
          subTask => subTask.id === subTaskId,
        );
        const event_property_daily_tasks_done =
          selectedTask.body.subTasks.filter(
            subTask => subTask.status === "confirmed",
          ).length;
        const event_property_daily_tasks_remaining =
          selectedTask.body.subTasks.filter(
            subTask => subTask.status === "active",
          ).length;

        dispatch(
          sendAnalyticsDataThunk({
            type: "daily_task_done",
            options: {
              event_property_task_name: taskName,
              event_property_task_points: selectedSubTask.points,
              event_property_quest_points_sum: projectInvestorInfo.earnedPoints,
              event_property_task_id: taskId,
              event_property_task_position: taskPosition,
              event_property_task_type: taskType,
              event_property_tasks_done: tasksDone,
              event_property_tasks_remainig: tasksRemaining,
              event_property_quest_name: projectData.title,
              event_property_leaderboard_position:
                projectInvestorInfo.scoreboard.place,
              event_property_daily_task_number: subTaskId,
              event_property_daily_tasks_done,
              event_property_daily_tasks_remaining,
            },
            shouldRefetch: true,
          }),
        );
      } else {
        dispatch(
          sendAnalyticsDataThunk({
            type: "quest_task_done",
            options: {
              event_property_task_name: taskName,
              event_property_task_points: taskPoints,
              event_property_quest_points_sum: questPointsSum,
              event_property_task_id: taskId,
              event_property_task_position: taskPosition,
              event_property_task_type: taskType,
              event_property_tasks_done: tasksDone,
              event_property_tasks_remainig: tasksRemaining,
              event_property_quest_name: projectData.title,
              event_property_leaderboard_position:
                projectInvestorInfo.scoreboard.place,
            },
            shouldRefetch: true,
          }),
        );
      }
    };

  const handleScrollTop = () => {
    const projectHeader = document.getElementById("projectHeader");
    if (!projectHeader) return;

    projectHeader.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="background-other">
      <Head>
        <title>AlphaQuest ${projectData && projectData.title}</title>
        <link rel="canonical" href={`iframe/${id}`} />
      </Head>

      <Wrapper>
        {!isLoaded ? (
          <Loader width={"100%"} />
        ) : (
          <>
            {projectData && (
              <>
                {((projectInvestorInfo &&
                  projectInvestorInfo?.scoreboard?.rewardsTable &&
                  projectInvestorInfo?.scoreboard?.rewardsTable?.length > 0) ||
                  infoPopupOpen === "scoreboard") && (
                  <InfoPopup
                    isOpen={infoPopupOpen}
                    setIsOpen={setInfoPopupOpen}
                    rewardsTable={projectInvestorInfo.scoreboard.rewardsTable}
                    projectType={projectData.projectType}
                    scores={scores}
                    isScoresLoaded={isScoresLoaded}
                    setIsShowDetails={setIsShowDetails}
                    getScoresPaginate={getScoresPaginate}
                    isShowDetails={isShowDetails}
                  />
                )}

                <Box
                  className="c-font-32-38 c-fw-500 c-font-color"
                  id="projectHeader"
                >
                  {projectData.title}
                </Box>
                <Box
                  className="c-font-14-20"
                  color="rgba(250, 250, 250, 0.5)"
                  mb={2}
                >
                  <Trans id="57C4v3P4hommGS71KuP1dQ-quest">
                    Total participants {projectData.participants || 0}
                  </Trans>
                </Box>

                <Box
                  position="relative"
                  height="260px"
                  width="100%"
                  borderRadius="8px"
                  overflow="hidden"
                  mb={2}
                >
                  <Image
                    src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${projectData.preview_img}`}
                    alt="image"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </Box>

                <Box
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    if (
                      projectInvestorInfo &&
                      projectInvestorInfo.scoreboard.rewardsTable &&
                      projectInvestorInfo.scoreboard.rewardsTable.length > 0
                    )
                      setInfoPopupOpen("prizePool");
                  }}
                >
                  <Box
                    component="p"
                    className="c-font-16-22 c-fw-500 c-font-color"
                    textAlign="center"
                    mb={1.25}
                  >
                    <Trans id="dzJ3ULZQ3G2iY6ALArRaTi-quest">
                      Total campaign prize pool
                    </Trans>
                  </Box>

                  <Box gap={1} display="flex" mb={2}>
                    {projectData.rewards.tokens.length > 0 &&
                      projectData.rewards.tokens.map(
                        (rewardItem: RewardToken, ri) => (
                          <QuestLabelItem
                            key={ri}
                            status={projectData.status}
                            title={rewardItem.amount}
                            subTitle={rewardItem.symbol}
                            image={rewardItem.logo}
                          />
                        ),
                      )}

                    {projectData.rewards.whitelisting && (
                      <QuestLabelItem
                        title={"WL"}
                        status={projectData.status}
                      />
                    )}
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={2}>
                  <Box
                    bgcolor="rgba(245, 212, 122, 0.1)"
                    borderRadius="8px"
                    className="c-full-width c-font-14-28"
                    maxWidth="calc((100% - 12px) / 2)"
                    p="12px 0"
                    color="#F5D47A"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    onClick={() => {
                      if (accountInfo?.connected) {
                        return;
                      }
                      dispatch(setIsAuthPopupOpen(true));
                    }}
                  >
                    {accountInfo?.connected ? (
                      <>
                        {Boolean(userPlace) && (
                          <Box textAlign="center">Place {userPlace}</Box>
                        )}
                        <Box textAlign="center">
                          <Trans id="oKPfW4cg6TdKw3EyW7vCkb-quest">
                            {HelperService.addNumberSeparator(localPoints || 0)}{" "}
                            points
                          </Trans>
                        </Box>
                      </>
                    ) : (
                      <Box textAlign="center" maxWidth="158px" m="0 auto">
                        <Trans id="37kybMPdLV5EnH4U2M1rQJ-quest">
                          Login or Create Account to Start
                        </Trans>
                      </Box>
                    )}
                  </Box>

                  <Box
                    bgcolor="rgba(135, 246, 150, 0.1)"
                    borderRadius="8px"
                    p="12px 0"
                    className="c-full-width c-font-14-28"
                    maxWidth="calc((100% - 12px) / 2)"
                    color="#87F696"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    {projectData.status === LoyaltyProjectStatuses.Soon && (
                      <Box textAlign="center">
                        <Trans id="9GNbvbrgimkVyTamhPqZb4-quest">SOON</Trans>
                      </Box>
                    )}
                    {projectData.status === LoyaltyProjectStatuses.Expired && (
                      <Box textAlign="center">
                        <Trans id="manDtVMCdmACJQ1FXbq6rJ-quest">
                          Quest completed
                        </Trans>
                      </Box>
                    )}
                    {![
                      LoyaltyProjectStatuses.Expired,
                      LoyaltyProjectStatuses.Soon,
                    ].includes(projectData.status) && (
                      <>
                        <CountDown
                          date={projectData.endAt}
                          color="#87F696"
                          className="countdown"
                        />
                        <Box textAlign="center">
                          <Trans id="6agg3aw5kWDy4f3dq31LWr-quest">
                            Time Left
                          </Trans>
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>

                <Box className="c-full-width" m="0 auto" mb={2}>
                  <Button
                    style="secondary"
                    className="c-fw-500 c-font-16-22 c-full-width"
                    onClick={() => setInfoPopupOpen("scoreboard")}
                    disableTouchStart
                  >
                    <Trans id="c7JQnsr9JcV29gFvFXhk66-quest">
                      View Scoreboard
                    </Trans>
                  </Button>
                </Box>

                <Box
                  display="flex"
                  alignItems="center"
                  className="c-fw-500 c-font-16-22 c-font-color"
                  width="fit-content"
                  m="0 auto"
                  mb={2}
                >
                  <Trans id="5y4p1v2JLvtH5wNvvvAq5V-quest">
                    More about points
                  </Trans>
                  <Tooltip
                    value={t({
                      id: "iousA9nEfRh9K8EdJbV1B2-quest",
                      message: "Tooltip message on iframe 'More about points'",
                    })}
                  >
                    <Box
                      ml="6px"
                      className="c-fw-500 c-font-10-20"
                      width="14px"
                      height="14px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="50%"
                      bgcolor="rgba(255, 255, 255, 0.15)"
                    >
                      ?
                    </Box>
                  </Tooltip>
                </Box>

                <Box bgcolor="rgba(0, 0, 0, 0.22)" borderRadius="8px">
                  {localTasksData.map((item, index) => {
                    const trackIsDone = trackTaskDone({
                      taskName: item.title,
                      taskPoints: item.points,
                      taskType: item.type,
                      taskId: item.id,
                      taskPosition: index,
                      taskData: item,
                    });

                    return (
                      <IframeTaskItem
                        key={item.id}
                        task={item}
                        projectSoonStatus={projectSoonStatus}
                        projectExpiredStatus={projectExpiredStatus}
                        setLocalTasksData={setLocalTasksData}
                        setLocalPoints={setLocalPoints}
                        localTasksData={localTasksData}
                        trackIsDone={trackIsDone}
                        getProjectData={getScores}
                        localPoints={localPoints}
                      />
                    );
                  })}
                </Box>
                <Box
                  className="collapseIconWrapper c-font-color"
                  onClick={handleScrollTop}
                >
                  <Icon
                    name={"chevron-bottom"}
                    width={24}
                    height={24}
                    size={"24"}
                    className="collapseIcon"
                  />
                </Box>
              </>
            )}
          </>
        )}

        {appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC && (
          <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey={appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC}
          />
        )}
      </Wrapper>
    </div>
  );
};

export default IframeQuestPage;
