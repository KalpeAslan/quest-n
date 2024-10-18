import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  flex: 1;
  width: 100%;
  padding: 16px;

  .countdown {
    text-align: center;
  }

  .collapseIconWrapper {
    margin-top: 16px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
  }
`;
