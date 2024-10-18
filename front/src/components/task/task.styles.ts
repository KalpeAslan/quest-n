import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ProgressBarStylesWrapper = styled.div`
  width: 100%;
  border-radius: 36px;
  background-color: var(--progress-bar-background-color);
`;

export const ProgressBarStylesScore = styled.p`
  max-width: 100%;
  border-radius: 36px;
`;

export const Wrapper = styled.section<{
  preview: boolean;
  fullPreview?: boolean;
}>`
  ${props => (props.preview || props.fullPreview) && "pointer-events: none;"}
  color: #ffffff;
  padding: 16px;
  background: rgba(0, 0, 0, 0.33);
  border-radius: 16px;
  position: relative;
  border: 1px solid transparent;

  &.done {
    border: 1px solid #ffffff;
    opacity: 0.5;
  }

  &.expired {
    background: rgba(255, 255, 255, 0.1);
    opacity: 0.5;
  }

  &.blocked {
    background: rgba(0, 0, 0, 0.33);
    opacity: 0.5;
  }

  .iconBlock {
    margin-bottom: 26px;
  }

  .countdownWrapper p {
    color: var(--text-color-2) !important;
  }

  .iconWrapper {
    min-width: 44px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pointsLabel {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
  }

  .divider {
    background: rgba(255, 255, 255, 0.1);
    height: 1px;
    margin-bottom: 16px;
  }

  .steps {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    list-style: none;
    margin-bottom: 12px;
  }

  .step {
    margin-right: 2px;
  }

  .step-active {
    color: var(--step-active-item-color);
  }

  .step-disabled {
    color: rgba(255, 255, 255, 0.3) !important;
  }

  .step-error {
    color: rgba(252, 91, 63, 1) !important;
  }

  .socContent {
    margin-bottom: 12px;
  }

  .title {
    margin-bottom: 4px;
  }

  .error,
  .warning {
    position: absolute;
    top: -10px;
    left: 0;
    padding: 4px 6px 4px 6px;
    display: flex;
    background: #fc5b3f;
    border-radius: 29px;
    color: var(--text-color-2) !important;
  }

  .quizInput {
    position: relative;
    margin-bottom: 30px;

    .quizError {
      position: absolute;
      bottom: -20px;
      left: 0;
      padding: 0;
      top: auto;
      display: block;
      background: none;
      color: #fc5b3f !important;
      white-space: nowrap;
    }
  }

  @media only screen and (max-width: 767px) and (-webkit-touch-callout: none) and (pointer: coarse) {
    .task_description {
      a {
        margin-left: 10px;
      }
    }
  }

  .warning {
    background: var(--button-primary-disabled-background-color);
  }

  .buttonContent {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
    width: 100%;
    color: #fafafa !important;

    &.twitter {
      svg {
        color: #1da1f2 !important;
      }
    }

    .icon {
      margin-right: 8px;
    }
  }

  .buttonLoader {
    width: 16px;
    height: 16px;
    animation: circle 1.5s linear infinite;
  }

  @keyframes circle {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  ${({ preview, fullPreview }) =>
    (!preview || fullPreview) &&
    `@media screen and (min-width: 1024px) {
    .mainBlock {
      display: flex;
    }

    .iconBlock {
      padding-right: 16px;
      margin-bottom: 0;
      width: 156px;
      min-width: 156px;
      max-width: 156px;
    }

    .divider {
      height: auto;
      width: 1px;
      margin-bottom: 0;
    }

    .contentBlock {
      padding-left: 16px;
    }

    .socContent {
      margin-bottom: 0;
    }

    .buttonContent {
      width: fit-content;
    }

    .form {
      max-width: 240px;
    }
  }`}
`;

export const InviteButton = styled.button`
  padding: 10px;
  min-width: auto !important;
  white-space: nowrap;

  font-family: var(--font-family-1);
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 10px;
  border: 1px solid;
  border-color: transparent;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s, color 0.3s;

  .loadtrt {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  color: var(--button-secondary-text-color);
  background: var(--button-secondary-background-color);
  backdrop-filter: blur(10px);
  &:hover {
    background: var(--button-secondary-hover-background-color);
  }
  &:active {
    background: var(--button-secondary-hover-background-color);
  }
  &:visited {
    background: var(--button-secondary-pressed-background-color);
  }
  &:focus {
    background: var(--button-secondary-focus-background-color);
  }
  &:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: 2px;
  }
  &.disabled {
    background: var(--button-secondary-disabled-background-color);
    cursor: not-allowed;
  }
`;

export const ReferralLinkButton = styled.button`
  padding: 8px 12px;
  min-width: auto !important;
  white-space: nowrap;

  font-family: var(--font-family-1);
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 10px;
  border: 1px solid;
  border-color: transparent;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s, color 0.3s;

  .loadtrt {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  color: var(--button-task-text-color);
  background: var(--button-task-background-color);
  &:hover {
    background: var(--button-task-hover-background-color);
  }
  &:active {
    background: var(--button-task-hover-background-color);
  }
  &:visited {
    background: var(--button-task-pressed-background-color);
  }
  &:focus {
    background: var(--button-task-focus-background-color);
  }
  &:focus-visible {
    outline: 2px solid var(--button-task-border-color);
    outline-offset: 2px;
  }
  &.disabled {
    color: var(--button-task-disabled-text-color);
    cursor: not-allowed;
  }
`;

export const ErrorBlock = styled(Box)`
  border-radius: 10px;
  margin-top: 16px;
  border: 1px solid #525252;
  background: #1d2020;
  padding: 18px;
  display: flex;
  flex-direction: column;
  position: absolute;
  transition: transform 300ms ease;
  transform: translateY(100%);
  opacity: 0;
  pointer-events: none;

  &.open-enter {
    transform: translateY(-100%);
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &.open-enter-done {
    transform: translateY(0);
    position: static;
    opacity: 1;
    pointer-events: auto;
    transition: all 300ms;
  }

  &.open-exit {
    transform: translateY(0);
    position: static;
    opacity: 1;
    pointer-events: auto;
  }

  &.open-exit-active {
    transform: translateY(-100%);
    position: absolute;
    opacity: 0;
    pointer-events: none;
    transition: all 300ms;
  }

  .content {
    margin-bottom: 18px;
  }

  .button {
    width: fit-content;
  }

  @media screen and (min-width: 768px) {
    margin-top: 28px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .content {
      margin-bottom: 0;
      max-width: 60%;
    }
  }
`;

export const RequiredBlock = styled(Box)`
  position: absolute;
  padding: 8px 12px 9px 11px;
  width: 121px;
  justify-content: space-between;
  border: 0.5px solid #87f696;
  border-radius: 0px 16px;
  top: 0;
  right: 0;
  display: flex;

  .tooltip {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #293131;
    border-radius: 50%;
  }
`;

export const ExpBlock = styled(Box)`
  position: absolute;
  padding: 4px 10px 3px 8px;
  background: #87f696;
  display: flex;
  align-items: center;
  color: #141414;
  top: 42px;
  right: 0;
  border-radius: 16px 0px 0px 16px;

  .icon {
    margin-right: 3px;
  }

  @media screen and (min-width: 1024px) {
    top: initial;
    bottom: 0;
    border-radius: 16px 0px;
  }
`;
