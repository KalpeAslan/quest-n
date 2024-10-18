import {
  ELoyaltyTasks,
  ETaskStatus,
  ILoyaltyTask,
  ITaskTrackingData,
} from "@/models";
import { Wrapper } from "./iframeTaskItem.styles";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountState } from "@/modules/account/store/account.selector";
import { Trans, t } from "@lingui/macro";
import useIsUnlimited from "@/components/task/hooks/useIsUnlimited";
import useProgress from "@/components/task/hooks/useProgress";
import useStatus from "@/components/task/hooks/useStatus";
import { getCurrentItemIndex } from "@/components/task/task.utils";
import useHandler from "@/components/task/hooks/useHandler";
import useForms from "@/components/task/hooks/useForms";
import useContent from "@/components/task/hooks/useContent";
import useConfirmFlow from "@/components/task/hooks/useConfirmFlow";
import { Tooltip } from "@/components/UI/tooltip";
import { Box } from "@mui/material";
import { Icon } from "@/components/UI/icon";
import { setIsAuthPopupOpen } from "@/modules/account/store/account.slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { icons, statusIcons } from "../../models/constants";
import classNames from "classnames";
import { MarkdownAndHTML } from "@components/MarkdownAndHTML/MarkdownAndHTML";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { appConfig } from "@/app.config";

interface Props {
  task: ILoyaltyTask;
  localTasksData: ILoyaltyTask[];
  localPoints: number;
  projectSoonStatus: boolean;
  projectExpiredStatus: any;
  setLocalTasksData: React.Dispatch<React.SetStateAction<ILoyaltyTask[]>>;
  setLocalPoints: React.Dispatch<React.SetStateAction<number>>;
  trackIsDone: (data: ITaskTrackingData) => void;
  getProjectData: () => Promise<void>;
}

const IframeTaskItem: FC<Props> = ({
  task,
  projectSoonStatus,
  projectExpiredStatus,
  setLocalTasksData,
  localTasksData,
  setLocalPoints,
  localPoints,
  trackIsDone,
  getProjectData,
}) => {
  const { accountInfo, isSocialAuthLoaded } = useTypedSelector(getAccountState);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [localDone, setLocalDone] = useState<boolean>(false);
  const [localExpired, setLocalExpired] = useState<boolean>(false);
  const [localSoon, setLocalSoon] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeStatus, setActiveStatus] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>("");
  const [quizPreDone, setQuizPreDone] = useState<boolean>(false);

  const [referralLinkPreDone, setReferralLinkPreDone] =
    useState<boolean>(false);
  const [watchVideoPopupOpen, setWatchVideoPopupOpen] =
    useState<boolean>(false);

  const dispatch = useAppDispatch();

  const tooltipStatus = useMemo(() => {
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
  }, [accountInfo, projectSoonStatus]);

  const reCaptchaV3 = useGoogleReCaptcha();

  const executeRecaptcha = useCallback(async () => {
    if (
      task.type === ELoyaltyTasks.SIGN_UP ||
      appConfig.NEXT_PUBLIC_DISABLE_RECAPTCHA
    )
      return "";

    setTimeout(() => setIsLoaded(true), 5000);

    return await reCaptchaV3.executeRecaptcha();
  }, [reCaptchaV3, task.type]);

  const isUnlimited = useIsUnlimited({
    taskType: task.type,
    additionalProgram: task.body?.additionalProgram,
    taskCompletedTweetId: task.body?.taskCompletedTweetId,
  });

  const progress = useProgress({
    increaseErrorsCount: () => {},
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
    getScores: getProjectData,
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
    executeRecaptcha,
  });

  const status = useStatus({
    taskStatus: task.status,
    taskType: task.type,
    accountConnected: accountInfo?.connected,
    projectSoonStatus,
    projectExpiredStatus,
    localExpired,
    localDone,
    localSoon,
    taskRequired: task.required,
    quizPreDone,
  });

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

  useHandler({
    taskStatus: task.status,
    taskType: task.type,
    connectedDiscord: accountInfo?.connectedAccounts.discord,
    connectedTelegram: accountInfo?.connectedAccounts.telegram,
    connectedTwitter: accountInfo?.connectedAccounts.twitter,
    projectExpiredStatus,
    accountConnected: accountInfo?.connected,
    setLocalExpired,
    setActiveStatus,
    setLocalSoon,
  });

  const defaultErrorHandler = useCallback(() => {
    setErrorMessage("Task is not completed");
    setActiveStatus(1);
  }, []);

  const handleError = useCallback(
    (error?: any) => {
      setIsError(true);
      (progress[activeStatus - 1]?.errorHandler || defaultErrorHandler)(error);
    },
    [activeStatus, progress, defaultErrorHandler],
  );

  const buttonName = useMemo(() => {
    if (!progress || !progress.length) return "";
    return progress[activeStatus - 1]?.name || ETaskStatus.DONE;
  }, [activeStatus, progress]);

  const confirmFlow = useConfirmFlow({
    getScores: getProjectData,
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
    return progress[activeStatus - 1]?.action || confirmFlow;
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
    getScores: getProjectData,
    setIsError,
    setErrorMessage,
    task,
    activeStep,
    setActiveStep,
    setIsWarning,
    setWarningMessage,
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
    open: isOpen,
    webhookEmailFormik,
    webhookPhoneFormik,
    webhookTextFormik,
    setIsWarning,
    isWarning,
    imageUploadFormik,
    isIframe: true,
    quizPreDone,
    inviteLimitReached: (task.body?.inviteCount || 0) >= 100,
  });

  const isDailyTask = useMemo(
    () => task.type === ELoyaltyTasks.DAILY,
    [task.type],
  );

  return (
    <Tooltip value={tooltipStatus} placement="top" followCursor>
      <Wrapper
        open={isOpen}
        className={classNames({
          done:
            (status.isDone && task.type !== ELoyaltyTasks.INVITE) ||
            status.isExpired,
        })}
      >
        {isError && (
          <div className="error">
            <Icon name="alert-task" size="14" />

            <Box component="p" className="c-font-12-16 c-font-color" ml={0.5}>
              {errorMessage}
            </Box>
          </div>
        )}
        {isWarning && (
          <div className="warning">
            <Icon name="alert-task" size="14" />

            <Box component="p" className="c-font-12-16 c-font-color" ml={0.5}>
              {warningMessage}
            </Box>
          </div>
        )}
        <Box
          display="flex"
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={() => {
            if (!accountInfo.connected) {
              dispatch(setIsAuthPopupOpen(true));
              return;
            }
            setIsOpen(prev => !prev);
          }}
        >
          <Box className="iconWrapper" mr={1}>
            <Icon
              size="20"
              name={
                status.isDone
                  ? task.type === ELoyaltyTasks.INVITE
                    ? icons[task.type]
                    : statusIcons.done
                  : status.isExpired
                  ? statusIcons.expired
                  : icons[task.type]
              }
            />
          </Box>

          <Box mr="auto" className="c-fw-500 c-font-color c-font-16-22">
            {isDailyTask
              ? task.body?.subTasks?.[activeStep]?.title
              : task.title}
          </Box>

          {isOpen ? (
            <Icon name="menu-select" size="24" className="openIcon" />
          ) : (
            <Box color="#87F696" className="c-font-18-24">
              +
              {isDailyTask
                ? task.body?.subTasks?.[activeStep]?.points
                : task.points}
            </Box>
          )}
        </Box>

        {isOpen && (
          <Box mt={1.5}>
            <Box className="divider" mb={1.5} />

            <Box mb={1.5} className="c-font-14-20 c-font-color">
              <MarkdownAndHTML
                description={
                  isDailyTask
                    ? task.body?.subTasks?.[activeStep]?.description
                    : task.body?.description
                }
              />
            </Box>

            <Box className="c-font-color c-fw-700 c-font-14-20" mb={1.5}>
              {status.isDone ? (
                <Trans id="qYmNRmU7vTR2MbnQLjsZvF-quest">
                  Earned{" "}
                  {isDailyTask
                    ? task.body?.subTasks?.[activeStep]?.points
                    : task.points}
                  pnts
                </Trans>
              ) : (
                <Trans id="3stwBcRsXfwq9naPkDoXpK-quest">
                  Get reward{" "}
                  {isDailyTask
                    ? task.body?.subTasks?.[activeStep]?.points
                    : task.points}
                  pnts
                </Trans>
              )}
            </Box>

            {content}
          </Box>
        )}
      </Wrapper>
    </Tooltip>
  );
};

export default IframeTaskItem;
