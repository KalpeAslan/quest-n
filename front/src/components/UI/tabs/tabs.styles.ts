import styled from "@emotion/styled";

export const Wrapper = styled.section<{ isDisabled?: boolean }>`
  pointer-events: ${props => (props.isDisabled ? "none" : "all")};

  &.tabs {
    display: flex;
    align-items: center;
  }

  &.tabs-s {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &.tabs-t {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .tab {
    flex: 1;
    padding: 12px;
    color: var(--tabs-border-color);
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--tabs-border-color);
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    cursor: pointer;
  }

  .tab-s {
    flex: 1;
    padding: 4px;
    color: #fff;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    cursor: pointer;
  }

  .tab-t {
    flex: 1;
    padding: 4px;
    color: #fff;
    background-color: transparent;
    border: none;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    cursor: pointer;
    white-space: nowrap;
    font-size: 14px;
    opacity: 0.6;
  }

  .tab:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: "2px";
  }

  .tab-s:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: "2px";
  }

  .active-tab {
    color: var(--tabs-active-text-color);
    border-bottom: 1px solid var(--tabs-active-border-color);
    cursor: initial;
  }

  .active-tab-s {
    color: #87f696;
    border-bottom: 1px solid #87f696;
    cursor: initial;
  }

  .active-tab-t {
    border-bottom: 1px solid #87f696;
    cursor: initial;
    opacity: 1;
  }
`;
