import Modal from "@components/UI/modal/Modal";
import { Dispatch, FC, SetStateAction } from "react";
import { TaskForm } from "@modules/quest/components/createQuestSteps/CreateTasksStep/components/TaskForm";
import { ILoyaltyTask } from "@models";
import { ITaskFormData } from "@modules/quest/components/createQuestSteps/CreateTasksStep/CreateTasksStep";
import { AnySchema } from "yup";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";
import Scroll from "@components/UI/scroll/Scroll";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentQuest: Dispatch<SetStateAction<any>>;
  taskData: ITaskFormData;
  index: number;
  setLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  tgBotLink: string;
  currentQuest: any;
  savedData: ILoyaltyTask | null;
  validation: {
    title: AnySchema;
    points?: AnySchema;
    description: AnySchema;
    [key: string]: AnySchema;
  };
  setTasksData: any;
  onSave: () => void;
  isDraft: boolean;
}

export const TaskCreationPopup: FC<IProps> = ({
  isOpen,
  onClose,
  taskData,
  setTasksData,
  savedData,
  validation,
  index,
  tgBotLink,
  setLoading,
  currentQuest,
  setCurrentQuest,
  isLoading,
  onSave,
  isDraft,
}) => {
  return (
    <Modal isOpen={isOpen} handleClose={onClose}>
      <Scroll overflowBehavior={{ x: "scroll", y: "hidden" }}>
        <Box
          width={"100%"}
          sx={theme => ({
            ".taskCreationPopup": {
              width: 680,
            },
            [theme.breakpoints.down(CBreakpoints.md)]: {
              padding: "30px",
              boxSizing: "border-box",
              display: "flex",
            },
          })}
        >
          <Box
            bgcolor={"#131515"}
            borderRadius={4}
            className={"taskCreationPopup"}
            border={"1px solid rgba(255, 255, 255, 0.10)"}
          >
            <TaskForm
              key={index}
              setCurrentQuest={setCurrentQuest}
              type={taskData.taskType}
              taskData={taskData}
              setTasksData={setTasksData}
              savedData={savedData}
              validation={validation}
              index={index}
              onSave={onSave}
              setLoading={setLoading}
              isLoading={isLoading}
              tgBotLink={tgBotLink}
              currentQuest={currentQuest}
              onClose={onClose}
              isDraft={isDraft}
            />
          </Box>
        </Box>
      </Scroll>
    </Modal>
  );
};
