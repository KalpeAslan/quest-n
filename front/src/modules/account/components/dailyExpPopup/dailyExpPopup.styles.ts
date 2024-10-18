import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding: 46px 24px 30px;
  width: 90vw;
  max-width: 479px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  position: relative;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);

  .closeBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .icon {
    width: 135px;
    height: 104px;
    margin-bottom: 30px;
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button {
    padding: 13px 24px !important;

    &.left {
      min-width: 110px;
      margin-right: 30px;
    }

    &.right {
      min-width: 180px;
    }
  }
`;
