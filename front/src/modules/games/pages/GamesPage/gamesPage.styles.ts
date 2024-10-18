import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  margin-bottom: 80px;

  .heroWrapper {
    min-width: 360px;
    min-height: 642px;
    margin-bottom: 80px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .heroImage {
    width: 100%;
  }

  .heroContent {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 34px);
  }

  .heroButton {
    display: block;
    margin: 0 auto;
  }

  .desktop {
    display: none;
  }

  .iframe {
    width: 100%;
    height: 100%;
    border: none;
    min-height: 642px;
  }

  @media screen and (min-width: 768px) {
    margin-bottom: 90px;

    .heroWrapper {
      margin-bottom: 90px;
      min-height: 681px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .iframe {
      min-height: 681px;
    }

    .mobile {
      display: none;
    }

    .desktop {
      display: block;
    }
  }
`;
