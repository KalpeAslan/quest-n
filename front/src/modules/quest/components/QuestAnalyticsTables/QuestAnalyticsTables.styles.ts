import styled from "@emotion/styled";
import { CBreakpoints } from "../../../../styles/variables";

export const QuestAnalyticsTablesStyles = styled.div`
  .table-container {
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: var(--text-color-2);

    tbody {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    thead {
      height: 80px;
      tr,
      th {
        background: var(--app-background-color);
        z-index: 1;
      }
    }
  }

  .MuiTableCell-root {
    border-bottom-color: rgba(255, 255, 255, 0.5);
  }

  .quest-analytics__wallet {
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .quest-analytics__csv {
    width: 100%;
    margin-left: 30px;
  }

  .quest-analytics__socials-dropdown {
    overflow-y: auto;
  }

  @media (max-width: ${CBreakpoints.md}px) {
    .quest-analytics_winners-and-eligible-users__header {
      flex-direction: column;
      align-items: start;
      gap: 20px;

      .search-input-wrapper {
        width: 100%;
        flex-direction: column;
        gap: 30px;
        align-items: start;

        .quest-analytics__csv {
          margin-left: 0;
          max-width: 213px;
        }

        .search-input {
          max-width: 100%;
          width: 100%;
        }
      }
    }
  }
`;
