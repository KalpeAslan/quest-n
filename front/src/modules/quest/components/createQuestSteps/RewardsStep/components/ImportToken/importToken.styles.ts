import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const FormWrapper = styled.form`
  .submitButton {
    margin-top: 25px;
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

  .inputWrapper {
    position: relative;
  }

  .checkIcon {
    position: absolute;
    right: 8px;
    bottom: 12px;
  }

  @media screen and (min-width: 768px) {
    .nameInputsWrapper {
      display: flex;
      justify-content: space-between;
    }

    .nameInput {
      width: calc((100% - 15px) / 2);
    }
  }
`;

export const ImportedTokenWrapper = styled(Box)`
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  background: #1b1d1d;

  .closeImportedTokenIcon {
    cursor: pointer;
  }
`;
