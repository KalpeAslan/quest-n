import styled from "@emotion/styled";

export const InputWrapper = styled.label<{ error: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  padding: 12px 35px 12px 16px;
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
`;
