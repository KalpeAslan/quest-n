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
    padding: 30px 24px;

    * {
      white-space: pre-wrap;
    }
  }

  .nftImageContainer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .nftImageWrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    overflow: hidden;
  }

  .infoItem {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.paddingTop {
      padding-top: 20px;
    }

    &:not(:first-child) {
      padding-top: 20px;
    }

    &:not(:last-child) {
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }

  .infoItemData {
    display: flex;
    align-items: center;
  }

  .infoItemIcon {
    margin-left: 5px;

    &.copy {
      cursor: pointer;
    }
  }
`;
