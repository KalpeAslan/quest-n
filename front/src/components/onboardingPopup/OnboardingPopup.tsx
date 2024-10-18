import { FC, useCallback, useEffect, useState, useMemo } from "react";
import classnames from "classnames";
import { Box } from "@mui/material";
import { t, Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { Modal } from "@components/UI/modal";
import { Button } from "@components/UI/button";
import { GetReward } from "@components/getReward";
import { Auth } from "@components/auth";
import { VideoQuest } from "@components/videoQuest";

import { ILoyaltyTask, ELoyaltyTasks, ETaskStatus } from "@models";
import { LoggerService } from "@services";
import { accountService, experienceService, loyaltyService } from "@api";

import { useTypedSelector } from "@/hooks/useTypedSelector";
import {
  getAccountInfo,
  getLocalReferralCode,
} from "@/modules/account/store/account.selector";
import {
  getIsOnboardingPopupDataLoaded,
  getIsOnboardingPopupOpen,
  getOnboardingPopupflow,
} from "@/store/slices/system/system.selector";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  setIsOnboardingPopupDataLoaded,
  setIsOnboardingPopupOpen,
  setIsOnboardingTaskDone,
  setOnboardingPopupFlow,
} from "@/store/slices/system/system.slice";
import { Wrapper } from "./onboardingPopup.styles";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { IAccount } from "@modules/account/models";
import { accountApiEndpoints } from "@/modules/account/store/account.api";
import {
  setIsReferralCodeLoading,
  setIsReferralPopupResultOpen,
  setLocalReferralCode,
  setQuestReferralCode,
} from "@/modules/account/store/account.slice";
import { useQuestReferralCode } from "@/hooks/useQuestReferralCode";

const enum ETasks {
  SIGN_UP = "sign up",
  YOUTUBE = "youtube",
  REWARD_SIGN_UP = "reward sign up",
  COMPLETED_ONBOARDING = "completed onboarding task",
  DONE = "done",
}

interface indexProps {
  className?: string;
}

const OnboardingPopup: FC<indexProps> = ({ className }) => {
  const { push, pathname } = useRouter();

  const [authType, setAuthType] = useState<"login" | "sign-up">("sign-up");
  const [signUpTask, setSignUpTask] = useState<ILoyaltyTask | null>(null);
  const [youtubeTask, setYoutubeTask] = useState<ILoyaltyTask | null>(null);
  const [currentTask, setCurrentTask] = useState<ETasks | null>(null);
  const [completedOnboardingTask, setCompletedOnboardingTask] =
    useState<ILoyaltyTask | null>(null);

  const dispatch = useAppDispatch();

  const accountInfo: IAccount = useTypedSelector(getAccountInfo);
  const localReferralCode = useTypedSelector(getLocalReferralCode);
  const questReferralCode = useQuestReferralCode();

  const isOnboardingPopupOpen = useTypedSelector(getIsOnboardingPopupOpen);

  const isOnboardingPopupDataLoaded = useTypedSelector(
    getIsOnboardingPopupDataLoaded,
  );

  const onboardingPopupFlow = useTypedSelector(getOnboardingPopupflow);

  const isOpen = useMemo(
    () =>
      isOnboardingPopupOpen !== undefined &&
      isOnboardingPopupOpen &&
      currentTask !== null &&
      currentTask !== ETasks.DONE,
    [isOnboardingPopupOpen, currentTask],
  );

  const getTasksInfo = useCallback(async () => {
    dispatch(setIsOnboardingPopupDataLoaded(false));

    try {
      const { data } = await loyaltyService.getOnbordingTasks();

      const isHasActive = data.find(
        (task: ILoyaltyTask) => task.status === ETaskStatus.ACTIVE,
      );

      if (isHasActive) {
        dispatch(setIsOnboardingTaskDone(false));
      } else {
        dispatch(setIsOnboardingTaskDone(true));
      }

      const youtubeTask = data.find(
        (task: ILoyaltyTask) => task.type === ELoyaltyTasks.WATCH_VIDEO,
      );
      const signUpTask = data.find(
        (task: ILoyaltyTask) => task.type === ELoyaltyTasks.SIGN_UP,
      );
      const completedOnboardingTask = data.find(
        (task: ILoyaltyTask) =>
          task.type === ELoyaltyTasks.COMPLETED_ONBOARDING,
      );

      if (youtubeTask !== -1) {
        setYoutubeTask(youtubeTask);
      }

      if (signUpTask !== -1) {
        setSignUpTask(signUpTask);
      }

      if (completedOnboardingTask !== -1) {
        setCompletedOnboardingTask(completedOnboardingTask);
      }
    } catch (error) {
      LoggerService.error("Error during response", error);
    } finally {
      dispatch(setIsOnboardingPopupDataLoaded(true));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isOnboardingPopupDataLoaded) {
      return;
    }

    if (!accountInfo?.connected) {
      setCurrentTask(ETasks.SIGN_UP);
      dispatch(setIsOnboardingTaskDone(false));

      return;
    }

    if (
      accountInfo?.connected &&
      signUpTask &&
      signUpTask?.status === ETaskStatus.ACTIVE
    ) {
      setCurrentTask(ETasks.REWARD_SIGN_UP);

      return;
    }

    if (accountInfo?.connected) {
      dispatch(setIsOnboardingPopupOpen(false));
      dispatch(setOnboardingPopupFlow("auth"));
      dispatch(setIsOnboardingTaskDone(true));
      setCurrentTask(ETasks.DONE);
    }

    if (
      accountInfo?.connected &&
      (signUpTask ? signUpTask?.status === ETaskStatus.DONE : true) &&
      youtubeTask?.status === ETaskStatus.ACTIVE
    ) {
      setCurrentTask(ETasks.YOUTUBE);

      return;
    }

    if (
      accountInfo?.connected &&
      signUpTask?.status === ETaskStatus.DONE &&
      youtubeTask?.status === ETaskStatus.DONE &&
      completedOnboardingTask?.status === ETaskStatus.ACTIVE
    ) {
      setCurrentTask(ETasks.COMPLETED_ONBOARDING);

      return;
    }

    if (
      accountInfo?.connected &&
      signUpTask?.status === ETaskStatus.DONE &&
      youtubeTask?.status === ETaskStatus.DONE &&
      completedOnboardingTask?.status === ETaskStatus.DONE
    ) {
      dispatch(setIsOnboardingPopupOpen(false));
      dispatch(setOnboardingPopupFlow("auth"));
      dispatch(setIsOnboardingTaskDone(true));
      setCurrentTask(ETasks.DONE);
    }
  }, [
    signUpTask,
    youtubeTask,
    completedOnboardingTask,
    isOnboardingPopupDataLoaded,
    accountInfo?.connected,
    dispatch,
  ]);

  useEffect(() => {
    if (accountInfo?.connected) {
      getTasksInfo();
    }
  }, [accountInfo?.connected, getTasksInfo, isOpen]);

  const addReferralCode = useCallback(async () => {
    if (!questReferralCode && !localReferralCode) {
      return;
    }

    try {
      if (localReferralCode) {
        await accountService.postAddReferral({
          code: localReferralCode,
        });
      } else if (questReferralCode && !pathname.includes("login")) {
        await accountService
          .postAddQuestReferral({
            code: questReferralCode,
          })
          .then(res => {
            push(`/quest/${res.data.response.questLinkTitle}`);
          });
      }

      await dispatch(accountApiEndpoints.getUserProfile.initiate(null));
      await experienceService.verify();

      await dispatch(accountApiEndpoints.getUserAnalyticsInfo.initiate(null));

      dispatch(
        setIsReferralPopupResultOpen({
          open: true,
          type: "success",
        }),
      );
    } catch (error: any) {
      const { response } = error;

      if (
        (response.status === 400 && response.data.errorCode === 1010) ||
        response.data.errorCode === 1011
      ) {
        dispatch(
          setIsReferralPopupResultOpen({
            open: true,
            type: "error",
          }),
        );

        return;
      }

      LoggerService.error("Error during adding referral code", error);
    } finally {
      dispatch(setIsReferralCodeLoading(false));
      dispatch(setLocalReferralCode(null));
      dispatch(setQuestReferralCode(null));
    }
  }, [dispatch, localReferralCode, pathname, push, questReferralCode]);

  const completeAuth = useCallback(async () => {
    await dispatch(accountApiEndpoints.getUserProfile.initiate(null));

    dispatch(
      sendAnalyticsDataThunk({
        type: "signup_complete",
        options: {
          event_property_signup_source: authType,
          event_property_signup_with_referral: false,
        },
      }),
    );
    await experienceService.verify();

    dispatch(await accountApiEndpoints.getUserAnalyticsInfo.initiate(null));
  }, [authType, dispatch]);

  const handleClose = useCallback(async () => {
    dispatch(setIsOnboardingPopupOpen(false));
    dispatch(setOnboardingPopupFlow("auth"));

    if (!accountInfo?.connected) {
      // await completeAuth();
      await addReferralCode();
    }
  }, [accountInfo?.connected, addReferralCode, completeAuth, dispatch]);

  return (
    <Modal
      isOpen={isOpen}
      closeByOutsideClick={false}
      handleClose={handleClose}
    >
      <Wrapper>
        <div className="header">
          {(currentTask === ETasks.SIGN_UP ||
            currentTask === ETasks.REWARD_SIGN_UP) &&
            onboardingPopupFlow === "task" && (
              <Box
                className={classnames(
                  "title",
                  "c-font-24-26 c-fw-500 c-font-color",
                )}
                component="p"
              >
                <Trans id="mtU9fdXUTk7JDs9voPjLBf-onboardingPopup">
                  Create Account
                </Trans>
              </Box>
            )}

          {(currentTask === ETasks.SIGN_UP ||
            currentTask === ETasks.REWARD_SIGN_UP) &&
            onboardingPopupFlow === "auth" && (
              <Box
                className={classnames(
                  "title",
                  "c-font-24-26 c-fw-500 c-font-color",
                )}
                component="p"
              >
                <Trans id="8NUYxN7BbQip3Zd6Xf4LVs-onboardingPopup">
                  Welcome to AlphaQuest
                </Trans>
              </Box>
            )}

          {currentTask === ETasks.YOUTUBE && (
            <Box
              className={classnames(
                "title",
                "c-font-24-26 c-fw-500 c-font-color",
              )}
              component="p"
            >
              <Trans id="8KPa9JpS9Z9Bn8A7Qr2AjM-onboardingPopup">
                How it works?
              </Trans>
            </Box>
          )}

          {currentTask === ETasks.COMPLETED_ONBOARDING && (
            <Box
              className={classnames(
                "title",
                "c-font-24-26 c-fw-500 c-font-color",
              )}
              component="p"
            >
              <Trans id="p6zSrxcVgtTtnyFAEGTDND-onboardingPopup">
                Let’s Start
              </Trans>
            </Box>
          )}

          <Button
            className={classnames("close", "c-font-color")}
            style="icon"
            type="button"
            onClick={handleClose}
            disableTouchStart
          >
            <Icon name="menu-close" size="24" />
          </Button>
        </div>

        <div className="content">
          {currentTask === ETasks.SIGN_UP && (
            <Auth
              authHeader={
                <>
                  {signUpTask?.body?.onboardingTitle && (
                    <Box
                      className="c-font-20-24 c-fw-500 c-font-color"
                      component="h3"
                    >
                      {signUpTask.body.onboardingTitle}
                    </Box>
                  )}

                  {signUpTask?.body?.onboardingDescription && (
                    <Box
                      className="c-font-16-22 c-font-color"
                      component="p"
                      mb={{ xs: 3 }}
                    >
                      {signUpTask.body.onboardingDescription}
                    </Box>
                  )}
                </>
              }
              twitterButtonText={t({
                id: "1rDYM4EyPoF4Rpvmwp29LN-onboardingPopup",
                message: "Twitter",
              })}
              discordButtonText={t({
                id: "c9qiQDCyXVmTAfmV5npUZV-onboardingPopup",
                message: "Discord",
              })}
              googleButtonText={t({
                id: "rSRhJ4kvC7ciEPfVfTpm3Q-onboardingPopup",
                message: "Google",
              })}
              emailButtonText={
                authType === "sign-up"
                  ? t({
                      id: "2k3cJbg3S4nQm8jFpwFJpP-onboardingPopup",
                      message: "Sign Up via Email or Phone",
                    })
                  : ""
              }
              authFooter={
                <Box
                  className="c-font-20-24 c-fw-500 c-font-color"
                  component="p"
                  mb={{ xs: 2, md: 3 }}
                >
                  {authType === "sign-up"
                    ? t({
                        id: "ewbzaoUYwcwgQtsVGsMNfx-onboardingPopup",
                        message: "Already have an account?",
                      })
                    : t({
                        id: "cnN5X8988pYv6LCW2VCNex-onboardingPopup",
                        message: "No account?",
                      })}{" "}
                  <Button
                    style="link"
                    type="button"
                    onClick={() =>
                      setAuthType(authType === "sign-up" ? "login" : "sign-up")
                    }
                    className={classnames("link", "c-font-color-3")}
                  >
                    {authType === "sign-up"
                      ? t({
                          id: "7zzCf9VsLbLMfN6H2UmmTb-onboardingPopup",
                          message: "Login",
                        })
                      : t({
                          id: "i1TkYYfpQze9ubwdSw6xLx-onboardingPopup",
                          message: "Create one!",
                        })}
                  </Button>
                </Box>
              }
            />
          )}

          {currentTask === ETasks.REWARD_SIGN_UP &&
            signUpTask?.points &&
            signUpTask && (
              <GetReward
                points={signUpTask.points}
                taskId={signUpTask?.id}
                preTitle={
                  onboardingPopupFlow === "task"
                    ? ""
                    : t({
                        id: "6nBzqgnCGQnWsx9S6ukeow-onboardingPopup",
                        message:
                          "Here you can get rewards by completing tasks.",
                      })
                }
                preTitleDesc={
                  onboardingPopupFlow === "task"
                    ? ""
                    : t({
                        id: "xjvDVmZeA5U6qmKK1dTkuV-onboardingPopup",
                        message:
                          "You’ve already completed your first task by registering on site and got first 20 points.",
                      })
                }
                description={
                  onboardingPopupFlow === "task"
                    ? t({
                        id: "19Dt9WF1SYkNZh89QXePyD-onboardingPopup",
                        message:
                          "Congrats! 🎉 You've completed your first task and got points! Continue to get reward!",
                      })
                    : t({
                        id: "n1Q6bMAS5EGHa94Yb4xcPt-onboardingPopup",
                        message:
                          "To get rewards – climb the quest scoreboard by earning more points, the higher place – the bigger reward",
                      })
                }
                buttonText="Continue"
                cb={() => {
                  setSignUpTask({
                    ...signUpTask,
                    body: {
                      ...signUpTask.body,
                    },
                    status: ETaskStatus.DONE,
                  });
                  dispatch(
                    sendAnalyticsDataThunk({
                      type: "quest_task_done",
                      options: {
                        event_property_task_name: ETasks.REWARD_SIGN_UP,
                        event_property_task_points:
                          completedOnboardingTask.points,
                        event_property_quest_points_sum: 0,
                        event_property_task_id: completedOnboardingTask.id,
                        event_property_task_position: 0,
                        event_property_task_type: completedOnboardingTask.type,
                        event_property_tasks_done: 0,
                        event_property_tasks_remainig: 0,
                        event_property_quest_name: "Onboarding",
                        event_property_leaderboard_position: 0,
                      },
                      shouldRefetch: true,
                    }),
                  );
                }}
              />
            )}

          {currentTask === ETasks.YOUTUBE &&
            youtubeTask?.points &&
            youtubeTask?.id && (
              <VideoQuest
                data={youtubeTask}
                title={youtubeTask.body.onboardingTitle}
                description={youtubeTask.body.onboardingDescription}
                cb={() => {
                  setYoutubeTask({
                    ...youtubeTask,
                    body: {
                      ...youtubeTask.body,
                    },
                    status: ETaskStatus.DONE,
                  });

                  dispatch(
                    sendAnalyticsDataThunk({
                      type: "quest_task_done",
                      options: {
                        event_property_task_name: "Onboarding task",
                        event_property_task_points:
                          completedOnboardingTask.points,
                        event_property_quest_points_sum: 0,
                        event_property_task_id: completedOnboardingTask.id,
                        event_property_task_position: 0,
                        event_property_task_type: completedOnboardingTask.type,
                        event_property_tasks_done: 0,
                        event_property_tasks_remainig: 0,
                        event_property_quest_name: "Onboarding",
                        event_property_leaderboard_position: 0,
                      },
                      shouldRefetch: true,
                    }),
                  );
                }}
              />
            )}

          {currentTask === ETasks.COMPLETED_ONBOARDING &&
            signUpTask?.points &&
            youtubeTask?.points &&
            completedOnboardingTask && (
              <GetReward
                points={youtubeTask.points + signUpTask.points}
                preHead={t({
                  id: "26LicF2SC1MhhJkw2ygnTC-onboardingPopup",
                  message: "TOTAL",
                })}
                isDecor={true}
                taskId={completedOnboardingTask.id}
                title={completedOnboardingTask.title}
                description={completedOnboardingTask.body.description}
                buttonText={completedOnboardingTask.body.buttonText}
                cb={() => {
                  if (completedOnboardingTask.body.linkTitle) {
                    push(`/quest/${completedOnboardingTask.body.linkTitle}`);
                  }

                  dispatch(setIsOnboardingPopupOpen(false));
                  dispatch(setOnboardingPopupFlow("auth"));
                  setCompletedOnboardingTask({
                    ...completedOnboardingTask,
                    status: ETaskStatus.DONE,
                  });
                }}
              />
            )}
        </div>
      </Wrapper>
    </Modal>
  );
};

export default OnboardingPopup;
