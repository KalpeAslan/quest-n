import styled from "@emotion/styled";
import { CBreakpoints } from "@styles/variables";

export const QuestAnalyticsGeographyStyles = styled.div`
  width: 100%;
  .quest-analytics__geo-wrapper {
    display: flex;
    align-items: start;
    width: 100%;
    gap: 27px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 20px;

    .quest-analytics__geo-bar-chart {
      background: transparent;
      width: 50%;

      .quest-analytics__geo-bar-chart__item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.5);

        &:first-of-type {
          padding-top: 0;
        }

        &:last-of-type {
          border-bottom: none;
        }
      }

      .quest-analytics__geo-bar-chart__line {
        background: var(--color-gr2);
        border-radius: 10px;
        height: 100%;
      }
    }

    .quest-analytics__geo-map {
      position: relative;
      width: 50%;

      svg {
        path {
          fill: rgba(255, 255, 255, 0.2);
        }
      }
    }

    @media screen and (max-width: ${CBreakpoints.md}px) {
      flex-direction: column-reverse;
      .quest-analytics__geo-map,
      .quest-analytics__geo-bar-chart {
        width: 100%;
      }
    }
  }

  .quest-analytics__geo-tooltip {
    position: absolute;
    border-radius: 10px;
    border: 1px solid var(--color-gr2);
    background: rgba(16, 16, 16, 0.65);
    backdrop-filter: blur(1.5px);
  }
`;
