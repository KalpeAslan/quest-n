import { ELoyaltyTasks, ETaskStatus } from "@/models";
import { useMemo } from "react";

interface Props {
  taskStatus: ETaskStatus;
  taskType: ELoyaltyTasks;
  taskRequired: boolean;
  accountConnected?: boolean;
  projectSoonStatus: boolean;
  projectExpiredStatus: any;
  localExpired: boolean;
  localSoon: boolean;
  localDone: boolean;
  startAt?: string;
  hasRequired?: boolean;
  quizPreDone: boolean;
}

const useStatus = ({
  taskStatus,
  taskType,
  accountConnected,
  projectSoonStatus,
  projectExpiredStatus,
  localExpired,
  localSoon,
  localDone,
  startAt,
  hasRequired,
  taskRequired,
  quizPreDone,
}: Props) => {
  const status: {
    isBlocked: boolean;
    isExpired: boolean;
    isDone: boolean;
    isActive: boolean;
    isSoon: boolean;
  } = useMemo(() => {
    const isExpired =
      taskStatus === ETaskStatus.EXPIRED ||
      projectExpiredStatus.status ||
      localExpired;

    const isBlocked =
      (!accountConnected ||
        projectSoonStatus ||
        (hasRequired && !taskRequired)) &&
      taskType !== ELoyaltyTasks.SIGN_UP &&
      !isExpired;

    const isDone =
      (taskStatus === ETaskStatus.DONE ||
        localDone ||
        (accountConnected && taskType === ELoyaltyTasks.SIGN_UP)) &&
      taskStatus !== ETaskStatus.ADDITIONAL_PROGRAM &&
      accountConnected &&
      !quizPreDone &&
      !isExpired &&
      !isBlocked;

    const isSoon =
      startAt &&
      new Date(startAt).getTime() >= new Date().getTime() &&
      localSoon &&
      !isExpired &&
      !isBlocked &&
      !isDone;

    const isActive =
      (accountConnected || taskType === ELoyaltyTasks.SIGN_UP) &&
      !isExpired &&
      !isBlocked &&
      !isDone &&
      !isSoon;

    return {
      isSoon,
      isExpired,
      isBlocked,
      isDone,
      isActive,
    };
  }, [
    taskStatus,
    projectExpiredStatus.status,
    localExpired,
    accountConnected,
    projectSoonStatus,
    hasRequired,
    taskRequired,
    taskType,
    localDone,
    quizPreDone,
    startAt,
    localSoon,
  ]);

  return status;
};

export default useStatus;
