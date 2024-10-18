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

  .mr {
    margin-right: 20px !important;
  }

  .btn {
    display: block;
    max-width: 208px;
    margin: 0;
    font-size: 16px;
    line-height: 22px;
    padding: 0;
    padding: 13px 10px;
  }
`;
