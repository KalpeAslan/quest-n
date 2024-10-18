import styled from "@emotion/styled";

export const Link = styled.a`
  min-width: auto !important;
  white-space: nowrap;

  font-family: var(--font-family-1);
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 10px;
  border: 1px solid;
  border-color: transparent;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s, border 0.3s, color 0.3s;
  text-decoration: none;
  color: var(--button-task-text-color);
  background: var(--button-task-background-color);
  &:hover {
    background: var(--button-task-hover-background-color);
  }
  &:active {
    background: var(--button-task-hover-background-color);
  }
  &:visited {
    background: var(--button-task-pressed-background-color);
  }
  &:focus {
    background: var(--button-task-focus-background-color);
  }
  &:focus-visible {
    outline: 2px solid var(--button-task-border-color);
    outline-offset: 2px;
  }
  &.disabled {
    color: var(--button-task-disabled-text-color);
    cursor: not-allowed;
  }
`;
