import styled from "@emotion/styled";

export const Form = styled.form`
  margin-top: 20px;

  .input {
    position: relative;
  }

  .error {
    text-align: left;
    position: absolute;
    bottom: 0;
    transform: translateY(calc(100% + 4px));
  }
`;
