import { Box } from "@mui/material";
import { Wrapper } from "./createTasksStep.styles";
import { Dispatch, FC, SetStateAction } from "react";
import { ELoyaltyTasks } from "@/models";
import { ECreateQuestSteps, QuestStatus } from "@/modules/quest/models";
import { Button } from "@/components/UI/button";
import { Trans } from "@lingui/macro";
import { ICreateTasksHookData } from "@/modules/quest/hooks/useCreateTasks";
import { TaskCreationPopup } from "@modules/account/components/modals/taskCreationPopup/TaskCreationPopup";

interface Props {
  tgBotLink: string;
  setBackStep: Dispatch<SetStateAction<ECreateQuestSteps>>;
  hookData: ICreateTasksHookData;
}

export interface ITaskFormData {
  changed: boolean;
  new?: boolean;
  values: {
    title: string;
    points: number;
    description: string;
    startAt?: any;
    endAt?: any;
    [key: string]: string | number;
  };
  errors: {
    title: string;
    points: string;
    description: string;
    [key: string]: string;
  };
  taskType: ELoyaltyTasks;
  id?: number;
}

const CreateTasksStep: FC<Props> = ({ setBackStep, tgBotLink, hookData }) => {
  const {
    validationSchemas,
    setLoading,
    loading,
    onSave,
    currentQuest,
    setCurrentQuest,
    setTasksData,
    tasksData,
    savedTasksAsObject,
    selectedTaskIndex,
    setSelectedTaskIndex,
    onSaveTask,
  } = hookData;

  return (
    <Wrapper>
      <Box display="flex" mt={3.5}>
        <Button
          style="secondary"
          className="btnBack"
          onClick={() => setBackStep(ECreateQuestSteps.Setup)}
        >
          <Trans id="wPAHPDbnyabHg61XKB4DRJ-quest">Back</Trans>
        </Button>

        <Button
          style="primary"
          className="c-full-width btnSave"
          onClick={onSave}
          loading={loading}
          disabled={loading}
        >
          <p>
            <Trans id={"ksv-43jbjxfe-24"}>Continue</Trans>
          </p>
        </Button>
      </Box>
      {tasksData[selectedTaskIndex] && (
        <TaskCreationPopup
          onClose={() => {
            setSelectedTaskIndex(null);
            setTasksData(prev =>
              prev.filter((item, i) => !(i === selectedTaskIndex && !item.id)),
            );
          }}
          onSave={() => onSaveTask(selectedTaskIndex as number)}
          isOpen={!!tasksData[selectedTaskIndex]}
          setCurrentQuest={setCurrentQuest}
          taskData={tasksData[selectedTaskIndex]}
          index={selectedTaskIndex}
          isLoading={loading}
          setLoading={setLoading}
          currentQuest={currentQuest}
          setTasksData={setTasksData}
          savedData={
            savedTasksAsObject[tasksData[selectedTaskIndex].taskType] || null
          }
          tgBotLink={tgBotLink}
          validation={validationSchemas[tasksData[selectedTaskIndex].taskType]}
          isDraft={currentQuest?.questStatus === QuestStatus.Draft}
        />
      )}
    </Wrapper>
  );
};

export default CreateTasksStep;
