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
    padding: 11px 24px 24px;
  }

  .content.padding {
    padding: 24px;
  }

  .walletIcon {
    margin-bottom: 10px;
  }

  .icons {
    display: flex;
    color: #87f696;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .errorIconWrapper {
    color: #ff3d00;
    width: 82px;
    height: 82px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #ff3d00;
    border-radius: 50%;
    margin-bottom: 14px;
  }

  .mr-14 {
    margin-right: 14px;
  }

  .title {
    margin-bottom: 10px;
  }

  .text {
    text-align: center;
    margin-bottom: 24px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
  }

  .button {
    width: calc((100% - 16px) / 2);
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .desktop {
      display: initial;
    }
  }
`;
