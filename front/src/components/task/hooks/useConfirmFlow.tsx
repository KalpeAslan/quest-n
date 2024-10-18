import { loyaltyService } from "@/api";
import { ETaskStatus, ILoyaltyTask, ITaskTrackingData } from "@/models";
import { LoggerService } from "@/services";
import { Dispatch, SetStateAction, useCallback } from "react";

interface Props {
  getScores: () => Promise<void>;
  localPoints: number;
  localTasksData: ILoyaltyTask[];
  setLocalPoints: Dispatch<SetStateAction<number>>;
  setLocalTasksData: Dispatch<SetStateAction<ILoyaltyTask[]>>;
  taskId: number;
  trackIsDone: (data: ITaskTrackingData) => void;
  handleError: (error?: any) => void;
  setIsLoaded: Dispatch<SetStateAction<boolean>>;
  setActiveStatus: Dispatch<SetStateAction<number>>;
  setLocalDone: Dispatch<SetStateAction<boolean>>;
  executeRecaptcha: () => Promise<string>;
}

const useConfirmFlow = ({
  getScores,
  localPoints,
  localTasksData,
  setLocalPoints,
  setLocalTasksData,
  taskId,
  trackIsDone,
  handleError,
  setIsLoaded,
  setActiveStatus,
  setLocalDone,
  executeRecaptcha,
}: Props) => {
  const confirmFlow = useCallback(
    async (callback?: any) => {
      try {
        setIsLoaded(false);

        const reCaptchaToken = await executeRecaptcha();

        const { data: socialData } =
          await loyaltyService.postLoyaltyTaskCompleted(taskId, {
            reCaptchaToken,
          });

        if (socialData.success.status) {
          const index = localTasksData.findIndex(
            (task: ILoyaltyTask) => task.id === taskId,
          );
          const item: ILoyaltyTask = localTasksData.splice(index, 1)[0];
          item.status = ETaskStatus.DONE;
          item.body = {
            ...item.body,
            completedAt: socialData.success.body.completedAt,
          };

          setLocalTasksData([...localTasksData, item]);

          setLocalPoints(localPoints + item.points);

          setActiveStatus(4);
          setLocalDone(true);
          await getScores();

          trackIsDone({
            questPointsSum: localPoints + item.points,
          });

          Boolean(callback) && typeof callback === "function" && callback();

          return;
        }

        handleError(socialData.success);
      } catch (error: any) {
        handleError(error);
        LoggerService.error("Error during referral task response", error);
      } finally {
        setIsLoaded(true);
      }
    },
    [
      setIsLoaded,
      executeRecaptcha,
      taskId,
      handleError,
      localTasksData,
      setLocalTasksData,
      setLocalPoints,
      localPoints,
      setActiveStatus,
      setLocalDone,
      getScores,
      trackIsDone,
    ],
  );

  return confirmFlow;
};

export default useConfirmFlow;
