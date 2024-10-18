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
`;
