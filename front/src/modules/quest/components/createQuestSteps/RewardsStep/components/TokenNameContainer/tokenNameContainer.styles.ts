import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  margin-bottom: 20px;

  .selectorWrapper {
    width: 100%;
    margin-bottom: 20px;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .selector {
    width: 100%;

    ul {
      width: 100%;
    }
  }

  @media screen and (min-width: 768px) {
    .selectorWrapper {
      margin-bottom: 0;
    }

    .selectorWrapper.token {
      margin-bottom: 0;
      margin-right: 16px;
      max-width: 200px;
    }

    .selectorWrapper.chain {
      flex-grow: 1;
    }

    .selectorsContainer {
      display: flex;
    }
  }
`;
