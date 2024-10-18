import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Button } from "../UI/button";
import { Box } from "@mui/material";

export const AccountStyledButtons = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 10px;
  position: relative;
`;

export const AccountStyledButtonStyles = css`
  flex: 1;
  height: 40px !important;
  padding: 8px 12px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent !important;
  border: none !important;
  white-space: nowrap;
  text-decoration: none;
  transition: background-color 0.3s;

  &.button-left {
    border-radius: 10px 0 0 10px !important;
  }

  &.button-right {
    border-radius: 0 10px 10px 0 !important;
  }

  &.button-left:focus-visible,
  &.button-right:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color) !important;
    outline-offset: 2px;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.05) !important;
    cursor: not-allowed;
  }

  &:hover {
    background-color: rgba(217, 217, 217, 0.05) !important;
    cursor: pointer;
  }

  &.button-connected:hover {
    background-color: rgba(217, 217, 217, 0.05) !important;
    cursor: pointer;
  }

  &.button-connected:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: 2px;
  }

  .image,
  .svg {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
  }

  .image {
    color: #000;
    border: 1px solid transparent;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .svg {
    color: #fafafa;
    border: 1px solid #fafafa;
  }
`;

export const AccountStyledButton = styled(Button)`
  ${AccountStyledButtonStyles}
`;

export const AccountStyledDecor = styled.div`
  width: 1px;
  height: 20px;
  background-color: rgba(217, 217, 217, 0.1);
  opacity: 1;
  transition: opacity 0.3s;
`;

export const AccountDropdown = styled(Box)`
  position: absolute;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101313;

  .button {
    width: 180px;
    text-align: left;
    border-radius: 0;
    padding: 15px 16px 12px;

    &:last-child {
      padding-top: 12px;
      padding-bottom: 15px;
    }
  }

  .divider {
    background: rgba(255, 255, 255, 0.1);
    width: 149px;
    height: 1px;
    margin: 0 auto;
  }

  top: calc(100% + 5px);
`;

export const LoginButton = styled(Button)`
  text-align: center;
`;
