import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  background: #181c1c;
  z-index: 5;
  padding: 26px 60px;
  display: flex;
  justify-content: flex-end;

  @supports (bottom: constant(safe-area-inset-bottom)) or
    (bottom: env(safe-area-inset-bottom)) {
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
  }

  .rightWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
  }

  .previewButton {
    width: 48px;
    height: 48px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
