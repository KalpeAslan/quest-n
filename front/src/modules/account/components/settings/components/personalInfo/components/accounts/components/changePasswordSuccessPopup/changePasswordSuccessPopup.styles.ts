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
  position: relative;
  padding: 40px 24px 30px;

  .closeBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .button {
    max-width: 252px;
    margin: 0 auto;
  }
`;
