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

  .icon {
    margin-bottom: 25px;
  }

  .text {
    text-align: center;
    margin-bottom: 20px;
  }

  .buttonsContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .btn {
    width: calc((100% - 15px) / 2);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    padding-top: 12px;
    padding-bottom: 12px;

    &.full {
      width: 100%;
    }
  }

  .btnIcon {
    margin-right: 10px;
  }

  .helper {
    color: rgba(255, 255, 255, 0.6);
  }
`;
