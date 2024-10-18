import styled from "@emotion/styled";

export const SearchInputStylesContainer = styled.div`
  position: relative;
  width: 100%;
  display: inline-block;
  max-width: 328px;
  z-index: 999999;
`;

export const SearchInputStylesInputWrapper = styled.form`
  position: relative;
  z-index: 2;

  input {
    width: 100%;
    padding-right: 44px;
  }

  .button {
    position: absolute;
    top: 2px;
    right: 2px;
    padding: 12px !important;
  }

  .dropdown-enter {
    opacity: 0;
    pointer-events: none;
  }

  .dropdown-enter-active {
    opacity: 1;
    pointer-events: all;
    transition: opacity 200ms ease-in;
  }

  .dropdown-exit {
    opacity: 1;
  }

  .dropdown-exit-active {
    opacity: 0;
    pointer-events: all;
    transition: all 200ms ease-in;
  }
`;

export const SearchInputStylesDropdown = styled.ul`
  width: 100%;
  max-height: 320px;
  display: flex;
  flex-direction: column;
  background-color: var(--menu-background-color);
  border-radius: 10px;
  list-style: none;
  overflow: auto;

  .item {
    width: 100%;
    padding: 12px 13px;
    display: flex;
    align-items: flex-start;
    color: #fff;
    background-color: rgb(39 42 42 / 100%);
    border: none;
    text-align: left;
    transition: background-color 0.3s;
    outline: none;
  }

  .item span {
    color: #87f696;
  }

  .item:hover {
    background-color: rgb(135 246 150 / 20%);
    cursor: pointer;
  }

  .item.active:focus-visible,
  .item:focus-visible {
    background-color: rgb(135 246 150 / 20%);
  }
`;
