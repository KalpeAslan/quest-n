import { FC } from "react";
import { Box, Switch } from "@mui/material";
import styled from "@emotion/styled";
import Tooltip from "@components/UI/tooltip/Tooltip";
import { Icon } from "@components/UI/icon";

interface IProps {
  open: boolean;
  onChange: (open: boolean) => void;
  label: string;
  toolTip?: string;
  isDisabled?: boolean;
}

export const Switcher: FC<IProps> = ({
  open,
  label,
  onChange,
  toolTip,
  isDisabled,
}) => {
  return (
    <Box className={"c-flex c-flex-items-center"}>
      <StyledSwitcher
        checked={open}
        onChange={() => onChange(!open)}
        disabled={isDisabled}
      />
      <Tooltip value={toolTip}>
        <Box className={"c-flex c-flex-items-center"}>
          <p>{label}</p>
          <Box position={"relative"} top={7} left={5}>
            <Icon name={"question-mark"} />
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
};

const StyledSwitcher = styled(Switch)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  margin-right: 10px;
  .Mui-checked {
    .MuiSwitch-thumb {
      color: var(--color-gr2) !important;
    }
  }
  .MuiSwitch-thumb {
    color: white;
  }

  .MuiTouchRipple-root {
    color: var(--color-gr2);
  }
  .MuiSwitch-track {
    background: transparent !important;
  }
`;
