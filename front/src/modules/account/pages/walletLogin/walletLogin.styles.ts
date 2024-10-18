import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .loader {
    margin: 0 auto;
    margin-bottom: 32;
  }

  .buttonsContainer {
    display: flex;
    margin: 0 auto;
    max-width: 480px;
    min-width: 288px;
    justify-content: space-between;
    margin-top: 20px;
  }

  .button {
    width: calc((100% - 30px) / 2);
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .desktop {
      display: initial;
    }
  }
`;
