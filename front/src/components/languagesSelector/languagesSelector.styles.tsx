import styled from "@emotion/styled";

export const Container = styled.div`
  padding: 4px;
  outline: 2px solid transparent;
  border-radius: 14px;
  margin-top: -3px;
  width: fit-content;

  &:has(:focus-visible) {
    outline: 2px solid #87f696;
    background: var(--color-b0);
  }

  .list {
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    list-style: none;
    padding: 0;
    margin: 0;
    height: 40px;
    overflow: hidden;
    background: var(--color-b0);
  }

  .list.opened {
    height: auto;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .item:first-of-type > .button {
    padding-top: 10px;
  }

  .item:last-child > .button {
    padding-bottom: 10px;
  }

  .button {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.3);
    font-family: var(--font-family-1);
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    cursor: pointer;
    background: var(--color-b0);
    border: none;
    outline: none;
    width: 100%;
    margin: 0;
    padding: 5px 12px;
  }

  .button:hover,
  .list.opened .button:focus-visible {
    background: rgba(255, 255, 255, 0.1);
  }

  .flagIcon {
    border-radius: 2px;
  }

  .icon {
    color: var(--sidebar-select-color);
    opacity: 0.3;
    margin-left: 4px;
  }

  .icon.opened {
    transform: rotate(180deg);
  }
`;
