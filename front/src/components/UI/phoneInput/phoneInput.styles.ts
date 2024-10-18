import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  color: var(--input-primary-text-color);
  background-color: rgb(16 19 19 / 100%);
  border: 1px solid var(--input-primary-border-color);
  border-radius: 10px;

  & input {
    padding: 12px 16px 12px 8px;
    color: var(--input-primary-text-color);
    background-color: transparent;
    border: none;
    font-family: var(--font-family-1);
    font-size: 16px;
    line-height: 22px;
    outline: none;
  }

  & .PhoneInputCountry {
    padding-left: 12px;
  }

  &:hover {
    border: 1px solid var(--input-primary-focus-border-color);
  }

  &.touched.invalid {
    border: 1px solid var(--input-primary-error-color);
  }

  &.focus {
    border: 1px solid var(--input-primary-focus-border-color);
    outline: 2px solid var(--input-primary-focus-outline-border-color);
    outline-offset: 2px;
  }

  &.focus.invalid {
    border: 1px solid var(--input-primary-error-color);
    outline: 2px solid var(--input-primary-error-color);
    outline-offset: 2px;
  }
`;
