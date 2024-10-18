import styled from "@emotion/styled";
import { Button } from "@components/UI/button";
import Link from "next/link";
import { Box } from "@mui/material";
import { css } from "@emotion/react";

export const Wrapper = styled(Box)`
  position: relative;
  height: var(--header-height);
  min-height: var(--header-height);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const HeaderStylesHeader = styled.header<{ iframe?: boolean }>`
  position: relative;
  height: var(--header-height);
  min-height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: ${props => (props.iframe ? "center" : "flex-start")};
  background: var(--header-background-color);
  box-shadow: 0 1px 6px var(--header-box-shadow-color);
  z-index: 6;
`;

const NavBar = styled(Box)`
  display: none;
  margin-left: 62px;

  .link {
    text-decoration: none;
    transition: color 0.3s;

    &:hover,
    &.active {
      color: var(--sidebar-submenu-hover-text-color);
    }

    &:not(:last-child) {
      margin-right: 62px;
    }
  }

  @media screen and (min-width: 1280px) {
    display: flex;
  }
`;

const HeaderStylesAccountWrapper = styled.div<{ iframe?: boolean }>`
  ${props =>
    props.iframe
      ? `
    position: absolute;
    left: 16px;
  `
      : `
    width:24px;
  `}

  @media (min-width: 1280px) {
    display: none;
  }
`;

const HeaderStylesLogoCss = css`
  flex: 1;
  max-width: 146px;
  height: 25px;
  margin-right: auto;
  display: inline-flex;
  align-items: center;
  color: var(--header-logo-color);
  outline: none;

  &.acc {
    margin-left: auto;
  }

  &:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    border-radius: 4px;
    outline-offset: 4px;
  }

  @media (min-width: 1280px) {
    flex: auto;
    width: 187px;
    height: 32px;
    margin-right: 20px;
    margin-left: 0;

    &.acc {
      margin-left: 0;
    }
  }
`;

const HeaderStylesLogo = styled(Link)<{ iframe?: boolean }>`
  ${HeaderStylesLogoCss}

  ${props =>
    props.iframe &&
    `
    margin-right: auto;
    margin-left: auto !important;
  `}
`;
const HeaderStylesLogoItem = styled.span`
  ${HeaderStylesLogoCss};

  &:hover {
    cursor: pointer;
  }
`;

const HeaderStylesMenu = styled(props => <Button {...props} />)`
  display: flex;
  align-items: center;
  color: var(--nav-menu-icon-color);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    border-radius: 4px;
    outline-offset: 2px;
  }

  @media (min-width: 1280px) {
    display: none !important;
  }
`;

const HeaderStylesAccount = styled(props => <Button {...props} />)`
  width: ${props => (props.iframe ? "24px" : "30px")};
  height: ${props => (props.iframe ? "24px" : "30px")};
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ isMd, iframe, loggedIn }) =>
    isMd
      ? css`
          border-radius: 11px;
          width: 45px;
          height: 32px;
          padding: 6px;
          background: rgba(135, 246, 150, 0.07);

          .header__md__avatar {
            width: 24px;
            height: 24px;
          }
        `
      : css`
          border: 1px solid
            ${iframe && !loggedIn
              ? "#ffffff"
              : "rgb(135 246 150 / 30%)"}!important;
          border-radius: 50% !important;

          &.image {
            color: #000;
            border: 1px solid transparent;
            overflow: hidden;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center;
            }
          }
        `}

  &.svg {
    color: #fafafa;
  }
`;

const HeaderStylesWallet = styled(Box)`
  display: none;

  .adminButton {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
  }

  @media (min-width: 1280px) {
    display: block;
  }
`;

export {
  HeaderStylesWallet,
  HeaderStylesAccount,
  HeaderStylesLogo,
  HeaderStylesMenu,
  HeaderStylesHeader,
  HeaderStylesAccountWrapper,
  HeaderStylesLogoItem,
  NavBar,
};
