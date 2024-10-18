import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 90vw;
  max-width: 600px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);

  .header {
    padding: 16px;
    position: relative;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 24px;
    line-height: 24px;
    padding-right: 45px;
  }

  .closeBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 24px 30px;
  }

  .divider {
    height: 1px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
  }

  .tokenLogo {
    margin-right: 4px;
  }

  .tokenContainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .tokenNameContainer {
    margin-bottom: 24px;
    align-self: flex-start;
  }

  .confirmButton {
    width: 100%;
  }

  .switchNetworkBlock {
    border-radius: 16px;
    border: 1px solid #87f696;
    background: #1b1d1d;
    padding: 20px;
  }

  .switchButton {
    width: 100%;
  }

  .desktop {
    display: none;
  }

  .steps {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: #ffffff;
    border-radius: 50%;
    opacity: 0.5;

    &.active {
      opacity: 1;
      background: #87f696;
    }
  }

  .text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #ffffff;
    opacity: 0.5;

    &.active {
      opacity: 1;
      color: #87f696;
    }

    &.mobile.current {
      display: none !important;
    }

    &.desktop.current {
      display: initial !important;
    }
  }

  .stepsDivider {
    flex-grow: 1;
    height: 1px;
    background: #ffffff;
    opacity: 0.5;

    &.active {
      background: #87f696;
      opacity: 1;
    }
  }

  .completeButton {
    margin-top: 30px;
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    .tokenContainer {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .tokenContainer.switch {
      flex-direction: column;
      justify-content: center;
    }

    .tokenNameContainer {
      margin-bottom: 0px;
      align-self: center;

      &.switch {
        margin-bottom: 24px;
        align-self: flex-start;
      }
    }

    .confirmButton {
      max-width: 170px;
    }

    .switchButton {
      max-width: 208px;
    }

    .mobile {
      display: none;
    }

    .desktop {
      display: initial;
    }

    .completeButton {
      width: 200px;
      margin-left: auto;
    }
  }
`;
