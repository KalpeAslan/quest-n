import styled from "@emotion/styled";
import { CBreakpoints } from "@styles/variables";

export const PartnerProjectCardStyles = {
  Wrapper: styled.div<{ delegated: boolean }>`
    &.partner-project-card {
      display: flex;
      max-width: 520px;
      border-radius: 10px;
      flex-direction: column;
      align-items: start;
      width: 100%;
      justify-content: space-between;
      padding: 25px;
      background: ${({ delegated }) =>
        delegated
          ? "var(--color-b25)"
          : "linear-gradient(180deg, rgba(135, 246, 150, 0.03) 0%, rgba(135, 246, 150, 0.10) 100%)"};
      gap: 20px;
      position: relative;

      @media (max-width: ${CBreakpoints.tablet}px) {
        max-width: 100%;
      }
    }

    .partner-project-card__delegated {
      display: flex;
      height: 31px;
      padding: 9px 11px 9px 13px;
      justify-content: center;
      align-items: center;
      border-radius: 0 16px;
      background: #87f696;
      position: absolute;
      top: 0;
      right: 0;
    }

    .partner-project-card__status {
      margin-right: 10px;
    }

    .partner-project-card__header {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 10px;
    }

    .partner-project-card__footer {
      display: flex;
      align-items: center;
      justify-content: left;
      gap: 20px;
      flex-wrap: wrap;
      flex-direction: row;
      width: 100%;
      text-align: center;

      div {
        flex: 1;
        width: 100%;
      }

      @media (max-width: ${CBreakpoints.tablet}px) {
        flex-direction: row;
      }

      @media (max-width: ${CBreakpoints.sm}px) {
        flex-direction: column;
      }
    }
  `,
};
