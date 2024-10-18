import styled from "@emotion/styled";

export const AccountSidebarStylesWrapper = styled.div`
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

  &.opend {
    left: 0;
  }

  .nav-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    z-index: 2;
  }

  .icon {
    margin-right: 0 !important;
    margin-left: auto;
    color: var(--sidebar-select-color);
    opacity: 0.3;
  }

  .icon.opened {
    transform: rotate(180deg);
  }

  .button {
    padding: 11px !important;
  }

  @media (min-width: 1280px) {
    & {
      display: none;
    }

    .account {
      display: none;
    }
  }
`;

export const AccountSidebarStyledNavWrapper = styled.nav`
  position: relative;
  flex: 1;
  display: flex;
  z-index: 2;

  & .nav {
    margin: 20px 18px 0 20px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    list-style: none;

    .c-button-main {
      flex: 1;
    }
  }

  & .account-edit-button {
    padding: 20px;
  }
`;

export const AccountSidebarStyledFooter = styled.footer`
  margin: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  button {
    margin-bottom: 24px;
  }
`;
