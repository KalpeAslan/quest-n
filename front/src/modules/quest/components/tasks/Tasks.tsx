import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { t, Trans } from "@lingui/macro";
import classnames from "classnames";
import { Box } from "@mui/material";
import { cloneDeep } from "lodash";
import { DateTime } from "luxon";

import { Scroll } from "@components/UI/scroll";
import { ELoyaltyTasks, ETaskStatus, ILoyaltyTask } from "@models";

import { Items } from "./items";

import {
  ECreateQuestSteps,
  ILoyaltyMultipleSuggestion,
  ILoyaltyProject,
  StickyMenuInvestorInfo,
} from "../../models";
import { useTypedSelector } from "@hooks/useTypedSelector";
import { getAccountInfo } from "../../../account/store/account.selector";
import { ConnectAccount } from "../connectAccount";
import { FilterWrapper } from "./tasks.styles";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import { getCurrentItemIndex } from "@/components/task/task.utils";

type Props = {
  projectData: ILoyaltyProject | null;
  localTasksData: ILoyaltyTask[];
  localPoints: number;
  projectSoonStatus: boolean;
  projectExpiredStatus: any;
  setLocalTasksData: React.Dispatch<React.SetStateAction<ILoyaltyTask[]>>;
  setLocalPoints: React.Dispatch<React.SetStateAction<number>>;
  getScores: () => Promise<void>;
  projectId: string;
  setProjectInvestorInfo: React.Dispatch<
    React.SetStateAction<StickyMenuInvestorInfo>
  >;
  setUserPlace: React.Dispatch<React.SetStateAction<number>>;
  preview: boolean;
  fullPreview: boolean;
  step: ECreateQuestSteps;
  setTasksDoneCount: Dispatch<SetStateAction<number>>;
};

enum ETaskType {
  ALL_TASK = "All tasks",
  ACTIVE = "Active",
  DONE = "Done",
}

interface ITask {
  id: number;
  value: ETaskType;
  title: string;
}

const getTaskStatus = (task: ILoyaltyTask) => {
  if (task.type === ELoyaltyTasks.DAILY && task.body?.subTasks) {
    const activeStep = getCurrentItemIndex(task.body.subTasks);

    if (
      task.body.subTasks[activeStep].status === "expired" ||
      task.body.subTasks[activeStep].status === "rejected"
    ) {
      return ETaskStatus.EXPIRED;
    } else if (task.body.subTasks[activeStep].status === "confirmed") {
      return ETaskStatus.DONE;
    }
  }

  if (task.type === ELoyaltyTasks.INVITE && task.status === ETaskStatus.DONE)
    return ETaskStatus.ACTIVE;

  return task.status;
};

const Tasks = ({
  projectData,
  localTasksData,
  localPoints,
  projectSoonStatus,
  projectExpiredStatus,
  setLocalTasksData,
  setLocalPoints,
  getScores,
  projectId,
  setProjectInvestorInfo,
  setUserPlace,
  preview,
  fullPreview,
  step,
  setTasksDoneCount,
}: Props) => {
  const { asPath } = useRouter();
  const [tasks, setTasks] = useState<ILoyaltyTask[]>([]);
  const [sortOrder, setSortOrder] = useState<number[]>([]);

  const dispatch = useAppDispatch();

  const filterTypes: ITask[] = [
    {
      id: 1,
      value: ETaskType.ALL_TASK,
      title: t({ id: "7T7MJm1zeu6JeTiSNvW5n2-quest", message: "All tasks" }),
    },
    {
      id: 2,
      value: ETaskType.ACTIVE,
      title: t({ id: "7F5yu3Lhfut1fkNkT6Cdd6-quest", message: "Active" }),
    },
    {
      id: 3,
      value: ETaskType.DONE,
      title: t({ id: "fihtvodAS5B1NhxgN2ZQ48-quest", message: "Done" }),
    },
  ];

  const [activeFilter, setActiveFilter] = useState<ETaskType>(
    ETaskType.ALL_TASK,
  );

  const accountInfo = useTypedSelector(getAccountInfo);

  const filterTasks = useCallback(
    (tasksData: ILoyaltyTask[]) => {
      if (activeFilter === ETaskType.ALL_TASK) {
        return tasksData;
      }

      if (activeFilter === ETaskType.ACTIVE) {
        return tasksData.filter(
          task =>
            task.status === ETaskStatus.ACTIVE ||
            task.type === ELoyaltyTasks.INVITE,
        );
      }

      if (activeFilter === ETaskType.DONE) {
        return tasksData.filter(
          task =>
            task.status === ETaskStatus.DONE &&
            task.type !== ELoyaltyTasks.INVITE,
        );
      }

      return [];
    },
    [activeFilter],
  );

  const getTasksSortOrder = useCallback(
    (tasksData: ILoyaltyTask[]) => {
      const localTasks: ILoyaltyTask[] = [];

      tasksData.forEach((task: ILoyaltyTask) => {
        if (task.status === "multipleDone") {
          let isExpired = false;

          if (task.endAt) {
            const currentDate = DateTime.now().toUnixInteger();

            isExpired =
              currentDate > DateTime.fromISO(task.endAt).toUnixInteger();
          }

          if (!task.endAt && projectData?.endAt) {
            const currentDate = DateTime.now().toUnixInteger();

            isExpired =
              currentDate >
              DateTime.fromISO(projectData?.endAt).toUnixInteger();
          }

          if (!task.body.suggestions && !isExpired) {
            const taskItem = cloneDeep(task);
            taskItem["multipleStatus"] = ETaskStatus.ACTIVE;

            if (task.startAt !== null || task.endAt !== null) {
              localTasks.push({ ...taskItem, status: ETaskStatus.ACTIVE });
            }
          }

          if (
            task.body.suggestions &&
            task.body.suggestions.length > 0 &&
            task.body.attempts
          ) {
            const isDone = task.body.suggestions?.find(
              (task: ILoyaltyMultipleSuggestion) =>
                task.status === "confirmed" || task.status === "rejected",
            );

            if (isDone) {
              const taskItem = cloneDeep(task);
              taskItem["multipleStatus"] = ETaskStatus.DONE;

              localTasks.push({ ...taskItem, status: ETaskStatus.DONE });
            }

            const isOnReview = task.body.suggestions?.find(
              (task: ILoyaltyMultipleSuggestion) => task.status === "onReview",
            );

            if (
              (isOnReview ||
                task.body.suggestions.length < task.body.attempts) &&
              !isExpired
            ) {
              const taskItem = cloneDeep(task);
              taskItem["multipleStatus"] = ETaskStatus.ACTIVE;

              if (task.startAt !== null || task.endAt !== null) {
                localTasks.push({ ...taskItem, status: ETaskStatus.ACTIVE });
              }
            }
          }

          return;
        }

        localTasks.push(task);
      });

      localTasks.sort((a, b) => {
        const aStatus = getTaskStatus(a);
        let bStatus = getTaskStatus(b);

        if (
          a.type === ELoyaltyTasks.SIGN_UP &&
          aStatus !== ETaskStatus.EXPIRED &&
          aStatus !== ETaskStatus.DONE
        ) {
          return -1;
        }

        if (
          b.type === ELoyaltyTasks.SIGN_UP &&
          bStatus !== ETaskStatus.EXPIRED &&
          bStatus !== ETaskStatus.DONE
        ) {
          return 1;
        }

        if (
          aStatus === ETaskStatus.EXPIRED &&
          bStatus !== ETaskStatus.EXPIRED
        ) {
          return 1;
        }

        if (
          aStatus !== ETaskStatus.EXPIRED &&
          bStatus === ETaskStatus.EXPIRED
        ) {
          return -1;
        }

        if (aStatus === ETaskStatus.DONE && bStatus !== ETaskStatus.DONE) {
          return 1;
        }

        if (aStatus !== ETaskStatus.DONE && bStatus === ETaskStatus.DONE) {
          return -1;
        }

        if (a.required && !b.required) return -1;
        if (!a.required && b.required) return 1;

        if (a.sortOrder < b.sortOrder) {
          if (!a.sortOrder) return 1;
          return -1;
        }

        if (a.sortOrder > b.sortOrder) {
          if (!b.sortOrder) return -1;
          return 1;
        }

        if (a.points < b.points) {
          return -1;
        }

        if (a.points > b.points) {
          return 1;
        }

        if (a.id > b.id) {
          return -1;
        }

        if (a.id < b.id) {
          return 1;
        }

        return 0;
      });

      return localTasks.map(item => item.id);
    },
    [projectData?.endAt],
  );

  const sortTasks = useCallback(
    (tasksData: ILoyaltyTask[]) => {
      return [...tasksData].sort(
        (a, b) => sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id),
      );
    },
    [sortOrder],
  );

  useEffect(() => {
    if (!sortOrder.length) {
      setSortOrder(getTasksSortOrder(localTasksData));
    }
  }, [getTasksSortOrder, localTasksData, sortOrder.length]);

  useEffect(() => {
    setTasks(sortTasks(filterTasks(localTasksData)));
  }, [filterTasks, localTasksData, sortTasks]);

  useEffect(() => {
    if (projectData.loyaltyTasks && preview) {
      setTasks(projectData.loyaltyTasks);
    }
  }, [projectData.loyaltyTasks, preview]);

  const hasRequired = useMemo(
    () =>
      tasks.some(
        item => item.required && getTaskStatus(item) !== ETaskStatus.DONE,
      ),
    [tasks],
  );

  const renderContent = () => {
    return (
      <>
        {!accountInfo?.connected &&
          projectData &&
          projectData.title !== "AlphaGuilty" && (
            <ConnectAccount
              title={t({
                id: "94sbbfWwGJLsHZpy8Qkaqa-quest",
                message:
                  "Tasks are disabled, to make them available, please login",
              })}
              redirectUrl={asPath}
            />
          )}

        {projectData && (!preview || fullPreview) && (
          <FilterWrapper preview={preview || fullPreview} component="section" mb={1.5}>
            <div className="filter-content">
              <Scroll
                overflowBehavior={{ x: "scroll", y: "hidden" }}
                type="table"
              >
                <ul className="filter">
                  {filterTypes.map(type => (
                    <li key={type.id}>
                      <button
                        className={classnames(
                          "filter-item",
                          {
                            ["filter-item-active"]: activeFilter === type.value,
                          },
                          "c-font-16-20",
                        )}
                        onClick={() => {
                          setActiveFilter(type.value);

                          dispatch(
                            sendAnalyticsDataThunk({
                              type: "quest_tasks_filter_tap",
                              options: {
                                event_property_filter_type: type.value,
                              },
                            }),
                          );
                        }}
                      >
                        {type.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </Scroll>
            </div>
          </FilterWrapper>
        )}

        {tasks && tasks.length > 0 && (
          <Items
            step={step}
            questName={projectData.title}
            tasks={tasks}
            projectSoonStatus={projectSoonStatus}
            projectExpiredStatus={projectExpiredStatus}
            localTasksData={localTasksData}
            localPoints={localPoints}
            setLocalTasksData={setLocalTasksData}
            setLocalPoints={setLocalPoints}
            getScores={getScores}
            projectId={projectId}
            setProjectInvestorInfo={setProjectInvestorInfo}
            setUserPlace={setUserPlace}
            hasRequired={hasRequired}
            preview={preview}
            fullPreview={fullPreview}
            setTasksDoneCount={setTasksDoneCount}
          />
        )}
      </>
    );
  };

  return (
    <Box component="section">
      {preview && step === ECreateQuestSteps.Rewards && !fullPreview ? (
        tasks && tasks.length > 1 ? (
          <Scroll>{renderContent()}</Scroll>
        ) : (
          <section>{renderContent()}</section>
        )
      ) : (
        <section>{renderContent()}</section>
      )}

      {tasks && tasks.length === 0 && (
        <p className="c-font-16-20 c-font-color">
          <Trans id="dERdbWcRBdJyY2wpPS6iHp-quest">No tasks</Trans>
        </p>
      )}
    </Box>
  );
};

export default Tasks;
