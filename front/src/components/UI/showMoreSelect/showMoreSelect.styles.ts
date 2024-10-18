import styled from "@emotion/styled";

export const Wrapper = styled.section`
  .menu-btn {
    border-radius: 10px;
    width: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
    background-color: var(--button-secondary-background-color);
    border: none;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .menu-btn.opened {
    border-bottom: 1px solid rgb(255 255 255 / 10%);
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
  }

  .menu-btn:hover {
    background-color: var(--button-secondary-hover-background-color);
  }

  .menu-btn:focus-visible {
    outline: 2px solid var(--button-link-border-color);
    outline-offset: 2px;
  }

  .menu-btn-icon {
    display: flex;
    align-items: center;
  }

  .content {
    display: none;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    overflow: hidden;
  }

  .content.show {
    display: flex;
    flex-direction: column;
  }

  .button {
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

  .icon {
    height: 22px;
    display: flex;
    align-items: center;
  }

  .button.active {
    color: #87f696;
    background-color: rgb(135 246 150 / 10%);
  }

  .button:hover {
    background-color: rgb(135 246 150 / 20%);
    cursor: pointer;
  }

  .button.active:focus-visible,
  .button:focus-visible {
    background-color: rgb(135 246 150 / 20%);
  }
`;
