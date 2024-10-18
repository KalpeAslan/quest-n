import { IButtonType } from "@/models";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const styles = {
  primary: css`
    color: var(--button-primary-text-color);
    background: var(--button-primary-background-color);
    &:hover {
      background: var(--button-primary-hover-background-color);
    }
    &:active {
      background: var(--button-primary-hover-background-color);
    }
    &:visited {
      background: var(--button-primary-pressed-background-color);
    }
    &:focus {
      background: var(--button-primary-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: var(--button-primary-disabled-background-color);
      cursor: not-allowed;
    }
  `,
  colorfull: css`
    overflow: hidden;
    position: relative;
    z-index: 2;
    color: #87f696;
    border: none;
    border-radius: 10px;
    background: linear-gradient(to right, #547ebe 0%, #51dc5e 100%) left 10px
        top / calc(100% - 20px) 1px no-repeat,
      linear-gradient(to right, #547ebe 0%, #51dc5e 100%) left 10px bottom /
        calc(100% - 20px) 1px no-repeat;
    &::before,
    &::after {
      content: "";
      position: absolute;
      height: calc(100% - 2px);
      width: 10px;
      top: 0;
    }
    &::before,
    &::after,
    *::before,
    *::after {
      box-sizing: content-box;
    }
    &::before {
      left: 0;
      border-radius: 10px 0 0px 10px;
      border: 1px solid #547ebe;
      border-right: none;
    }
    &::after {
      right: 0;
      border-radius: 0 10px 10px 0;
      border: 1px solid #51dc5e;
      border-left: none;
    }
    & div {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
    }
    & div::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(55.95deg, #547ebe 0%, #51dc5e 100%) 0 0 / auto
        100% no-repeat;
      opacity: 0;
      transition: opacity 0.3s ease 0s;
      z-index: -1;
    }
    &:not(.disabled):hover div::before {
      opacity: 0.5;
    }
    &:focus-visible {
      border-radius: 10px;
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: rgba(250, 250, 250, 0.1);
      color: #101313;
      cursor: not-allowed;

      &::before {
        border: none;
      }
      &::after {
        border: none;
      }
    }
  `,
  "colorfull-error": css`
    color: #fc5b3f;
    background: rgb(0 0 0 / 20%);
    border-color: #fc5b3f;
    font-size: 16px;
    line-height: 22px;
    &:hover {
      background: rgba(252, 91, 63, 0.05);
    }
    &:active {
      background: rgba(252, 91, 63, 0.1);
    }
    &:visited {
      background: rgba(252, 91, 63, 0.1);
    }
    &:focus {
      background: rgba(252, 91, 63, 0.05);
    }
    &:focus-visible {
      outline: 2px solid #fc5b3f;
      background: rgba(252, 91, 63, 0.05);
      outline-offset: 2px;
    }
    &.disabled {
      color: rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.25);
      border-color: rgba(255, 255, 255, 0.1);
      cursor: not-allowed;
    }
  `,
  secondary: css`
    color: var(--button-secondary-text-color);
    background: var(--button-secondary-background-color);
    backdrop-filter: blur(10px);
    &:hover {
      background: var(--button-secondary-hover-background-color);
    }
    &:active {
      background: var(--button-secondary-hover-background-color);
    }
    &:visited {
      background: var(--button-secondary-pressed-background-color);
    }
    &:focus {
      background: var(--button-secondary-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: var(--button-secondary-disabled-background-color);
      cursor: not-allowed;
    }
  `,
  ghost: css`
    color: var(--button-ghost-text-color);
    background: var(--button-ghost-background-color);
    &:hover {
      background: var(--button-ghost-hover-background-color);
    }
    &:active {
      background: var(--button-ghost-hover-background-color);
    }
    &:visited {
      background: var(--button-ghost-pressed-background-color);
    }
    &:focus {
      border-color: var(--button-ghost-focus-border-color);
      background: var(--button-ghost-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: var(--button-ghost-disabled-background-color);
      cursor: not-allowed;
    }
  `,
  outlined: css`
    color: var(--button-outlined-text-color);
    background: var(--button-outlined-background-color);
    border-color: var(--button-outlined-border-color);
    &:hover {
      background: var(--button-outlined-hover-background-color);
    }
    &:active {
      background: var(--button-outlined-hover-background-color);
    }
    &:visited {
      background: var(--button-outlined-pressed-background-color);
    }
    &:focus {
      background: var(--button-outlined-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: var(--button-outlined-disabled-background-color);
      cursor: not-allowed;
    }
  `,
  "w-primary": css`
    color: var(--button-wprimary-text-color);
    background: var(--button-wprimary-background-color);
    &:hover {
      background: var(--button-wprimary-hover-background-color);
    }
    &:active {
      background: var(--button-wprimary-hover-background-color);
    }
    &:visited {
      background: var(--button-wprimary-pressed-background-color);
    }
    &:focus {
      background: var(--button-wprimary-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-wprimary-border-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: var(--button-wprimary-disabled-background-color);
      cursor: not-allowed;
    }
  `,
  checked: css`
    color: var(--button-checked-text-color);
    background: var(--button-checked-background-color);
    &:hover {
      background: var(--button-checked-hover-background-color);
    }
    &:active {
      background: var(--button-checked-hover-background-color);
    }
    &:visited {
      background: var(--button-checked-pressed-background-color);
    }
    &:focus {
      background: var(--button-checked-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-checked-border-color);
      outline-offset: 2px;
    }
    &.disabled {
      color: var(--button-checked-disabled-text-color);
      background: var(--button-checked-disabled-background-color);
      cursor: not-allowed;
    }
  `,
  error: css`
    color: var(--button-error-text-color);
    background: var(--button-error-background-color);
    &:hover {
      background: var(--button-error-hover-background-color);
    }
    &:active {
      background: var(--button-error-hover-background-color);
    }
    &:visited {
      background: var(--button-error-pressed-background-color);
    }
    &:focus {
      background: var(--button-error-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-error-border-color);
      outline-offset: 2px;
    }
    &.disabled {
      color: var(--button-error-disabled-text-color);
      background: var(--button-error-disabled-background-color);
      cursor: not-allowed;
    }
  `,
  link: css`
    padding: 0 8px;
    color: var(--button-link-text-color);
    background: transparent;
    &:hover {
      text-decoration: underline;
    }
    &:active {
      text-decoration: underline;
    }
    &:visited {
      text-decoration: underline;
    }
    &:focus {
      text-decoration: underline;
    }
    &:focus-visible {
      text-decoration: underline;
      outline: 2px solid var(--button-link-border-color);
      outline-offset: 2px;
    }
    &.disabled {
      color: var(--button-link-disabled-text-color);
      cursor: not-allowed;
    }
  `,
  task: css`
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
  `,
  store: css`
    height: 40px;
    padding: 0;
    color: transparent;
    background: transparent;
    border: none;
    &:focus-visible {
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
  `,
  icon: css`
    padding: 0;
    background: transparent;
    line-height: 1;
    border: none;
    display: flex;
    align-items: center;
    &:focus-visible {
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      color: var(--button-task-disabled-text-color);
      cursor: not-allowed;
    }
  `,
  "checked-disabled": css`
    color: var(--button-checked-text-color);
    background: var(--button-checked-background-color);
    &:hover {
      background: var(--button-checked-hover-background-color);
    }
    &:active {
      background: var(--button-checked-hover-background-color);
    }
    &:visited {
      background: var(--button-checked-pressed-background-color);
    }
    &:focus {
      background: var(--button-checked-focus-background-color);
    }
    &:focus-visible {
      outline: 2px solid var(--button-checked-border-color);
      outline-offset: 2px;
    }
    &.disabled {
      color: var(--button-checked-disabled-text-color);
      background: var(--button-checked-background-color);
      cursor: not-allowed;
    }
  `,
  roundedColorfull: css`
    overflow: hidden;
    position: relative;
    z-index: 2;
    color: #87f696;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    &:before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50px;
      padding: 1px;
      background: linear-gradient(to right, #547ebe 0%, #51dc5e 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
    & div {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
    }
    & div::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: linear-gradient(55.95deg, #547ebe 0%, #51dc5e 100%) 0 0 / auto
        100% no-repeat;
      opacity: 0;
      transition: opacity 0.3s ease 0s;
      z-index: -1;
    }
    &:not(.disabled):hover div::before {
      opacity: 0.5;
    }
    &:focus-visible {
      border-radius: 10px;
      outline: 2px solid var(--button-primary-hover-background-color);
      outline-offset: 2px;
    }
    &.disabled {
      background: rgba(250, 250, 250, 0.1);
      color: #101313;
      cursor: not-allowed;

      &::before {
        border: none;
      }
      &::after {
        border: none;
      }
    }
  `,
};

export const ButtonStyled = styled.button<{
  size: "extraSmall" | "small" | "medium" | "task";
  btnStyle: IButtonType;
  rounded: boolean;
}>`
  padding: ${props => {
    if (props.size === "extraSmall") return "10px";
    if (props.size === "small") return "9px 20px";
    if (props.size === "task") return "8px 12px";
    return "13px 24px";
  }};
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

  .loadtrt {
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${props => styles[props.btnStyle]}
`;
