import styled from "@emotion/styled";

export const Wrapper = styled.section`
  width: 90vw;
  max-width: 480px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);

  .header {
    padding: 16px;
    position: relative;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 24px;
    line-height: 24px;
    padding-right: 45px;
  }

  .closeBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }

  .mbButton {
    margin-bottom: 24px;
  }

  .gotBtn {
    width: 208px;
  }

  .checkboxContainer {
    width: 165px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .checkbox {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
`;
