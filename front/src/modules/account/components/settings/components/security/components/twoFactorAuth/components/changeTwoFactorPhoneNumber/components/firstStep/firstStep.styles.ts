import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const FormWrapper = styled(Box)`
  max-width: 328px;

  .button {
    width: 100%;
    height: 48px;
  }
`;

export const FooterWrapper = styled(Box)`
  max-width: 328px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;

  .link {
    height: 22px;
    justify-content: center;
    color: rgb(255 255 255 / 30%) !important;
    font-weight: 400 !important;
    text-decoration: underline;
  }

  .link:not(:disabled):hover {
    color: rgb(255 255 255 / 50%) !important;
  }

  .link:disabled {
    color: rgb(255 255 255 / 20%) !important;
    text-decoration: none;
  }
`;
