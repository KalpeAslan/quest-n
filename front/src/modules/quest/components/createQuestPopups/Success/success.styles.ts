import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 90vw;
  max-width: 480px;
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
  }

  .closeBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .btn {
    display: block;
    font-size: 16px;
    line-height: 22px;
    padding: 0;
    padding-top: 13px;
    padding-bottom: 13px;
    flex-grow: 1;

    &:first-child {
      margin-top: 10px;
      flex-grow: 0.5;
    }
  }

  .iconBtn {
    display: flex;
    align-items: center;
    margin: 0;
    max-width: none;
    padding-left: 16px;
    padding-right: 20px;
    font-size: 14px;
    line-height: 20px;
    justify-content: center;
  }

  .icon {
    margin-right: 7px;

    &.tg {
      color: #1d9bf0;
    }
  }

  .buttonsWrapper {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
  }

  @media screen and (min-width: 768px) {
    .buttonsWrapper {
      flex-direction: row;
    }

    .btn:first-child {
      margin-right: 15px;
      margin-top: 0;
    }
  }
`;
