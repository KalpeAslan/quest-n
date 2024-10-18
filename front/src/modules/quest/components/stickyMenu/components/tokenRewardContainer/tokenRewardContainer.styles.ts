import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  border-radius: 16px;
  border: 1px solid #87f696;
  background: var(--color-b25);
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background: linear-gradient(
      123deg,
      rgba(84, 126, 190, 0.2) 14.13%,
      rgba(81, 220, 94, 0.2) 85.37%
    );
  }

  .tokenLogoWrapper {
    width: fit-content;
    border-radius: 8px;
    overflow: hidden;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
