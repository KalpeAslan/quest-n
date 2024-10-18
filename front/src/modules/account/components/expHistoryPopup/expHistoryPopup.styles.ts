import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 90vw;
  max-width: 330px;
  min-width: 330px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  position: relative;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);

  .loader {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: var(--wallets-popup-background-color);
    z-index: 1;
  }

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
    padding: 20px 24px 25px;

    &.empty {
      padding: 80px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.50);
    }
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:not(:last-child) {
      margin-bottom: 15px;
    }
  }

  .dateWrapper {
    margin-bottom: 5px;
  }

  @media screen and (min-width: 768px) {
    max-width: 700px;
    min-width: 700px;

    .item {
      align-items: center;
      padding-bottom: 20px;

      &:not(:last-child) {
        margin-bottom: 20px;
      }
    }

    .leftWrapper {
      display: flex;
    }

    .dateWrapper {
      margin-bottom: 0;
      margin-right: 20px;
    }
  }
`;
