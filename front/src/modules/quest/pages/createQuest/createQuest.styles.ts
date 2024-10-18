import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { ECreateQuestSteps } from "@modules/quest/models";
import { CBreakpoints } from "@styles/variables";

export const Wrapper = styled(Box)<{ step: ECreateQuestSteps }>`
  display: flex;
  align-items: start;
  justify-content: left;
  height: 100%;

  .create-quest__sidebar {
    width: 260px;
    height: 100%;
    border-right: 1px solid #2c3232;
    position: relative;

    &__image {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }

  .create-quest__content {
    width: 100%;
    .create-quest__header {
      @media screen and (max-width: ${CBreakpoints.lg}px) {
        padding-left: 24px !important;
      }

      @media screen and (max-width: ${CBreakpoints.md}px) {
        flex-direction: column;
        align-items: start;
        gap: 20px;
        .previewButton {
          min-height: 48px !important;
          min-width: 48px !important;
        }
        padding-left: 15px !important;
      }

      @media screen and (max-width: ${CBreakpoints.sm}px) {
        .create-quest__header__container {
          width: 100%;
          .line {
            width: 16px;
            margin-right: 4px;
            margin-left: 4px;
          }
        }
      }

      @media screen and (min-width: ${CBreakpoints.xLg}px) {
        padding-left: 48px !important;
      }
    }
    .backButton {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin-right: 16px;
    }

    .backIcon {
      transform: rotate(180deg);
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .line {
      width: 32px;
      height: 1px;
    }

    .dot,
    .line {
      background: rgba(255, 255, 255, 0.3);
      margin-right: 8px;
      margin-left: 8px;

      &.active {
        background: #ffffff;
      }

      &.done {
        background: #87f696;
      }
    }

    .stepText {
      cursor: pointer;
      color: rgba(255, 255, 255, 0.3);

      &.active {
        color: #ffffff;
      }

      &.done {
        color: #87f696;
      }

      &.mr {
        margin-right: 8px;
      }
    }

    .previewButton {
      width: 36px;
      height: 36px;
      display: flex;
      padding: 0;
      align-items: center;
      justify-content: center;
    }

    .previewIcon {
      width: 18px;
      height: 18px;
    }

    .previewText {
      display: none;
    }

    @media screen and (min-width: 768px) {
      .previewButton {
        height: 48px;
        width: auto;
        min-width: 170px !important;
        padding-left: 12px;
        padding-right: 12px;
      }

      .previewIcon {
        width: 24px !important;
        height: 24px !important;
        margin-right: 10px;
      }

      .previewText {
        display: block;
      }
    }
  }
`;
