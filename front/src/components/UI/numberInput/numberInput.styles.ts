import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{ error: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 4px;
  width: 100%;
  color: var(--input-primary-text-color);
  background-color: transparent;
  border: ${props =>
    props.error
      ? "1px solid var(--input-primary-error-color)"
      : "1px solid var(--input-primary-border-color)"};
  font-family: var(--font-family-1);
  font-size: 16px;
  line-height: 22px;
  border-radius: 10px;
  outline: none;

  .input-primary-text-color {
    color: var(--input-primary-text-color) !important;
  }

  &:hover {
    border: 1px solid var(--input-primary-focus-border-color);
  }

  &:focus-within {
    border: ${props =>
      props.error
        ? "1px solid var(--input-primary-error-color)"
        : "1px solid var(--input-primary-focus-border-color)"};
    outline: ${props =>
      props.error
        ? "2px solid var(--input-primary-error-color)"
        : "2px solid var(--input-primary-focus-outline-border-color)"};
    outline-offset: 2px;
  }

  .btn {
    width: 40px;
    height: 40px;
    min-width: 40px !important;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &.disabled {
      background: rgba(250, 250, 250, 0.1);
      color: rgba(250, 250, 250, 0.3);
    }
  }
`;
