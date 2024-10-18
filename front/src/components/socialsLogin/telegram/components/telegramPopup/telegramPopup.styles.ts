import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 90vw;
  max-width: 450px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
  position: relative;

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
    padding: 20px 24px 30px 24px;

    &.pt {
      padding-top: 30px;
    }
  }

  .copyButton {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }

  .botButton {
    max-width: 208px;
    margin: 0 auto;
    text-align: center;
    display: block;
    width: 100%;
  }

  .icon {
    display: block;
    margin: 0 auto;
    margin-bottom: 18px;
  }

  .steps {
    display: flex;
    align-items: center;
    width: fit-content;
    margin: 0 auto;
    margin-top: 34px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    opacity: 0.5;
    background: #fff;
    cursor: pointer;

    &.active {
      opacity: 1;
      background-color: #87f696;
    }
  }

  .divider {
    height: 1px;
    width: 60px;
    opacity: 0.5;
    background: #fff;

    &.active {
      opacity: 1;
      background-color: #87f696;
    }

    &.error {
      opacity: 1;
      background-color: #fc5b3f;
    }
  }

  .stepText {
    opacity: 0.5;
    color: #fff;
    cursor: pointer;

    &.active {
      opacity: 1;
      color: #87f696;
    }

    &.error {
      opacity: 1;
      color: #fc5b3f;
    }
  }
`;
