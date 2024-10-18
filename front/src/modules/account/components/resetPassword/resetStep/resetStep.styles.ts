import styled from "@emotion/styled";

export const Form = styled.form`
  width: 100%;
  max-width: 328px;

  .input {
    position: relative;
  }

  .error {
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 2px));
  }

  .helper {
    font-family: var(--font-family-1);
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: rgba(255, 255, 255, 0.3);
  }

  .butt {
    width: 100%;
  }
`;
