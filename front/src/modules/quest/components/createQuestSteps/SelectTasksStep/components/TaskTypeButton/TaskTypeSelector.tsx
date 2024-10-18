import { FC, useState, MouseEvent } from "react";
import { StyledOffChainTaskTypeMenu, Wrapper } from "./taskTypeButton.styles";
import { Icon } from "@/components/UI/icon";
import { Box, MenuItem } from "@mui/material";
import { IOffChainTaskTypeItem } from "@modules/quest/hooks/useTaskTypes.constants";
import { icons } from "@modules/quest/models/constants";
import { ELoyaltyTasks } from "@models";

interface Props {
  type: string;
  taskType: IOffChainTaskTypeItem;
  onAdd: (task: ELoyaltyTasks) => void;
  isDisabled?: boolean;
}

const TaskTypeSelector: FC<Props> = ({ taskType, onAdd, isDisabled }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (taskType.tasks.length === 1) {
      if (isDisabled) return;
      onAdd(taskType.tasks[0].type);
      return;
    }
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleSelect = (taskType: ELoyaltyTasks) => {
    onAdd(taskType);
    setOpen(false);
  };

  return (
    <div>
      <Wrapper onClick={handleClick}>
        <Box className={"iconWrapper"}>
          <Icon name={taskType.icon} size="24" />
        </Box>

        <Box
          component="p"
          className={"c-font-12-16 c-font-color"}
          style={{
            maxWidth: 80,
            textAlign: "center",
          }}
        >
          {taskType.name}
        </Box>
      </Wrapper>

      <StyledOffChainTaskTypeMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={() => setOpen(false)}
      >
        {taskType.tasks &&
          taskType.tasks.map((item, index) => (
            <MenuItem
              className={"c-font-12-14 c-fw-400 c-font-color"}
              key={index}
              onClick={() => {
                if (isDisabled) return;

                handleSelect(item.type);
              }}
            >
              <Icon
                color={"white"}
                style={{
                  paddingRight: 5,
                }}
                name={icons[item.type]}
              />
              {item.title}
            </MenuItem>
          ))}
      </StyledOffChainTaskTypeMenu>
    </div>
  );
};

export default TaskTypeSelector;
