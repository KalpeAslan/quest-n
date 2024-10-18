import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Footer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

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
