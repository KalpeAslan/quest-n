import styled from "@emotion/styled";
import { Box } from "@mui/material";
export const Wrapper = styled(Box)`
  .itemIcon {
    margin-right: 5px;
  }
  .icon {
    color: var(--sidebar-select-color);
    margin-left: 4px;
  }
  .icon.opened {
    transform: rotate(180deg);
  }

  .selectorItem {
    color: var(--text-color-2);

    &:hover {
      color: var(--color-gr2);
    }
  }

  .selectorDivider {
    background: rgba(255, 255, 255, 0.1);
    width: calc(100% - 32px);
    height: 1px;
    min-height: 1px;
    margin: 0 auto;
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;
