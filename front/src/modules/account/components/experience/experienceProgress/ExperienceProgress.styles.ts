import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ExperienceProgressStyles = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: start;
  min-height: 213px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid #87f696;
  padding: 20px 16px;
  overflow: hidden;

  .backgroundImage {
    position: absolute;
    width: 100%;
    height: 200%;
    left: 0;
    top: 0;
    transform: scale(1.5) translateY(-200px);
  }

  .backgroundFilter {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    overflow: hidden;
    border-radius: 16px;
  }

  .MuiLinearProgress-root {
    background-color: #747474;
    height: 7px !important;
    border-radius: 10px;
  }
  .MuiLinearProgress-bar {
    background-color: var(--color-gr2) !important;
  }
`;
