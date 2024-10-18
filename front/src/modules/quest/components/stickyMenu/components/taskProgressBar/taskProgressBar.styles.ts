import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{ percent: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;

  .progressContainer {
    width: 100%;
    height: 8px;
    border-radius: 36px;
    background: rgba(255, 255, 255, 0.1);
    position: relative;
    overflow: hidden;
  }

  .progress {
    width: ${props => `${props.percent}%`};
    height: 100%;
    border-radius: 4px;
    background: #87f696;
  }
`;
