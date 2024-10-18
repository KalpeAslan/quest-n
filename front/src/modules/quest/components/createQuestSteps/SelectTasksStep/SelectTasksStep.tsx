import { ELoyaltyTasks } from "@/models";
import { Wrapper } from "./selectTasksStep.styles";
import { Box } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Tabs } from "@/components/UI/tabs";
import { TaskTypeSelector } from "./components/TaskTypeButton";
import { TaskCard } from "./components/TaskCard";
import { ILoyaltyProject, QuestStatus } from "@/modules/quest/models";
import { t, Trans } from "@lingui/macro";
import { useTaskTypes } from "@/modules/quest/hooks/useTaskTypes";
import { ETaskTabs } from "@modules/quest/types/quest.types";
import { TaskDeletePopup } from "@modules/account/components/modals/taskDeletePopup/TaskDeletePopup";
import { onChainAndOffTaskEnum } from "@modules/quest/hooks/useTaskTypes.constants";

interface Props {
  currentQuest: ILoyaltyProject;
  isLuckyDraw: boolean;
  setShouldSave: Dispatch<SetStateAction<boolean>>;
  shouldSave: boolean;
  setPreviewLoading: Dispatch<SetStateAction<boolean>>;
  onAdd: (typeItem: ELoyaltyTasks) => void;
  adminTasksLimit: number;
  currentQuestForPreview: ILoyaltyProject;
  setSelectedTaskIndex: Dispatch<SetStateAction<number>>;
  selectedTaskIndex: number;
  selectedTasks: ELoyaltyTasks[];
  onDelete: (index: number) => Promise<void>;
}

const SelectTasksStep: FC<Props> = ({
  currentQuest,
  isLuckyDraw,
  selectedTasks,
  onAdd,
  setSelectedTaskIndex,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<ETaskTabs | string>(
    ETaskTabs.OffChain,
  );

  const { offChainTaskTypes, onChainTaskTypes, allTasksTypesAsObject } =
    useTaskTypes();

  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [selectedToDeleteIndex, setSelectedToDeleteIndex] = useState<
    number | null
  >(null);

  const tabs = [
    {
      id: 1,
      title: t({ id: "sc9RqTXxDUopJTJfSkHTrz-quest", message: "Off-Chain" }),
      tab: ETaskTabs.OffChain,
    },
    {
      id: 2,
      title: t({ id: "bJxvN15UXoRUYT86fBgXna-quest", message: "On-Chain" }),
      tab: ETaskTabs.OnChain,
    },
    {
      id: 3,
      title: t({ id: "tQ3PeosTNhoWmpVVqTmPKK-quest", message: "All" }),
      tab: ETaskTabs.All,
    },
  ];

  const handleAddTask = (task: ELoyaltyTasks) => {
    const newSelectedTaskTypes = [...selectedTasks, task];
    setSelectedTaskIndex(newSelectedTaskTypes.length - 1);
    onAdd(task);
  };

  const handleDeleteTaskButton = (index: number) => {
    setSelectedToDeleteIndex(index);
    setShowDeleteTaskModal(true);
  };

  const handleDeleteTask = () => {
    onDelete(selectedToDeleteIndex).then(() => {
      setShowDeleteTaskModal(false);
      setSelectedToDeleteIndex(null);
    });
  };

  const computeSelectedTasksList = selectedTasks.reduce((acc, value) => {
    const task = allTasksTypesAsObject[value];
    if (!task) {
      return acc;
    }

    if (activeTab === ETaskTabs.OnChain) {
      onChainAndOffTaskEnum[task.type] === "onChain" && acc.push(value);
      return acc;
    }

    if (activeTab === ETaskTabs.OffChain) {
      onChainAndOffTaskEnum[task.type] === "offChain" && acc.push(value);
      return acc;
    }

    acc.push(value);

    return acc;
  }, []);

  return (
    <div className={"c-flex"} style={{ width: "100%" }}>
      <Wrapper>
        <Box component="p" className="c-font-16-22 c-fw-500" mb={3.5}>
          <Trans id="74b5JaZhEwNfXwCoNDhPRR-quest">
            Add the necessary tasks, you can customize each one on the quest
            page
          </Trans>
        </Box>

        <Tabs
          type="secondary"
          activeTab={activeTab}
          tabs={tabs}
          changeFn={setActiveTab}
        />

        {activeTab === ETaskTabs.OffChain && (
          <Box
            mt={3.5}
            display="flex"
            justifyContent="start"
            flexWrap="wrap"
            gap={1}
          >
            {Object.keys(offChainTaskTypes).map(key => {
              if ((key === "invite" || key === "quiz") && isLuckyDraw)
                return null;

              offChainTaskTypes[key].tasks = offChainTaskTypes[
                key
              ].tasks.filter(item => {
                if (
                  isLuckyDraw &&
                  (item.type === ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER ||
                    item.type === ELoyaltyTasks.MENTION_TWITTER)
                )
                  return false;
                return true;
              });
              return (
                <TaskTypeSelector
                  key={key}
                  type={key}
                  taskType={offChainTaskTypes[key]}
                  onAdd={handleAddTask}
                  isDisabled={currentQuest?.questStatus !== QuestStatus.Draft}
                />
              );
            })}
          </Box>
        )}

        {activeTab === ETaskTabs.OnChain && (
          <Box
            mt={3.5}
            display="flex"
            justifyContent="start"
            flexWrap="wrap"
            gap={1}
          >
            {Object.keys(onChainTaskTypes).map(key => {
              if ((key === "invite" || key === "quiz") && isLuckyDraw)
                return null;
              return (
                <TaskTypeSelector
                  key={key}
                  type={key}
                  taskType={onChainTaskTypes[key]}
                  onAdd={handleAddTask}
                  isDisabled={currentQuest?.questStatus !== QuestStatus.Draft}
                />
              );
            })}
          </Box>
        )}

        {activeTab === ETaskTabs.All && (
          <Box
            mt={3.5}
            display="flex"
            justifyContent="start"
            flexWrap="wrap"
            gap={1}
          >
            {Object.keys(offChainTaskTypes).map(key => {
              if ((key === "invite" || key === "quiz") && isLuckyDraw)
                return null;

              offChainTaskTypes[key].tasks = offChainTaskTypes[
                key
              ].tasks.filter(item => {
                if (
                  isLuckyDraw &&
                  (item.type === ELoyaltyTasks.RE_TWEET_QUOTE_TWITTER ||
                    item.type === ELoyaltyTasks.MENTION_TWITTER)
                )
                  return false;
                return true;
              });
              return (
                <TaskTypeSelector
                  key={key}
                  type={key}
                  taskType={offChainTaskTypes[key]}
                  onAdd={handleAddTask}
                  isDisabled={currentQuest?.questStatus !== QuestStatus.Draft}
                />
              );
            })}
            {Object.keys(onChainTaskTypes).map(key => {
              if ((key === "invite" || key === "quiz") && isLuckyDraw)
                return null;
              return (
                <TaskTypeSelector
                  key={key}
                  type={key}
                  taskType={onChainTaskTypes[key]}
                  onAdd={handleAddTask}
                  isDisabled={currentQuest?.questStatus !== QuestStatus.Draft}
                />
              );
            })}
          </Box>
        )}

        {/*CARDS*/}

        <Box mt={3.5}>
          {computeSelectedTasksList.map((taskType, index) => {
            if (!taskType) return null;
            const taskItem = allTasksTypesAsObject[taskType];
            if (taskItem.socialAlgorithm && isLuckyDraw) {
              return null;
            }
            return (
              <TaskCard
                key={index}
                title={taskItem.title}
                description={taskItem.description}
                socialAlgorithm={taskItem.socialAlgorithm}
                type={taskItem.type}
                onEdit={() => setSelectedTaskIndex(index)}
                onDelete={() => handleDeleteTaskButton(index)}
                isDraft={currentQuest?.questStatus === QuestStatus.Draft}
              />
            );
          })}
        </Box>
      </Wrapper>
      {showDeleteTaskModal && (
        <TaskDeletePopup
          onClose={() => setShowDeleteTaskModal(false)}
          open={showDeleteTaskModal}
          onSubmit={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default SelectTasksStep;
