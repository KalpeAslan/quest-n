import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const LoginWrapper = styled(Box)`
  flex: 1;
  width: 100%;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .link {
    text-decoration: none;
  }

  .link:hover,
  .link:active,
  .link:focus {
    text-decoration: none;
  }

  .link:focus-visible,
  .link-u:focus-visible {
    outline: none;
    color: #87f696;
    text-decoration: underline;
  }

  @media (min-width: 768px) {
    padding: 0 24px;
  }

  @media (min-width: 1280px) {
    max-width: 1180px;
    margin-right: auto;
    margin-left: auto;
  }

  @media (min-width: 1440px) {
    padding: 0 55px;
  }
`;
