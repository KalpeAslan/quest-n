import styled from "@emotion/styled";
import { CBreakpoints } from "../../../../styles/variables";

export const QuestCompletedTasksStyles = styled.div`
  .filter {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: end;
    margin-top: 30px;
  }

  .tooltip {
    display: inline-block;
    position: relative;
    top: -3px;
  }

  .MuiTableContainer-root {
    border: 1px solid #88898a;
    border-radius: 10px;
    background: #171717;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;
      background: url("/images/analytics/users-column-bg.png");
      background-position: top;
      background-repeat: repeat;
      background-size: cover;
    }

    .tasks-column {
      border: 1px solid var(--color-g21);
      border-radius: 10px 10px 0 0;
    }

    .users-column {
      border: 1px solid var(--color-g21);
      border-radius: 10px 10px 0 0;
    }

    .total-column {
      border: 1px solid var(--color-g21);
      border-radius: 10px 10px 0 0;
    }

    .MuiTableCell-root {
      padding: 10px 16px;
      position: relative;
      z-index: 3;
    }

    tbody {
      .MuiTableCell-root {
        border: 1px solid var(--color-g21);
      }
    }
  }

  .users-column {
    //background: url("/images/analytics/users-column-bg.png");
    //background-position: top;
    //background-repeat: repeat;
    //background-size: cover;
    z-index: 2;
  }

  @media (max-width: ${CBreakpoints.md}px) {
    .filter {
      display: flex;
      flex-direction: column;
      align-items: start;
      width: 100%;
      gap: 20px;
      .inputWrapper {
        width: 100%;
      }
    }
  }
`;
