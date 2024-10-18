import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Icon } from "@components/UI/icon";

type TSidebarStylesWrapper = {
  opend: boolean;
};

type TSidebarStylesIcon = {
  opened: boolean;
};

export const SidebarStylesWrapper = styled.section<TSidebarStylesWrapper>`
  position: fixed;
  top: var(--header-height);
  bottom: 0;
  left: calc(-100% - 6px);
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--sidebar-background-color);
  box-shadow: 0 5px 6px var(--sidebar-box-shadow-color);
  font-family: var(--font-family-1);
  overflow: auto;
  z-index: 11;
  transition: left 0.3s;
  max-height: 100%;

  ${props => props.opend && "left: 0"};

  .mobile {
    display: block;
  }

  .createQuest {
    width: calc(100% - 32px);
    margin: 0 auto;
    margin-bottom: 16px;
  }

  @media (min-width: 1280px) {
    display: none;
    position: relative;
    top: 0;
    left: 0;
    width: var(--sidebar-width);
    min-width: var(--sidebar-width);

    .mobile {
      display: none;
    }
  }
`;

export const SidebarStylesNavWrapper = styled.nav`
  position: relative;
  flex: 1;
  display: flex;
  z-index: 2;
`;

export const SidebarStylesNav = styled.ul`
  margin: 20px 18px 0 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  list-style: none;

  .divider {
    margin-bottom: 17px;
    margin-top: 17px;
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  &.c-button-main {
    flex: 1;
  }
`;

export const SidebarStylesNavItem = styled.li`
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  &.explore {
    margin-bottom: 0;
  }
`;

export const SidebarStylesIcon = styled(props => (
  <Icon {...props} />
))<TSidebarStylesIcon>`
  margin-right: 0 !important;
  margin-left: auto;
  color: var(--sidebar-select-color);
  opacity: 0.3;
  ${props => props.opened && "transform: rotate(180deg);"}
`;

export const SidebarStylesSubmenu = styled.ul`
  margin-top: 8px;
  padding-left: 44px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  & a {
    color: var(--sidebar-submenu-text-color);
    text-decoration: none;
    transition: color 0.3s;
  }

  & a:hover,
  & a.active {
    color: var(--sidebar-submenu-hover-text-color);
  }

  & a:focus-visible {
    outline: 1px solid var(--button-primary-hover-background-color);
    border-radius: 4px;
    outline-offset: 1px;
  }
`;

export const SidebarStylesLanguageSelector = styled(Box)`
  margin: 0 auto;
  margin-bottom: 16px;
  position: relative;
  height: 40px;
  width: 100%;
  z-index: 10;

  .selector {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  @media (min-width: 1280px) {
    display: none;
  }
`;

export const SidebarStylesFooter = styled.div`
  position: relative;
  z-index: 1;
`;

export const SidebarStylesFooterBord = styled.div`
  display: none;

  @media (min-width: 1280px) {
    display: block;
  }
`;

export const SidebarStylesFooterContent = styled.div`
  position: relative;
  margin: 10px 20px 40px;
  text-align: center;
  z-index: 2;
`;

export const SidebarStylesFooterTitle = styled(Box)`
  color: var(--sidebar-footer-text);
`;

export const SidebarStylesAccount = styled(Box)`
  display: block;

  @media (min-width: 1280px) {
    display: none;
  }
`;

export const CreatePartnerProjectStep = styled(Box)`
  color: #ffffff;
  display: flex;
  align-items: center;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffffff;
    margin-right: 8px;
  }
`;
