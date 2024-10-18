import {
  ELinks,
  ELoyaltyTasks,
  ETaskStatus,
  ILoyaltyTask,
  ITaskTrackingData,
} from "@/models";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ErrorBlock,
  ProgressBarStylesScore,
  ProgressBarStylesWrapper,
  RequiredBlock,
  Wrapper,
  ExpBlock,
} from "./task.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountState } from "@/modules/account/store/account.selector";
import { t, Trans } from "@lingui/macro";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Icon } from "../UI/icon";
import { HelperService } from "@/services";
import { CountDown } from "../countDown";
import classNames from "classnames";
import { Tooltip } from "../UI/tooltip";
import useContent from "./hooks/useContent";
import useForms from "./hooks/useForms";
import useProgress from "./hooks/useProgress";
import useConfirmFlow from "./hooks/useConfirmFlow";
import useStatus from "./hooks/useStatus";
import useHandler from "./hooks/useHandler";
import useIsUnlimited from "./hooks/useIsUnlimited";
import { ChainLabel } from "@components/task/chainLabel";
import { CBreakpoints } from "@styles/variables";
import Button from "@components/UI/button/Button";
import { getCurrentItemIndex } from "@components/task/task.utils";
import useIconName from "./hooks/useIconName";
import { loyaltyService } from "@api";
import { nextTick } from "@/utils";
import { useDebouncedEffect } from "@/hooks";
import { getIsOnboardingPopupOpen } from "@/store/slices/system/system.selector";
import { MarkdownAndHTML } from "../MarkdownAndHTML/MarkdownAndHTML";
import { appConfig } from "@/app.config";
import { CSSTransition } from "react-transition-group";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

type Props = {
  task: ILoyaltyTask;
  localTasksData: ILoyaltyTask[];
  localPoints: number;
  projectSoonStatus: boolean;
  projectExpiredStatus: any;
  setLocalTasksData: React.Dispatch<React.SetStateAction<ILoyaltyTask[]>>;
  setLocalPoints: React.Dispatch<React.SetStateAction<number>>;
  trackIsDone: (data: ITaskTrackingData) => void;
  getScores: () => Promise<void>;
  openedErrorBlock: number | null;
  setOpenedErrorBlock: React.Dispatch<React.SetStateAction<null | number>>;
  hasRequired?: boolean;
  shouldResetLoading: boolean;
  setShouldResetLoading: Dispatch<SetStateAction<boolean>>;
  preview: boolean;
  fullPreview?: boolean;
  questName: string;
};

const Task: FC<Props> = ({
  task,
  projectSoonStatus,
  projectExpiredStatus,
  setLocalTasksData,
  localTasksData,
  setLocalPoints,
  localPoints,
  trackIsDone,
  getScores,
  openedErrorBlock,
  setOpenedErrorBlock,
  hasRequired,
  shouldResetLoading,
  setShouldResetLoading,
  fullPreview,
  preview,
}) => {
  const { accountInfo, isSocialAuthLoaded } = useTypedSelector(getAccountState);
  const isOnboardingPopupOpen = useTypedSelector(getIsOnboardingPopupOpen);

  const isTablet = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(CBreakpoints.tablet),
  );

  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [localDone, setLocalDone] = useState<boolean>(false);
  const [localExpired, setLocalExpired] = useState<boolean>(false);
  const [localSoon, setLocalSoon] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [activeStatus, setActiveStatus] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<number>(0); //Daily Task Slide
  const [isDailyTaskBackButtonLoading, setIsDailyTaskBackButtonLoading] =
    useState<boolean>(false);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [quizPreDone, setQuizPreDone] = useState<boolean>(false);

  const [referralLinkPreDone, setReferralLinkPreDone] =
    useState<boolean>(false);
  const [watchVideoPopupOpen, setWatchVideoPopupOpen] =
    useState<boolean>(false);

  const tooltipStatus = useMemo(() => {
    if (hasRequired && !task.required) {
      return t({
        id: "in9NtvyrAaDtEm7gmHBHtz-task",
        message: "This task is unlocked when you complete all required tasks",
      });
    }

    if (!accountInfo?.connected) {
      return t({
        id: "kikKXfQH74hnp9MuBcxyiG-tasks",
        message: "Log in or sign up to start the task",
      });
    }

    if (projectSoonStatus) {
      return t({
        id: "egMUkDSX8UjXxtDCMpJjKJ-tasks",
        message: "The project hasn't started yet",
      });
    }

    return "";
  }, [accountInfo?.connected, hasRequired, projectSoonStatus, task.required]);

  const increaseErrorsCount = useCallback(
    () => setErrorsCount(prev => prev + 1),
    [],
  );

  const reCaptchaV3 = useGoogleReCaptcha();

  const executeRecaptcha = useCallback(async () => {
    if (
      task.type === ELoyaltyTasks.SIGN_UP ||
      appConfig.NEXT_PUBLIC_DISABLE_RECAPTCHA
    )
      return "";

    setTimeout(() => setIsLoaded(true), 5000);

    return await reCaptchaV3.executeRecaptcha();
  }, [task.type, reCaptchaV3]);

  const isUnlimited = useIsUnlimited({
    taskType: task.type,
    additionalProgram: task.body?.additionalProgram,
    taskCompletedTweetId: task.body?.taskCompletedTweetId,
  });

  const progress = useProgress({
    activeStatus,
    partnerProjectLink: task.body?.partnerProjectLink,
    inviteLink: task.body?.inviteLink,
    username: task.body?.username,
    mentionUserName: task.body?.mentionUserName,
    tweetText: task.body?.tweetText,
    tweetId: task.body?.tweetId,
    redirectLink: task.body?.redirectLink,
    taskId: task.id,
    taskType: task.type,
    accountInfo,
    isUnlimited,
    getScores,
    localPoints,
    localTasksData,
    setLocalPoints,
    setLocalTasksData,
    trackIsDone,
    setActiveStatus,
    setErrorMessage,
    setIsLoaded,
    setIsError,
    activeStep,
    task,
    increaseErrorsCount,
    executeRecaptcha,
  });

  const status = useStatus({
    taskStatus: task.status,
    taskType: task.type,
    accountConnected: accountInfo?.connected,
    projectSoonStatus,
    projectExpiredStatus,
    localExpired,
    localSoon,
    localDone,
    startAt: task.startAt,
    hasRequired,
    taskRequired: task.required,
    quizPreDone,
  });

  const iconName = useIconName({ task, status, activeStep });

  useEffect(() => {
    if (shouldResetLoading) {
      setIsLoaded(true);
      setShouldResetLoading(false);
    }
  }, [setShouldResetLoading, shouldResetLoading]);

  useEffect(() => {
    if (!accountInfo?.connected) {
      setLocalDone(false);
      setActiveStatus(1);
    }
  }, [accountInfo?.connected]);

  useEffect(() => {
    if (task.type === ELoyaltyTasks.DAILY && task.body?.subTasks) {
      const indexOfDayByDate = getCurrentItemIndex(task.body.subTasks);
      if (indexOfDayByDate && task.body.subTasks[indexOfDayByDate]) {
        setActiveStep(indexOfDayByDate);
      }
    }
  }, [task]);

  useEffect(() => {
    if (openedErrorBlock !== task.id) {
      setErrorsCount(0);
    }
  }, [openedErrorBlock, task.id]);

  useEffect(() => {
    if (errorsCount === 2) {
      setOpenedErrorBlock(task.id);
    }
  }, [errorsCount, setOpenedErrorBlock, task.id]);

  useHandler({
    taskStatus: task.status,
    taskType: task.type,
    connectedDiscord: accountInfo?.connectedAccounts.discord,
    connectedTelegram: accountInfo?.connectedAccounts.telegram,
    connectedTwitter: accountInfo?.connectedAccounts.twitter,
    projectExpiredStatus,
    accountConnected: accountInfo?.connected,
    setLocalExpired,
    setLocalSoon,
    setActiveStatus,
    startAt: task.startAt,
  });

  const defaultErrorHandler = useCallback(() => {
    setErrorMessage("Task is not completed");
    setActiveStatus(1);
  }, []);

  const handleError = useCallback(
    (error?: any) => {
      setIsError(true);
      increaseErrorsCount();
      (progress[activeStatus - 1]?.errorHandler || defaultErrorHandler)(error);
    },
    [increaseErrorsCount, progress, activeStatus, defaultErrorHandler],
  );

  const buttonName = useMemo(() => {
    if (!progress) return "";
    return progress[activeStatus - 1]?.name || ETaskStatus.DONE;
  }, [activeStatus, progress]);

  const confirmFlow = useConfirmFlow({
    getScores,
    localPoints,
    localTasksData,
    setLocalPoints,
    setLocalTasksData,
    taskId: task.id,
    trackIsDone,
    handleError,
    setIsLoaded,
    setActiveStatus,
    setLocalDone,
    executeRecaptcha,
  });

  const action = useMemo(() => {
    if (progress) return progress[activeStatus - 1]?.action || confirmFlow;
  }, [progress, activeStatus, confirmFlow]);

  const handleClick = useCallback(
    (data?: any) => {
      setIsError(false);
      setErrorMessage("");
      setIsWarning(false);
      setWarningMessage("");

      action(data);
    },
    [action, setIsError, setErrorMessage],
  );

  const handleTaskExpired = () => {
    const index = localTasksData.findIndex(
      (item: ILoyaltyTask) => item.id === task.id,
    );
    const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
    item.status = ETaskStatus.EXPIRED;

    setLocalTasksData([...localTasksData, item]);

    setLocalExpired(true);
    setActiveStatus(4);
  };

  const handleTaskSoon = () => {
    setLocalSoon(false);
    setActiveStatus(1);
  };

  const {
    quizFormik,
    emailFormik,
    suggestionFormik,
    walletFormik,
    dailyFormik,
    webhookEmailFormik,
    webhookPhoneFormik,
    webhookTextFormik,
    imageUploadFormik,
  } = useForms({
    setIsLoaded,
    taskId: task.id,
    localTasksData,
    setLocalTasksData,
    setLocalPoints,
    trackIsDone,
    localPoints,
    setLocalDone,
    getScores,
    setIsError,
    setErrorMessage,
    task,
    activeStep,
    setActiveStep,
    setIsWarning,
    setWarningMessage,
    increaseErrorsCount,
    setQuizPreDone,
    executeRecaptcha,
  });

  const content = useContent({
    buttonName,
    handleClick,
    isLoaded,
    status,
    isError,
    quizFormik,
    emailFormik,
    walletFormik,
    suggestionFormik,
    confirmFlow,
    referralLinkPreDone,
    isSocialAuthLoaded,
    connectedDiscord: accountInfo?.connectedAccounts.discord,
    connectedTelegram: accountInfo?.connectedAccounts.telegram,
    connectedTwitter: accountInfo?.connectedAccounts.twitter,
    task,
    watchVideoPopupOpen,
    setReferralLinkPreDone,
    setIsError,
    setWatchVideoPopupOpen,
    setErrorMessage,
    activeStatus,
    activeStep,
    dailyFormik,
    webhookEmailFormik,
    webhookPhoneFormik,
    webhookTextFormik,
    isWarning,
    setIsWarning,
    imageUploadFormik,
    increaseErrorsCount,
    quizPreDone,
    inviteLimitReached: (task.body?.inviteCount || 0) >= 100,
  });

  useDebouncedEffect(
    () => {
      if (
        task.type === ELoyaltyTasks.SIGN_UP &&
        task.status !== ETaskStatus.DONE &&
        !localDone &&
        accountInfo.connected &&
        !isOnboardingPopupOpen
      ) {
        setLocalDone(true);
        confirmFlow();
        getScores();
      }
    },
    { timeout: 50, ignoreInitialCall: true },
    [task.type, task.status, localDone, accountInfo.connected, confirmFlow],
  );

  const isDisableNext = (() => {
    if (task.type !== "daily" || !task.body?.subTasks) return false;

    const next = task.body.subTasks[activeStep + 1];
    if (!next) return true;

    if (next.status !== "active") return false;
    return false;
  })();

  const handleClickArrow = (next?: boolean) => {
    return () => {
      if (next) return setActiveStep(prevState => prevState + 1);
      const prev = task.body.subTasks[activeStep - 1];
      if (prev) return setActiveStep(prevState => prevState - 1);
      setIsDailyTaskBackButtonLoading(true);
      return loyaltyService
        .getSubTaskByLoyaltyTaskId(
          task.id,
          task.body.subTasks[activeStep].id - 1,
        )
        .then(res => {
          if (res.data) {
            const index = localTasksData.findIndex(
              (t: ILoyaltyTask) => t.id === task.id,
            );
            localTasksData[index].body.subTasks = [
              res.data,
              ...task.body.subTasks,
            ];
            setLocalTasksData(localTasksData);
            //Because our array was unsifted, now current must be 1, so here we set +1 to our step
            setActiveStep(prevState => prevState + 1);
            // Next tick, is function that will be called after render
            // In this case, we need make -1 to our step, because we need to show previous step
            nextTick(() => {
              setActiveStep(prevState => prevState - 1);
              setIsDailyTaskBackButtonLoading(false);
            });
          }
        })
        .catch(console.log);
    };
  };

  const iconBlockItems = () => {
    const taskStatus = (() => {
      if (task.type === ELoyaltyTasks.DAILY)
        return task.body?.subTasks?.[activeStep]?.status === "active" ? (
          `${HelperService.addNumberSeparator(task.body.subTasks[0].points)}pnt`
        ) : (
          <>
            {task.body?.subTasks?.[activeStep]?.status === "expired" && (
              <Trans id="7G3p8KRLTrHX1ZxWnpF7qo-task">EXPIRED</Trans>
            )}
            {task.body?.subTasks?.[activeStep]?.status === "rejected" && (
              <Trans id="mfXF95BaTtpFCwTM4Efdid-task">REJECTED</Trans>
            )}
            {task.body?.subTasks?.[activeStep]?.status === "confirmed" && (
              <Trans id="nNG7zvJxLJ9bF2KE1MZP5u-task">DONE</Trans>
            )}
          </>
        );

      if (task.type === ELoyaltyTasks.INVITE)
        return (
          <Trans id={"40246842-19e2-11ee-be56-0242ac120002"}>Referral</Trans>
        );

      if (task.type === ELoyaltyTasks.QUIZ && status?.isExpired) {
        return <Trans id="v1vgdcg3WXD6K6yTWDjPTU-task">FAILED</Trans>;
      }

      return (
        <>
          {status?.isExpired && (
            <Trans id="7G3p8KRLTrHX1ZxWnpF7qo-task">EXPIRED</Trans>
          )}
          {status?.isDone && (
            <Trans id="nNG7zvJxLJ9bF2KE1MZP5u-task">DONE</Trans>
          )}
          {(status?.isActive || status?.isBlocked) && (
            <Trans id="eZCu7ab6qMnYFKGw9fRQ3m-task">
              {HelperService.addNumberSeparator(task.points)}pnt
            </Trans>
          )}
        </>
      );
    })();

    // Referral

    return (
      <Box
        display="flex"
        mb={
          ((status.isBlocked || status.isActive) && Boolean(task.endAt)) ||
          status.isDone ||
          status.isExpired
            ? 1
            : 0
        }
        className={
          isTablet && "c-flex-items-center items-justified-space-between"
        }
      >
        <div className={"c-flex aligncenter"}>
          <Box className="iconWrapper">
            <Icon size="24" name={iconName} />
          </Box>

          <Box component="p" className="pointsLabel c-font-20-24 c-fw-500">
            {taskStatus}
          </Box>
        </div>
        {isTablet && task.type === "daily" && (
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={1}
          >
            <Button
              onClick={handleClickArrow(false)}
              disabled={
                isDailyTaskBackButtonLoading ||
                task.body?.subTasks?.[activeStep]?.id === 0
              }
              size={"small"}
              style={"secondary"}
            >
              <Icon
                className={"c-flex"}
                name={
                  isDailyTaskBackButtonLoading ||
                  task.body?.subTasks?.[activeStep]?.id === 0
                    ? "arrow-keyboard-left-disabled"
                    : "arrow-keyboard-left"
                }
              />
            </Button>

            <Button
              onClick={handleClickArrow(true)}
              disabled={isDisableNext}
              size={"small"}
              style={"secondary"}
            >
              <Icon
                className={"c-flex"}
                name={
                  isDisableNext
                    ? "arrow-keyboard-right-disabled"
                    : "arrow-keyboard-right"
                }
              />
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const computeTitle = useMemo(() => {
    const isDailyTask = task.type === ELoyaltyTasks.DAILY;

    return (
      <>
        <p className="title c-font-20-24 c-fw-500">
          {isDailyTask ? task.body?.subTasks?.[activeStep]?.title : task.title}
        </p>

        {task.body?.description && (
          <MarkdownAndHTML
            className={"task_description"}
            description={task.body?.description}
          />
        )}
      </>
    );
  }, [task.body?.description, task.title, activeStep]);

  //Daily Task

  const dailyTaskContent = useMemo(() => {
    const totalPoints =
      task.body?.subTasks &&
      task.body.subTasks.reduce((acc, subTask) => {
        if (subTask.status === "confirmed") {
          acc += subTask.points;
        }
        return acc;
      }, 0);

    const computedDayOfDailyTask =
      task.body?.subTasks &&
      `Day ${task.body.subTasks[activeStep].id + 1}/${task.body.total}`;

    const displayEarnedPoints = () => {
      return task.body?.subTasks?.[activeStep]?.status === "confirmed" ? (
        <p style={{ color: "#87F696" }} className={"c-font-14-20"}>
          You earned {task.body.subTasks[activeStep].points}pnt
        </p>
      ) : (
        <p></p>
      );
    };

    return (
      task.body?.subTasks && (
        <Box
          className={
            isTablet && "c-flex align-start items-justified-space-between"
          }
          mt={2}
        >
          {task.body?.subTasks?.[activeStep]?.status === "active" && (
            <p style={{ color: "#87F696" }} className={"c-font-14-20"}>
              Until daily {"task's"} end{" "}
              <CountDown date={task.body.subTasks[activeStep].endAt} />
            </p>
          )}

          {task.status === ETaskStatus.DONE ? (
            <p style={{ color: "#87F696" }} className={"c-font-14-20"}>
              Totally earned {totalPoints}pnt
            </p>
          ) : (
            displayEarnedPoints()
          )}

          <Box mt={!isTablet && 2} width={isTablet ? "50%" : "100%"}>
            <p
              style={{ color: "white", marginBottom: 4 }}
              className={classNames("c-font-12-16", {
                ["t-align-right"]: isTablet,
              })}
            >
              {computedDayOfDailyTask}
            </p>
            <ProgressBarStylesWrapper style={{ height: `${2}px` }}>
              <ProgressBarStylesScore
                style={{
                  height: `${2}px`,
                  width: `${
                    (task.body?.subTasks?.[activeStep]?.id / task.body?.total) *
                    100
                  }%`,
                  backgroundColor: "white",
                }}
              />
            </ProgressBarStylesWrapper>
          </Box>
          {!isTablet && (
            <Box
              style={{ marginTop: 27 }}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Button
                onClick={handleClickArrow(false)}
                disabled={
                  isDailyTaskBackButtonLoading ||
                  task.body?.subTasks?.[activeStep]?.id === 0
                }
                size={"small"}
                style={"secondary"}
              >
                <Icon
                  className={"c-flex"}
                  name={
                    isDailyTaskBackButtonLoading ||
                    task.body?.subTasks?.[activeStep]?.id === 0
                      ? "arrow-keyboard-left-disabled"
                      : "arrow-keyboard-left"
                  }
                />
              </Button>

              <Button
                onClick={handleClickArrow(true)}
                disabled={isDisableNext}
                size={"small"}
                style={"secondary"}
              >
                <Icon
                  className={"c-flex"}
                  name={
                    isDisableNext
                      ? "arrow-keyboard-right-disabled"
                      : "arrow-keyboard-right"
                  }
                />
              </Button>
            </Box>
          )}
        </Box>
      )
    );
  }, [task.body?.subTasks, activeStep, isTablet, isDailyTaskBackButtonLoading]);

  // Invite Friend Task

  const inviteFriendContent = useMemo(() => {
    const isShowEarnedTextToNextLine =
      !isTablet &&
      String(Number(task.body?.totalEarned || 0).toFixed(2)).length >= 3;
    return (
      <Box>
        <p className={"c-font-14-20 c-font-color-3"}>
          {task.body?.inviteCount}/{100} users{" "}
          <span className={"c-font-color c-font-14-20"}>invited</span>
        </p>
        <Box className={"c-font-14-20 c-font-color-3"}>
          {+task.body?.totalEarned
            ? Number(task.body?.totalEarned).toFixed(2)
            : 0}{" "}
          points{" "}
          {!isShowEarnedTextToNextLine && (
            <span className={"c-font-color c-font-14-20"}>earned</span>
          )}
          <Tooltip
            value={
              <span style={{ whiteSpace: "pre-wrap", textAlign: "center" }}>
                {t({
                  id: "dsjhgkha44392-3dfgsdv",
                  message: `You receive ${task.body?.scorePercentage}% of the points earned by your referrals. 
                  Note: after the quest is completed, points earned by referrals who have completed less than 10 tasks in other quests will be canceled.`,
                })}
              </span>
            }
          >
            <Box
              display={"inline-block"}
              height={20}
              position={"relative"}
              left={5}
              top={9}
            >
              <Icon name={"question-mark"} />
            </Box>
          </Tooltip>
        </Box>
        {isShowEarnedTextToNextLine && (
          <p className={"c-font-color c-font-14-20"}>earned</p>
        )}
      </Box>
    );
  }, [task.body, isTablet]);

  // Quiz task
  const quizTaskContent = useMemo(() => {
    return (
      <Box mt={1}>
        <p className={"c-font-14-20 c-font-color"}>
          Total Attempts: {task.body?.maxAnswers || 1}
        </p>
      </Box>
    );
  }, [task.body]);

  const isOnChainTask = useCallback(
    (taskType: ELoyaltyTasks) =>
      [
        ELoyaltyTasks.NFT,
        ELoyaltyTasks.TOKEN,
        ELoyaltyTasks.BLOCKCHAIN_USER,
        ELoyaltyTasks.NATIVE_HOLDER,
        ELoyaltyTasks.VALUE_HOLDER,
        ELoyaltyTasks.DEX_LIQUIDITY_PROVIDER,
        ELoyaltyTasks.ALL_BRIDGE,
      ].includes(taskType as any),
    [],
  );

  const supportRef = useRef();

  return (
    <Tooltip value={tooltipStatus} placement="top" followCursor>
      <Wrapper
        preview={preview}
        fullPreview={fullPreview}
        className={classNames({
          done: task.type !== ELoyaltyTasks.INVITE ? status.isDone : false,
          expired: status.isExpired,
          blocked: status.isBlocked || status.isSoon,
        })}
      >
        <Box className="mainBlock">
          {isError && task.type !== ELoyaltyTasks.SIGN_UP && (
            <div className="error">
              <Icon name="alert-task" size="14" />

              <Box component="p" className="c-font-12-16 c-font-color" ml={0.5}>
                {errorMessage}
              </Box>
            </div>
          )}
          {isWarning && task.type !== ELoyaltyTasks.SIGN_UP && (
            <div className="warning">
              <Icon name="alert-task" size="14" />

              <Box component="p" className="c-font-12-16 c-font-color" ml={0.5}>
                {warningMessage}
              </Box>
            </div>
          )}
          <Box className="iconBlock">
            {isTablet && isOnChainTask(task.type) ? (
              <Box
                mb={1}
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                {iconBlockItems()}
                {isOnChainTask(task.type) && <ChainLabel task={task} my={0} />}
              </Box>
            ) : (
              <>
                {iconBlockItems()}
                {isOnChainTask(task.type) && <ChainLabel task={task} />}
              </>
            )}
            {task.type === ELoyaltyTasks.DAILY && dailyTaskContent}
            {task.type === ELoyaltyTasks.INVITE &&
              task.status === ETaskStatus.DONE &&
              inviteFriendContent}
            {task.type == ELoyaltyTasks.QUIZ &&
              !status?.isDone &&
              quizTaskContent}

            {(status.isBlocked || status.isActive) && Boolean(task.endAt) && (
              <Box className="countdownWrapper c-font-14-20" mt={1}>
                <CountDown date={task.endAt} onComplete={handleTaskExpired} />
              </Box>
            )}

            {status.isSoon && Boolean(task.startAt) && (
              <Box className="countdownWrapper c-font-14-20" mt={1}>
                <CountDown date={task.startAt} onComplete={handleTaskSoon} />
              </Box>
            )}

            {(status.isDone || status.isExpired) &&
              ![ELoyaltyTasks.DAILY, ELoyaltyTasks.INVITE].includes(
                task.type,
              ) && (
                <Box className="c-font-14-20 c-fw-400">
                  <Trans id="b928ejHw9wgdXDHyc3r8aL-task">
                    Earned{" "}
                    {task.status === ETaskStatus.DONE
                      ? HelperService.addNumberSeparator(task.points)
                      : 0}
                    pnt
                  </Trans>
                </Box>
              )}

            {isUnlimited && task.status === ETaskStatus.ADDITIONAL_PROGRAM && (
              <Box className="c-font-14-20 c-fw-400" mt={1}>
                <p>
                  <Trans id="6Uy7NCUK24L8KJs4WHLJ7U-task">
                    Likes: {task.body?.additionalProgram?.likes}
                  </Trans>
                </p>
                <p>
                  <Trans id="24XeTDhPLXfuNRnf1kEdvu-task">
                    Retweets: {task.body?.additionalProgram?.reTweets}
                  </Trans>
                </p>
              </Box>
            )}
          </Box>
          <Box className="divider" />

          <Box className="contentBlock">
            {Boolean(progress && progress.length) && (
              <Box component="ul" className="steps">
                {progress.map(step => {
                  if (step.id === 4 && !task.body?.additionalProgram)
                    return null;
                  return (
                    <>
                      {step && (
                        <li
                          className={classNames(
                            "step",
                            {
                              ["step-active"]: step.isActive,
                              ["step-disabled"]: step.isDisabled,
                              ["step-error"]: step.isError,
                            },
                            "c-font-12-16",
                          )}
                          style={{
                            color: step.isDone
                              ? "var(--tasks-partner-text-color)"
                              : "",
                          }}
                          key={step.id}
                        >
                          {step.title}
                        </li>
                      )}
                    </>
                  );
                })}
              </Box>
            )}

            <Box className="socContent c-font-color">
              {computeTitle}
              {content}
            </Box>
          </Box>
        </Box>
        <CSSTransition
          nodeRef={supportRef}
          in={
            task.type !== ELoyaltyTasks.SIGN_UP &&
            openedErrorBlock === task.id &&
            status.isActive
          }
          isOpen={
            task.type !== ELoyaltyTasks.SIGN_UP &&
            openedErrorBlock === task.id &&
            status.isActive
          }
          timeout={300}
          classNames="open"
        >
          <ErrorBlock ref={supportRef}>
            <Box className="content">
              <Box
                component="h3"
                className="c-fw-500 c-font-20-22 c-sm-font-20-27 c-font-color"
              >
                <Trans id="aEVXswMMtZH798QnND1Cyo-task">
                  Apparently an error has occurred.
                </Trans>
              </Box>
              <Box
                component="p"
                className="c-fw-400 c-font-15-22 c-sm-font-15-27 c-font-color"
              >
                <Trans id="79fWxJeD6PHijaGABcDWxn-task">
                  If you&apos;re confident in task completion or facing
                  difficulties, contact support.
                </Trans>
              </Box>
            </Box>

            <Button
              style="colorfull"
              href={ELinks.telegram}
              target="_blank"
              className="button"
            >
              <Trans id="sjZaDwDx61Ed3j8yeuCr38-task">Contact support</Trans>
            </Button>
          </ErrorBlock>
        </CSSTransition>

        {task.required && (
          <Tooltip
            value={t({
              id: "sxPN7TjK4JUUUm4b2EjF82-task",
              message: "required tooltip",
            })}
            placement="top"
            followCursor
          >
            <RequiredBlock>
              <Box className="c-font-12-13 c-font-color">
                <Trans id="ozJUpoA8B33zYhoo2aUtN5-task">Required Task</Trans>
              </Box>
              <Box className="tooltip c-font-10-20">?</Box>
            </RequiredBlock>
          </Tooltip>
        )}

        {Boolean(task.expPoints) && (
          <ExpBlock className="c-font-12-24 c-fw-500">
            <Icon name="star" size="12" className="icon" />
            <Trans id="k4ZSZHEXV7gtpzTNK82rfT-task">{task.expPoints} XP</Trans>
          </ExpBlock>
        )}
      </Wrapper>
    </Tooltip>
  );
};

export default Task;
