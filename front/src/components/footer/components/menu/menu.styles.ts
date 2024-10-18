import styled from "@emotion/styled";

const FooterMenuStylesMenu = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  list-style: none;

  & .footer_menu__link {
    color: var(--sidebar-submenu-text-color);
    text-decoration: none;
    transition: color 0.3s;

    &:not(.disabled):hover,
    &.active {
      color: var(--sidebar-submenu-hover-text-color);
    }
  }

  & .footer_menu__disabled {
    color: var(--menu-item-disabled-color);
    cursor: not-allowed;
  }
`;

const FooterMenuStylesSoon = styled.span`
  margin-left: 4px;
  color: var(--menu-item-disabled-color);
`;

export { FooterMenuStylesSoon, FooterMenuStylesMenu };
