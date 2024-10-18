import { authService, entryService, loyaltyService } from "@/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  ELoyaltyTasks,
  ETaskStatus,
  ILoyaltyTask,
  ITaskTrackingData,
  TSocialDataType,
} from "@/models";
import { IAccount } from "@/modules/account/models";
import {
  setIsRestrictionForCreationPopupOpen,
  setIsSocialAuthLoaded,
} from "@/modules/account/store/account.slice";
import { t } from "@lingui/macro";
import { Dispatch, SetStateAction, useMemo } from "react";
import { setLoading } from "@store/slices/system/system.slice";
import { accountApiEndpoints } from "@/modules/account/store/account.api";
import { getUserProfileThunk } from "@/modules/account/store/account.thunks";

interface Props {
  activeStatus: number;
  partnerProjectLink: any;
  inviteLink: any;
  username: any;
  mentionUserName: any;
  tweetText: any;
  tweetId: any;
  redirectLink: any;
  taskId: number;
  taskType: ELoyaltyTasks;
  accountInfo: IAccount;
  isUnlimited: boolean;
  getScores: () => Promise<void>;
  localPoints: number;
  localTasksData: ILoyaltyTask[];
  setLocalPoints: Dispatch<SetStateAction<number>>;
  setLocalTasksData: Dispatch<SetStateAction<ILoyaltyTask[]>>;
  trackIsDone: (data: ITaskTrackingData) => void;
  setActiveStatus: Dispatch<SetStateAction<number>>;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  setIsError: Dispatch<SetStateAction<boolean>>;
  activeStep: number;
  task: ILoyaltyTask;
  increaseErrorsCount: () => void;
  executeRecaptcha: () => Promise<string>;
}

const useProgress = ({
  activeStatus,
  partnerProjectLink,
  inviteLink,
  username,
  mentionUserName,
  tweetText,
  tweetId,
  redirectLink,
  taskId,
  taskType,
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
}: Props) => {
  const dispatch = useAppDispatch();

  const progresses = useMemo(
    () => ({
      quiz: [],
      visitLink: [],
      referralLink: [],
      suggestion: [],
      followTwitter: [
        {
          id: 1,
          name: t({
            id: "9oApzvD19M2i9VeRVtLo2J-task",
            message: "Connect",
          }),
          title: t({
            id: "3oWKQM8ThSxgx7rKCsw9qG-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));

              return;
            }

            try {
              await authService.confirmSocial("twitter", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "twitter",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({ id: "gT7N7VbhYgJGczaxmfcHJ6-task", message: "Follow" }),
          title: t({
            id: "he57FhHCBZo2qqNUYhg1DB-task",
            message: "Follow -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            window.open(
              `https://twitter.com/intent/follow?screen_name=${username}`,
              "_blank",
            );
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({
            id: "idVV1E1eL6ix9Uz6mqqchf-task",
            message: "Confirm",
          }),
          title: t({
            id: "nW4MKDePndn2CNe3MXik4s-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "4xDkBwJP7Rt3dnQgqG1heh-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      mentionTwitter: [
        {
          id: 1,
          name: t({
            id: "1KXHrnbmeZDPBzqsi24mhK-task",
            message: "Connect",
          }),
          title: t({
            id: "nREhVuPXDcmepaAbncGQpL-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));
              return;
            }

            try {
              await authService.confirmSocial("twitter", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "twitter",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({
            id: "e4BvoVaD4cwVm2K79aUxK8-task",
            message: "Mention",
          }),
          title: t({
            id: "eFLzgh59hDfrR78WcaEKCD-task",
            message: "Mention -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            window.open(
              `https://twitter.com/intent/tweet?text=@${mentionUserName}`,
              "_blank",
            );
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({ id: "uE9juUYApWbdB76fwTVq5Z-task", message: "Confirm" }),
          title: isUnlimited
            ? t({
                id: "b2qwMAN6cXjSZoJvjs8pU-task",
                message: "Confirm",
              })
            : t({
                id: "nvoZAar7QEwzXB2MFCvNSa-task",
                message: "Confirm",
              }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          action: isUnlimited
            ? async () => {
                try {
                  setIsLoaded(false);

                  const reCaptchaToken = await executeRecaptcha();

                  const { data: socialData } =
                    await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                      reCaptchaToken,
                    });

                  if (socialData.success.status) {
                    const index = localTasksData.findIndex(
                      (item: ILoyaltyTask) => taskId === item.id,
                    );
                    const item: ILoyaltyTask = localTasksData.splice(
                      index,
                      1,
                    )[0];
                    item.status = ETaskStatus.ADDITIONAL_PROGRAM;
                    item.body = {
                      ...item.body,
                      completedAt: socialData.success.body.completedAt,
                      additionalProgram:
                        socialData.success.body.additionalProgram,
                    };

                    setLocalTasksData([...localTasksData, item]);

                    const plus: number = item.body.additionalProgram
                      ? item.body.additionalProgram.totalEarned
                      : 0;

                    setLocalPoints(localPoints + plus);

                    setActiveStatus(4);
                    await getScores();

                    trackIsDone({
                      questPointsSum: localPoints + plus,
                    });

                    return;
                  }
                  increaseErrorsCount();
                  setIsError(true);
                  setErrorMessage(
                    t({
                      id: "m19XCLga2ziXFTfL6JQ4sy-task",
                      message: "Twitter task not completed",
                    }),
                  );
                  setActiveStatus(2);
                } catch (error: any) {
                  increaseErrorsCount();
                  setIsError(true);
                  setErrorMessage(
                    t({
                      id: "msXh1BfEBAEo6pCr8c7UED-task",
                      message: "Twitter task not completed",
                    }),
                  );
                  setActiveStatus(2);
                } finally {
                  setIsLoaded(true);
                }
              }
            : undefined,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "e4cQtfMY9kjhcWzUCuhV2V-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
        {
          id: 4,
          name: t({
            id: "21ycHmq37CcqhTDmre2Ttf-task",
            message: "Check tweet",
          }),
          title: t({
            id: "3UUJssatNfg3GdWPW5z82ad-task",
            message: " - Gain Likes and retweets",
          }),
          isActive: activeStatus === 4,
          isDone: activeStatus > 4,
        },
      ],
      tweetTwitter: [
        {
          id: 1,
          name: t({
            id: "uWvbQ339bwbtCb6yrzUDEW-task",
            message: "Connect",
          }),
          title: t({
            id: "sXPgag2HbUcaNa2hnmq8Bm-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));
              return;
            }

            try {
              await authService.confirmSocial("twitter", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "twitter",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({
            id: "9DbTmxo2jd1ebFZF6ZjdLH-task",
            message: "Tweet",
          }),
          title: t({
            id: "pRhLZaNSD2wV4kB3wcGmN9-task",
            message: "Tweet -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                tweetText,
              )}`,
              "_blank",
            );
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({ id: "jbKGHYufuYPSqGtdFVBjpM-task", message: "Confirm" }),
          title: t({
            id: "qD479kKWFSf6U1skhK3oqj-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "e4cQtfMY9kjhcWzUCuhV2V-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      reTweetTwitter: [
        {
          id: 1,
          name: t({
            id: "bTK5e2rHXcvjxQoBu8bbBz-task",
            message: "Connect",
          }),
          title: t({
            id: "icWLjKmU83j4ZqExMYccUL-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));
              return;
            }

            try {
              await authService.confirmSocial("twitter", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "twitter",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({
            id: "tVrHbwTLuJxLAirGBkPpfB-task",
            message: "Retweet",
          }),
          title: t({
            id: "h6nUWtFQko1nNbqwWKfmWc-task",
            message: "Retweet -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            const windowOpen = window.open(
              `https://twitter.com/twitter/status/${tweetId}`,
              "_blank",
            );
            windowOpen.location.href = `https://twitter.com/twitter/status/${tweetId}`;
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({
            id: "8ceBzQUXTNjBoqG57TBDpQ-task",
            message: "Confirm",
          }),
          title: t({
            id: "r2QQ4fE6AoaU35BgofZ2Yv-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "h274QFK2aSS2bqxuags4yv-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      reTweetQuoteTwitter: [
        {
          id: 1,
          name: t({
            id: "dcHyF9FgENcsmarqJnc9Qy-task",
            message: "Connect",
          }),
          title: t({
            id: "7SywakeaxRQVWrAm5x8wHh-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data?.error) {
              dispatch(setIsSocialAuthLoaded(true));
              return;
            }

            try {
              await authService.confirmSocial("twitter", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "twitter",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({
            id: "fpTLWXgsWtHdhQueBr6USw-task",
            message: "Retweet",
          }),
          title: t({
            id: "uSQttU5LkHPHQtd3CTTHet-task",
            message: "Retweet -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            window.open(
              `https://twitter.com/twitter/status/${tweetId}`,
              "_blank",
            );
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({
            id: "vd1ev3fXKsAhH2qqgGqXeo-task",
            message: "Confirm",
          }),
          title: t({
            id: "iudmYKh7d6WLiAH1sNy7MxX-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "bwztKveoWbbTJJ2YP96AGP-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(2);
          },
          action: isUnlimited
            ? async () => {
                try {
                  setIsLoaded(false);

                  const reCaptchaToken = await executeRecaptcha();

                  const { data: socialData } =
                    await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                      reCaptchaToken,
                    });

                  if (socialData.success.status) {
                    const index = localTasksData.findIndex(
                      (item: ILoyaltyTask) => taskId === item.id,
                    );
                    const item: ILoyaltyTask = localTasksData.splice(
                      index,
                      1,
                    )[0];
                    item.status = ETaskStatus.ADDITIONAL_PROGRAM;
                    item.body = {
                      ...item.body,
                      completedAt: socialData.success.body.completedAt,
                      additionalProgram:
                        socialData.success.body.additionalProgram,
                    };

                    setLocalTasksData([...localTasksData, item]);

                    const plus: number = item.body.additionalProgram
                      ? item.body.additionalProgram.totalEarned
                      : 0;

                    setLocalPoints(localPoints + plus);

                    setActiveStatus(4);
                    await getScores();

                    trackIsDone({
                      questPointsSum: localPoints + plus,
                    });

                    return;
                  }
                  increaseErrorsCount();
                  setIsError(true);
                  setErrorMessage(
                    t({
                      id: "2m6NdcY8JvNMJ9p746wVbn-task",
                      message: "Twitter task not completed",
                    }),
                  );
                  setActiveStatus(2);
                } catch (error: any) {
                  increaseErrorsCount();
                  setIsError(true);
                  setErrorMessage(
                    t({
                      id: "gFDB3FjgHfmASXokhZB5ox-task",
                      message: "Twitter task not completed",
                    }),
                  );
                  setActiveStatus(2);
                } finally {
                  setIsLoaded(true);
                }
              }
            : undefined,
        },
        {
          id: 4,
          name: t({
            id: "vix7J6chrWGUUPAUz9kTaM-task",
            message: "Check tweet",
          }),
          title: t({
            id: "pFrJtAucMdd2goPcjGnv7xt3-task",
            message: " - Gain Likes and retweets",
          }),
          isActive: activeStatus === 4,
          isDone: activeStatus > 4,
        },
      ],
      likeTweetTwitter: [
        {
          id: 1,
          name: t({
            id: "bUhhfcENwjmWkUKqCZtYvW-task",
            message: "Connect",
          }),
          title: t({
            id: "1tVjw67d6jEqZS4PxbbTu1-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));
              return;
            }

            try {
              await authService.confirmSocial("twitter", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "twitter",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({
            id: "dsfVrHbwTLuJxLAirGBkPpfB-task",
            message: "Like",
          }),
          title: t({
            id: "iuerUWtFQko1nNbqwWKfmWc-task",
            message: "Like -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            const windowOpen = window.open(
              `https://twitter.com/twitter/status/${tweetId}`,
              "_blank",
            );
            windowOpen.location.href = `https://twitter.com/twitter/status/${tweetId}`;
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({
            id: "fsBgDcD6U3ePrqz3AFRCnx-task",
            message: "Confirm",
          }),
          title: t({
            id: "r72LobpujQRNqrJfu9qJ6g-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "dHf5cZPqLEDfHKJ4wUon6Y-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      commentTweetTwitter: [
        {
          id: 1,
          name: t({
            id: "sdfhe2rHXcvjxQoBu8bbBz-task",
            message: "Connect",
          }),
          title: t({
            id: "tGfc7QAtLTJbLWytbkx1V7-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));
              return;
            }

            try {
              await authService.confirmSocial("twitter", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "twitter",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({
            id: "p83faGpXwb6ovqEMWkC67d-task",
            message: "Comment",
          }),
          title: t({
            id: "eEKmocthdEKPXqBKkiBzwV-task",
            message: "Comment -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            const windowOpen = window.open(
              `https://twitter.com/twitter/status/${tweetId}`,
              "_blank",
            );
            windowOpen.location.href = `https://twitter.com/twitter/status/${tweetId}`;
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({
            id: "sfpT9CYQmxdQwwCCFD4TvT-task",
            message: "Confirm",
          }),
          title: t({
            id: "dMEffaVRAFD8fFy3fTGeG5-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "ijuQ1NzRB8QZR8BcPrCHJx-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      checkSpaceTwitter: [
        {
          id: 1,
          name: t({ id: "qVgU6K8k87ErTapsbV6bd4-task", message: "Join" }),
          title: t({
            id: "eNkQsW7fgL63sb3Wauwnau-task",
            message: "Join -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: () => {
            window.open(redirectLink);
            setActiveStatus(2);
          },
        },
        {
          id: 2,
          name: t({
            id: "sNiMXLA98JaW7BAF1w7ATe-task",
            message: "Confirm",
          }),
          title: t({
            id: "ir8MjYReUWZ3hYPTRXdrAF-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "c1NBgk4E1K3kbkyuBS9MSP-task",
                message: "Twitter task not completed",
              }),
            );
            setActiveStatus(1);
          },
        },
      ],
      joinDiscord: [
        {
          id: 1,
          name: t({
            id: "iR5j4FxDPU44h3Yw6CUZUj-task",
            message: "Connect",
          }),
          title: t({
            id: "vcXLJSrCKGDYzb1m6UX4an-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));
            }

            try {
              await entryService.postSocialsConfirm("discord", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "discord",
                    username: username,
                  }),
                );

                return;
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({ id: "eRUMCXkAbU7PhJjdU2EPYb-task", message: "Join" }),
          title: t({
            id: "4wuegVz4gTyRXtq2UTzoT3-task",
            message: "Join -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            window.open(inviteLink, "_blank");
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({
            id: "oqJFotKmQLiP91UHudTVEG-task",
            message: "Confirm",
          }),
          title: t({
            id: "evFgpSSz7WRh9nVk2VduFg-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: async error => {
            if (
              error?.response?.message === "discord refresh token error" ||
              error?.body === "discord refresh token error"
            ) {
              dispatch(
                setIsRestrictionForCreationPopupOpen({
                  open: true,
                  type: "discord-disconnected",
                  username: "",
                }),
              );

              await dispatch(accountApiEndpoints.getUserProfile.initiate(null));
            }
            setErrorMessage(
              t({
                id: "h5qpXgx2PTb3PjgNKYGmqC-task",
                message: "Discord task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      roleDiscord: [
        {
          id: 1,
          name: t({
            id: "8WLyrge4jMKNhMgYSoQhZv-task",
            message: "Connect",
          }),
          title: t({
            id: "rQNZCBkeV21ggnvyxx2Caa-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async (data: TSocialDataType) => {
            if (!accountInfo || data.error) {
              dispatch(setIsSocialAuthLoaded(true));

              return;
            }

            try {
              await entryService.postSocialsConfirm("discord", data);

              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "discord",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({ id: "rmFjrCM1DSzeASCzyQBNhq-task", message: "Done" }),
          title: t({ id: "htcmL2dMJ4PjNAr2g8x6Zq-task", message: "Done" }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          errorHandler: async error => {
            if (
              error?.response?.message === "discord refresh token error" ||
              error?.body === "discord refresh token error"
            ) {
              dispatch(
                setIsRestrictionForCreationPopupOpen({
                  open: true,
                  type: "discord-disconnected",
                  username: "",
                }),
              );

              await dispatch(
                accountApiEndpoints.getUserProfile.initiate(null, {
                  forceRefetch: true,
                }),
              );
            }

            setErrorMessage(
              t({
                id: "vvPE7NaV6twPPPBCzUJ9Yq-task",
                message: "Discord task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      joinTelegram: [
        {
          id: 1,
          name: t({
            id: "rqFV52yREUnkGxLdiggcRQ-task",
            message: "Connect",
          }),
          title: t({
            id: "sHNZVe79UxaRJacYmoLQpC-task",
            message: "Connect -",
          }),
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          action: async () => {
            if (!accountInfo) {
              dispatch(setIsSocialAuthLoaded(true));

              return;
            }

            try {
              await dispatch(getUserProfileThunk());
            } catch (error: any) {
              const { response } = error;

              if (response.status === 409) {
                const { username } = response.data;

                dispatch(
                  setIsRestrictionForCreationPopupOpen({
                    open: true,
                    type: "telegram",
                    username: username,
                  }),
                );
              }
            } finally {
              dispatch(setIsSocialAuthLoaded(true));
            }
          },
        },
        {
          id: 2,
          name: t({ id: "vadaXPTW77LiLZUvQ6Yx9j-task", message: "Join" }),
          title: t({
            id: "ax5kox5tREmNBfwKdBoWi5-task",
            message: "Join -",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          action: () => {
            window.open(inviteLink, "_blank");
            setActiveStatus(3);
          },
        },
        {
          id: 3,
          name: t({
            id: "tofjSyLzdbL3k8V4H3PBBZ-task",
            message: "Confirm",
          }),
          title: t({
            id: "kRcUh6F8N1Co2k4QRjSFkZ-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 3,
          isDone: activeStatus > 3,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "byMV5cHHJRajbWZuqyrPTZ-task",
                message: "Telegram task not completed",
              }),
            );
            setActiveStatus(2);
          },
        },
      ],
      medium: [],
      email: [],
      partner: [
        {
          id: 1,
          name: t({
            id: "3PPcYXefnRE1UyvQriHdcY-task",
            message: "Go to project",
          }),
          title: t({
            id: "cXcMixkx7uXaMwAP7wpq5Y-task",
            message: "Perform -",
          }),
          action: () => {
            window.open(`/quest/${partnerProjectLink}`);

            setActiveStatus(2);
          },
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
        },
        {
          id: 2,
          name: t({
            id: "sDyoG3jESPuLk3bi4mjJdz-task",
            message: "Confirm",
          }),
          title: t({
            id: "8usnML9L9FsdwUUMMp1Rtu-task",
            message: "Confirm",
          }),
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "udygusmo1FhT1utFj8EggJ-task",
                message:
                  "You have completed not enough tasks in the partner’s project",
              }),
            );
            setActiveStatus(1);
          },
        },
      ],
      token: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "da66c3d4-e5c9-11ed-a05b-0242ac120003",
                message: "Token Task is not completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                const plus: number = item.body.additionalProgram
                  ? item.body.additionalProgram.totalEarned
                  : 0;

                setLocalPoints(localPoints + plus);

                setActiveStatus(2);
                await getScores();

                trackIsDone({
                  questPointsSum: localPoints + plus,
                });

                return;
              }
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "da66c3d4-e5c9-11ed-a05b-0242ac120003",
                  message: "Token Task is not completed",
                }),
              );
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "da66c3d4-e5c9-11ed-a05b-0242ac120003",
                  message: "Token Task is not completed",
                }),
              );
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
      nft: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "a66c7ee-e5c9-11ed-a05b-0242ac120003",
                message: "NFT Task is not completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                const plus: number = item.body.additionalProgram
                  ? item.body.additionalProgram.totalEarned
                  : 0;

                setLocalPoints(localPoints + plus);

                setActiveStatus(2);
                await getScores();

                trackIsDone({
                  questPointsSum: localPoints + plus,
                });

                return;
              }
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "a66c7ee-e5c9-11ed-a05b-0242ac120003",
                  message: "NFT Task is not completed",
                }),
              );
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "a66c7ee-e5c9-11ed-a05b-0242ac120003",
                  message: "NFT Task is not completed",
                }),
              );
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
      blockchainUser: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "20b8c6aa-e8fb-11ed-a05b-0242ac120003",
                message: "Blockchain User Task is not completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                const plus: number = item.body.additionalProgram
                  ? item.body.additionalProgram.totalEarned
                  : 0;

                setLocalPoints(localPoints + plus);

                setActiveStatus(2);
                await getScores();

                trackIsDone({
                  questPointsSum: localPoints + plus,
                });

                return;
              }

              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "20b8c6aa-e8fb-11ed-a05b-0242ac120003",
                  message: "Blockchain User Task is not completed",
                }),
              );
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "20b8c6aa-e8fb-11ed-a05b-0242ac120003",
                  message: "Blockchain User Task is not completed",
                }),
              );
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
      valueHolder: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "20b8c52e-e8fb-11ed-a05b-0242ac120003",
                message: "Value Holder Task is not completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                const plus: number = item.body.additionalProgram
                  ? item.body.additionalProgram.totalEarned
                  : 0;

                setLocalPoints(localPoints + plus);

                await getScores();

                trackIsDone({
                  questPointsSum: localPoints + plus,
                });

                return;
              }

              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "20b8c52e-e8fb-11ed-a05b-0242ac120003",
                  message: "Value Holder Task is not completed",
                }),
              );
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "20b8c52e-e8fb-11ed-a05b-0242ac120003",
                  message: "Value Holder Task is not completed",
                }),
              );
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
      nativeHolder: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "20b8c254-e8fb-11ed-a05b-0242ac120003",
                message: "Native Holder Task is not completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                const plus: number = item.body.additionalProgram
                  ? item.body.additionalProgram.totalEarned
                  : 0;

                setLocalPoints(localPoints + plus);

                setActiveStatus(2);
                await getScores();

                trackIsDone({
                  questPointsSum: localPoints + plus,
                });

                return;
              }

              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "20b8c254-e8fb-11ed-a05b-0242ac120003",
                  message: "Native Holder Task is not completed",
                }),
              );
              setActiveStatus(2);
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "20b8c254-e8fb-11ed-a05b-0242ac120003",
                  message: "Native Holder Task is not completed",
                }),
              );
              setActiveStatus(2);
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
      dexLiquidityProvider: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "e02dcc9c-0a84-11ee-be56-0242ac120002",
                message: "Task Not Completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                const plus: number = item.body.additionalProgram
                  ? item.body.additionalProgram.totalEarned
                  : 0;

                setLocalPoints(localPoints + plus);

                setActiveStatus(2);
                await getScores();

                trackIsDone({
                  questPointsSum: localPoints + plus,
                });

                return;
              }

              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "e02dc6a2-0a84-11ee-be56-0242ac120002",
                  message: "Task Not Completed",
                }),
              );
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "e02dc3d2-0a84-11ee-be56-0242ac120002",
                  message: "Task Not Completed",
                }),
              );
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
      allBridge: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "e02dcc9c-0a84-11ee-be56-0242ac120002",
                message: "Task Not Completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                const plus: number = item.body.additionalProgram
                  ? item.body.additionalProgram.totalEarned
                  : 0;

                setLocalPoints(localPoints + plus);

                setActiveStatus(2);
                await getScores();

                trackIsDone({
                  questPointsSum: localPoints + plus,
                });

                return;
              }

              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "e02dc6a2-0a84-11ee-be56-0242ac120002",
                  message: "Task Not Completed",
                }),
              );
              setActiveStatus(2);
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "e02dc3d2-0a84-11ee-be56-0242ac120002",
                  message: "Task Not Completed",
                }),
              );
              setActiveStatus(2);
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
      daily: [
        {
          id: 1,
          name: "Daily Task",
          title: "Daily Task -",
          isDisabled:
            task.body.subTasks &&
            task.body.subTasks[activeStep].status !== "active",
          isActive:
            task.body.subTasks &&
            task.body.subTasks[activeStep].status === "active",
          isDone: false,
          action: undefined,
        },
        {
          id: 2,
          name: "On Review",
          title: "On Review - ",
          isDisabled:
            task.body.subTasks &&
            task.body.subTasks[activeStep].status !== "onReview",
          isActive:
            task.body.subTasks &&
            task.body.subTasks[activeStep].status === "onReview",
          isDone: false,
          action: () => {},
        },
        {
          id: 3,
          name:
            task.body.subTasks &&
            computeDailyTaskStepStatusText(
              task.body.subTasks[activeStep].status,
            ),
          title:
            task.body.subTasks &&
            computeDailyTaskStepStatusText(
              task.body.subTasks[activeStep].status,
            ),
          isDisabled:
            task.body.subTasks &&
            ["active", "onReview"].includes(
              task.body.subTasks[activeStep].status,
            ),
          isError:
            task.body.subTasks &&
            ["rejected", "expired"].includes(
              task.body.subTasks[activeStep].status,
            ),
          isActive: false,
          isDone:
            task.body.subTasks &&
            task.body.subTasks[activeStep].status === "confirmed",
          action: undefined,
          errorHandler: undefined,
        },
      ],
      invite: [
        {
          id: 1,
          name: "Referral",
          title: "Connect - ",
          isDisabled: false,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          isError: false,
          action: async () => {
            try {
              setIsLoaded(false);

              const reCaptchaToken = await executeRecaptcha();

              const { data } = await loyaltyService.postLoyaltyTaskCompleted(
                taskId,
                { reCaptchaToken },
              );

              if (data.success.status) {
                setActiveStatus(2);
                await getScores();
                return;
              }

              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "2m6NdcY8JvNMJ9p746wVbn-task",
                  message: "Twitter task not completed",
                }),
              );
              setActiveStatus(2);
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "gFDB3FjgHfmASXokhZB5ox-task",
                  message: "Twitter task not completed",
                }),
              );
              setActiveStatus(2);
            } finally {
              setIsLoaded(true);
            }
          },
        },
        {
          id: 2,
          name: "In Review",
          title: "In Review - ",
          isDisabled: false,
          isActive: activeStatus === 2,
          isDone: activeStatus > 2,
          isError: false,
        },
        {
          id: 3,
          name: "Approved",
          title: "Approved",
          isDisabled: false,
          isActive: activeStatus === 2,
          isDone: activeStatus > 3,
          isError: false,
        },
      ],
      customWebhook: [],
      imageUpload: [],
      // not done
      multipleSuggestion: [],
      // outdated
      sequence: [],
      watchVideo: [],
      signUp: [],
      // shouldn't be visible
      completedOnboarding: [],
      gitCoin: [
        {
          id: 1,
          isActive: activeStatus === 1,
          isDone: activeStatus > 1,
          errorHandler: () => {
            setErrorMessage(
              t({
                id: "e02dcc9c-0a84-11ee-be56-0242ac120002",
                message: "Task Not Completed",
              }),
            );
            setActiveStatus(1);
          },
          action: async () => {
            try {
              setIsLoaded(false);
              dispatch(setLoading(true));

              const reCaptchaToken = await executeRecaptcha();

              const { data: data } =
                await loyaltyService.postLoyaltyTaskCompleted(taskId, {
                  reCaptchaToken,
                });

              if (data.success.status) {
                const index = localTasksData.findIndex(
                  (item: ILoyaltyTask) => taskId === item.id,
                );
                const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
                item.status = ETaskStatus.DONE;
                item.body = {
                  ...item.body,
                  completedAt: data.success.body.completedAt,
                };

                setLocalPoints(localPoints);

                setActiveStatus(2);
                await getScores();

                trackIsDone({
                  questPointsSum: localPoints,
                });

                return;
              }

              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "e02dc6a2-0a84-11ee-be56-0242ac120002",
                  message: "Task Not Completed",
                }),
              );
              setActiveStatus(2);
            } catch (error: any) {
              increaseErrorsCount();
              setIsError(true);
              setErrorMessage(
                t({
                  id: "e02dc3d2-0a84-11ee-be56-0242ac120002",
                  message: "Task Not Completed",
                }),
              );
              setActiveStatus(2);
            } finally {
              setIsLoaded(true);
              dispatch(setLoading(false));
            }
          },
        },
      ],
    }),
    [
      activeStatus,
      isUnlimited,
      activeStep,
      accountInfo,
      dispatch,
      username,
      setActiveStatus,
      setErrorMessage,
      mentionUserName,
      setIsLoaded,
      executeRecaptcha,
      taskId,
      increaseErrorsCount,
      setIsError,
      localTasksData,
      setLocalTasksData,
      setLocalPoints,
      localPoints,
      getScores,
      trackIsDone,
      tweetText,
      tweetId,
      redirectLink,
      inviteLink,
      partnerProjectLink,
      task,
    ],
  );

  const progress = useMemo(() => progresses[taskType], [progresses, taskType]);

  return progress;
};

const computeDailyTaskStepStatusText = taskStatus => {
  if (!["rejected", "expired", "confirmed"].includes(taskStatus))
    return "Result";

  switch (taskStatus) {
    case "rejected":
      return "Task Rejected";
    case "expired":
      return "Time is over";
    case "confirmed":
      return "Task Approved";
  }
};

export default useProgress;
