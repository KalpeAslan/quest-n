import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 90vw;
  max-width: 600px;
  min-width: 328px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);

  .header {
    padding: 16px;
    position: relative;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 24px;
    line-height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .closeBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .content {
    padding: 20px 24px 30px;
  }

  .nftImageContainer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
  }

  .titleContainer {
    margin-bottom: 30px;
  }

  .title {
    display: flex;
    align-items: center;
    margin-bottom: 25px;
  }

  .chainIcon {
    margin-right: 6px;
  }

  .claimButton {
    width: 208px;
    padding: 13px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arrowsContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .arrowContainer {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .arrowButton {
    padding: 0;
    width: 40px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.left {
      margin-right: 8px;

      .arrowIcon {
        transform-origin: center;
        transform: rotate(-90deg);
      }
    }

    &.right {
      margin-left: 8px;

      .arrowIcon {
        transform-origin: center;
        transform: rotate(90deg);
      }
    }
  }

  .desktop {
    display: none;
  }

  .transaction {
    padding: 12px 10px;
    border-radius: 10px;
    border: 0.5px solid #87f696;
    background: #242626;
  }

  @media screen and (min-width: 768px) {
    .nftImage {
      width: 300px;
      height: 300px;
    }

    .titleContainer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      margin-bottom: 0;
    }

    .desktop {
      display: initial;
    }
  }
`;
