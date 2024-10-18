import styled from "@emotion/styled";
import { Menu } from "@mui/material";

export const Dropdown = styled(Menu)<{ minWidth?: string }>`
  .MuiList-root {
    padding: 0 !important;
    ${props => props.minWidth && `min-width: ${props.minWidth} !important;`}
  }

  .MuiPaper-root {
    border-radius: 10px !important;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #101313;
  }
  .MuiMenuItem-root {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:last-of-type {
      border-bottom: none !important;
    }
  }
`;
