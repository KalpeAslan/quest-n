import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ExperienceLevelsStyles = styled(Box)<{ isInTour: boolean }>`
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  pointer-events: ${props => (props.isInTour ? "none !important" : "auto")};
  z-index: ${props => (props.isInTour ? "4 !important" : "auto")};

  .tour__exp-levels__wrapper {
    padding: 20px 29px 30px 29px;
    width: 100%;
    height: 100%;
  }

  .day-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    padding: 10px;
    border-radius: 10px;
    border: 1px solid #87f696;
    .day {
      color: rgba(255, 255, 255, 0.7);
    }
    .exp {
      color: rgba(135, 246, 150, 0.7);
    }
  }

  .day-block__selected {
    border: 1px solid rgba(255, 255, 255, 0.2);
    .day {
      color: var(--color-g8);
    }
    .exp {
      color: var(--color-gr2);
    }
  }

  .lock {
    width: 19px;
    height: 19px;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
    left: 50%;
    text-align: center;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
`;
