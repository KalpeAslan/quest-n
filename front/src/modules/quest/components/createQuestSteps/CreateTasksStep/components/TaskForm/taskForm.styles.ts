import styled from "@emotion/styled";

export const Wrapper = styled.form<{ lightBorder: boolean }>`
  padding: 16px;
  background: rgba(0, 0, 0, 0.33);
  border-radius: 16px;
  color: var(--text-color-2);

  .iconWrapper {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .numberInput {
    max-width: 204px;
  }

  .input {
    position: relative;
    color-scheme: dark;
  }

  .error {
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 2px));
  }

  .btn {
    max-width: 140px;
  }
`;
