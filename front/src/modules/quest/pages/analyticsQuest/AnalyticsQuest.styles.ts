import styled from "@emotion/styled";
import { CBreakpoints } from "@styles/variables";

export const AnalyticsQuestStyles = styled.div<{
  minHeight: number;
  chartsMinWidth: number;
}>`
  display: flex;
  align-items: start;
  justify-content: left;

  .quest-analytics__sidebar {
    width: 260px;
    height: 100%;
    border-right: 1px solid #2c3232;
    position: relative;

    &::after {
      content: "";
      display: inline-block;
      background: url("/images/project/sidebar__gradient.png") center no-repeat;
      width: 100%;
      height: 270px;
      bottom: 0;
      left: 0;
      right: 0;
      position: absolute;
    }
  }
  .quest-analytics__content {
    width: 100%;
    height: 100%;
    padding: 40px 60px;
    min-height: ${props => props.minHeight}px;

    .analytics-header {
      display: flex;
      align-items: center;
      justify-content: start;
      gap: 20px;
      .backIcon {
        transform: rotate(180deg);
      }

      .quest-analytics__title {
        word-break: break-all;
      }
    }

    @media (max-width: ${CBreakpoints.md}px) {
      padding: 25px 15px;
      .analytics-items {
        flex-direction: column;
      }
    }

    canvas {
      min-width: ${props => props.chartsMinWidth}px;
    }
  }
`;
