import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Form = styled.form`
  margin-top: 20px;

  &.paddings {
    padding-right: 5px;
    padding-left: 5px;
  }

  .input {
    position: relative;
  }

  .error {
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 4px));
  }
`;

export const PassReset = styled(Box)`
  font-family: var(--font-family-1);
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  text-decoration-line: underline;
  color: rgba(255, 255, 255, 0.3);
  margin-top: 12px;
  text-align: left;
`;
