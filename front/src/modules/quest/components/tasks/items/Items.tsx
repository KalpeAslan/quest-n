import React, { Dispatch, FC, SetStateAction, useRef, useState } from "react";

import {
  ILoyaltyTask,
  ITaskTrackingData,
  ETaskStatus,
  ITaskMainTrackingData,
} from "@models";

import { Wrapper } from "./items.styles";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { loyaltyService } from "@/api";
import { Task } from "@/components/task";
import {
  ECreateQuestSteps,
  StickyMenuInvestorInfo,
} from "@modules/quest/models";
import ReCAPTCHA from "react-google-recaptcha";
import { appConfig } from "@/app.config";
import { getDoneTasksCount } from "@/modules/quest/helpers/tasks";

type ItemsProps = {
  tasks: ILoyaltyTask[];
  projectSoonStatus: boolean;
  projectExpiredStatus: any;
  localTasksData: ILoyaltyTask[];
  localPoints: number;
  setLocalTasksData: React.Dispatch<React.SetStateAction<ILoyaltyTask[]>>;
  setLocalPoints: React.Dispatch<React.SetStateAction<number>>;
  getScores: () => Promise<void>;
  questName: string;
  projectId: string;
  setProjectInvestorInfo: React.Dispatch<
    React.SetStateAction<StickyMenuInvestorInfo>
  >;
  setUserPlace: React.Dispatch<React.SetStateAction<number>>;
  hasRequired?: boolean;
  preview: boolean;
  fullPreview: boolean;
  step: ECreateQuestSteps;
  setTasksDoneCount: Dispatch<SetStateAction<number>>;
};

const Items: FC<ItemsProps> = ({
  tasks,
  projectSoonStatus,
  projectExpiredStatus,
  localTasksData,
  localPoints,
  setLocalTasksData,
  setLocalPoints,
  getScores,
  questName,
  projectId,
  setProjectInvestorInfo,
  setUserPlace,
  hasRequired,
  preview,
  fullPreview,
  step,
  setTasksDoneCount,
}) => {
  const recaptchaRef = useRef<ReCAPTCHA>();

  const dispatch = useAppDispatch();

  const [openedErrorBlock, setOpenedErrorBlock] = useState<null | number>(null);
  const [shouldResetLoading, setShouldResetLoading] = useState<boolean>(false);

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
      const tasksDone = getDoneTasksCount(tasks);

      const tasksRemaining = tasks.reduce((acc, item) => {
        if (
          item.status === ETaskStatus.DONE ||
          item.status === ETaskStatus.EXPIRED
        ) {
          return acc;
        }
        return acc + 1;
      }, 0);

      const { data } = await loyaltyService.getLoyaltyProjectData(projectId);
      const { data: projectInvestorInfo } =
        await loyaltyService.getLoyaltyProjectInvestorInfo(projectId);
      setProjectInvestorInfo(projectInvestorInfo);
      setLocalPoints(projectInvestorInfo.earnedPoints);
      setUserPlace(projectInvestorInfo.scoreboard.place);
      setTasksDoneCount(getDoneTasksCount(data.loyaltyTasks));

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
              event_property_quest_name: questName,
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
              event_property_quest_name: questName,
              event_property_leaderboard_position:
                projectInvestorInfo.scoreboard.place,
            },
            shouldRefetch: true,
          }),
        );
      }
    };

  return (
    <Wrapper
      className={
        preview &&
        step === ECreateQuestSteps.Rewards &&
        !fullPreview &&
        "tasks_list"
      }
      preview={preview}
    >
      {tasks.length > 0 &&
        tasks.map((task: ILoyaltyTask, index) => {
          const trackIsDone = trackTaskDone({
            taskName: task.title,
            taskPoints: task.points,
            taskType: task.type,
            taskId: task.id,
            taskPosition: index,
            taskData: task,
          });

          return (
            <Task
              preview={preview}
              fullPreview={fullPreview}
              key={task.id}
              task={task}
              openedErrorBlock={openedErrorBlock}
              setOpenedErrorBlock={setOpenedErrorBlock}
              projectSoonStatus={projectSoonStatus}
              projectExpiredStatus={projectExpiredStatus}
              localTasksData={localTasksData}
              localPoints={localPoints}
              setLocalTasksData={setLocalTasksData}
              setLocalPoints={setLocalPoints}
              trackIsDone={trackIsDone}
              getScores={getScores}
              hasRequired={hasRequired}
              shouldResetLoading={shouldResetLoading}
              setShouldResetLoading={setShouldResetLoading}
              questName={questName}
            />
          );
        })}

      {appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC && (
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey={appConfig.NEXT_PUBLIC_APP_RECAPTCHA_INVISIBLE_PUBLIC}
        />
      )}
    </Wrapper>
  );
};

export default Items;
