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
    padding: 20px 24px 30px;
  }

  .prevWallet {
    padding: 5px 10px;
    border-radius: 10px;
    background: rgba(158, 158, 158, 0.1);
    margin-bottom: 10px;
  }

  .buttonsContainer {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .button {
    width: calc((100% - 20px) / 2);
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
