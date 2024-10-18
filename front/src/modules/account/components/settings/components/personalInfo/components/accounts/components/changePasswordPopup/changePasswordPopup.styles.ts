import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 90vw;
  max-width: 345px;
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

  .input {
    position: relative;
  }

  .error {
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 2px));
  }

  .resetPassBtn {
    color: rgba(255, 255, 255, 0.3);
    text-decoration: underline;
    width: fit-content;
    margin: 0 auto;
    margin-top: 16px;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }
`;
