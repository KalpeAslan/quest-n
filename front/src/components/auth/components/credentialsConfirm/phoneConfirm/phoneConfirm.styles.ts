import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled.form`
  width: 100%;
  max-width: 328px;

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
    transform: translateY(calc(100% + 2px));
  }
`;

export const Policy = styled(Box)`
  opacity: 0.3;
  text-align: left;
`;
