import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  .logoInput {
    margin-bottom: 25px;
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

  @media screen and (min-width: 768px) {
    display: flex;
    gap: 25px;

    .textInputs {
      flex-grow: 1;
    }

    .logoInput {
      margin-bottom: 0;
    }
  }
`;
