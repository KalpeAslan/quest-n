import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";

export const ExperienceProgressByDateStyles = styled(Box)`
  &.experience-progress-by-date {
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    .experience-progress__wrapper {
      padding: 20px 29px 30px 29px;
      width: 100%;
      height: 100%;
    }

    &__header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    // @media (max-width: ${380}px) {
    //   padding: 20px 20px 30px 20px;
    // }
  }

  .experience-progress-by-date__days {
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: ${CBreakpoints.sm}px) {
      justify-content: start;
      flex-wrap: wrap;
      gap: 16px;
    }

    @media (max-width: ${CBreakpoints.xSm}px) {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      justify-content: start;
      flex-wrap: wrap;
      gap: 16px;
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
  }
`;
