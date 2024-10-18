import styled from "@emotion/styled";

export const Wrapper = styled.form`
  .prompt {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 8px 14px 13px;
    border-radius: 4px;
    background: #2e3535;
    margin-bottom: 25px;
  }

  .closePrompt {
    cursor: pointer;
  }

  .promptIcon {
    margin-right: 7px;
  }

  .tooltip {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d7d7d7;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .logoInput {
    margin-bottom: 25px;
  }

  .input {
    position: relative;

    ul {
      width: 100%;
    }
  }

  .error {
    font-size: 12px;
    line-height: 12px;
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 2px));
  }

  .selectorContainer {
    width: 52px;
    height: 32px;
    border: 1px solid #ffffff1a;
    border-radius: 32px;
    cursor: pointer;
    position: relative;
  }

  .selector {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff4d;
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(6px, -50%);
    transition: 0.3s;
  }

  .selector.checked {
    background: #87f696;
    transform: translate(26px, -50%);
  }

  .submitButton {
    min-width: 257px !important;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .buttonLoader {
    margin-right: 10px;
  }

  .disabledButton {
    background: rgba(250, 250, 250, 0.1) !important;
    color: #6a6a6a !important;
  }

  @media screen and (min-width: 768px) {
    .inputsContainer {
      display: flex;
      gap: 25px;
    }

    .textInputs {
      flex-grow: 1;
    }

    .logoInput {
      margin-bottom: 0;
    }
  }
`;
