import { Box } from "@mui/material";
import { Wrapper } from "./taskProgressBar.styles";
import { FC } from "react";
import { Trans } from "@lingui/macro";

interface Props {
  tasksDone: number;
  totalTasks: number;
  className?: string;
}

const TaskProgressBar: FC<Props> = ({ tasksDone, totalTasks, className }) => {

  return (
    <Wrapper
      percent={(tasksDone / (totalTasks || 1)) * 100}
      className={className}
    >
      <Box className="c-font-color c-font-14-16" mb="11px">
        <Trans id="gdjMaSaX33V63g4wdHeAn8-quest">
          {tasksDone}/{totalTasks} tasks completed
        </Trans>
      </Box>
      <Box className="progressContainer">
        <Box className="progress" />
      </Box>
    </Wrapper>
  );
};

export default TaskProgressBar;
