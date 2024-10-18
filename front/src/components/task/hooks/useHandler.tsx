import { ELoyaltyTasks, ETaskStatus } from "@/models";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  taskStatus: ETaskStatus;
  taskType: ELoyaltyTasks;
  connectedDiscord?: string;
  connectedTelegram?: string;
  connectedTwitter?: string;
  projectExpiredStatus: any;
  accountConnected?: boolean;
  setLocalExpired: (value: SetStateAction<boolean>) => void;
  setLocalSoon: Dispatch<SetStateAction<boolean>>;
  setActiveStatus: (value: SetStateAction<number>) => void;
  startAt?: string;
}

const useHandler = ({
  taskStatus,
  taskType,
  connectedDiscord,
  connectedTelegram,
  connectedTwitter,
  projectExpiredStatus,
  accountConnected,
  setLocalExpired,
  setLocalSoon,
  setActiveStatus,
  startAt,
}: Props) => {
  useEffect(() => {
    setLocalExpired(
      taskStatus === ETaskStatus.EXPIRED || projectExpiredStatus.status,
    );
    setLocalSoon(
      Boolean(startAt) && new Date(startAt).getTime() > new Date().getTime(),
    );

    if (
      taskType !== ELoyaltyTasks.INVITE &&
      (taskStatus === ETaskStatus.DONE ||
        taskStatus === ETaskStatus.EXPIRED ||
        taskStatus === ETaskStatus.ADDITIONAL_PROGRAM) &&
      accountConnected
    ) {
      setActiveStatus(4);
      return;
    }

    // Invite Task

    if (taskType === ELoyaltyTasks.INVITE && taskStatus === ETaskStatus.DONE) {
      setActiveStatus(2);
    }

    if (
      ([ELoyaltyTasks.JOIN_DISCORD, ELoyaltyTasks.ROLE_DISCORD].includes(
        taskType,
      ) &&
        connectedDiscord) ||
      ([ELoyaltyTasks.JOIN_TELEGRAM].includes(taskType) && connectedTelegram) ||
      ([
        ELoyaltyTasks.FOLLOW_TWITTER,
        ELoyaltyTasks.MENTION_TWITTER,
        ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER,
        ELoyaltyTasks.RE_TWEET_TWITTER,
        ELoyaltyTasks.TWEET_TWITTER,
        ELoyaltyTasks.LIKE_TWEET_TWITTER,
        ELoyaltyTasks.COMMENT_TWEET_TWITTER,
      ].includes(taskType) &&
        connectedTwitter)
    ) {
      setActiveStatus(2);
      return;
    }
  }, [
    taskStatus,
    taskType,
    connectedDiscord,
    connectedTelegram,
    connectedTwitter,
    projectExpiredStatus,
    accountConnected,
    setLocalExpired,
    setActiveStatus,
    setLocalSoon,
    startAt,
  ]);
};

export default useHandler;
