import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  border-radius: 16px;
  background: #242626;
  text-align: center;
  padding: 10px;
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;

  &.shadow {
    border: 1px solid #87f696;
    box-shadow: 0px 4px 44px 0px rgba(135, 246, 150, 0.3);
  }
`;
