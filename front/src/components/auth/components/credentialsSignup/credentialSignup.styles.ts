import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 100%;

  @media (min-width: 360px) {
    max-width: 328px;
  }
`;

export const Form = styled.form`
  width: 100%;

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

  .helper {
    font-family: var(--font-family-1);
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgba(255, 255, 255, 0.3);
  }

  .butt {
    width: 100%;
  }

  @media (min-width: 360px) {
    max-width: 328px;
  }
`;

export const Policy = styled(Box)`
  opacity: 0.3;
  text-align: left;
`;
