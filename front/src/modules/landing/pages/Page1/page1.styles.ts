import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding-top: 84px;
  padding-bottom: 50px;

  .title {
    max-width: 334px;
    margin: 0 auto;
    margin-bottom: 18px;
  }

  .decoratedBlock {
    display: block;
    position: relative;
  }

  .decoratedText {
    z-index: 1;
    position: relative;
  }

  .decorator {
    position: absolute;
    width: 186px !important;
    height: 50px !important;
    top: -5px;
    left: 50%;
    transform: translateX(calc(-50% - 5px));
  }

  .subTitle {
    margin: 0 auto;
    margin-bottom: 31px;
    max-width: 256px;
  }

  .button {
    display: block;
    padding: 25px 70px;
    margin: 0 auto;
  }

  .imageWrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .imageDesktop {
    display: none;
  }

  @media screen and (min-width: 1024px) {
    .title {
      width: 1060px;
      max-width: 98%;
      margin-bottom: 21px;
    }

    .decoratedBlock {
      display: initial;
    }

    .decorator {
      width: 335px !important;
      height: 115px !important;
      top: -15px;
    }

    .subTitle {
      max-width: 568px;
    }

    .imageMobile {
        display: none;
    }

    .imageDesktop {
      display: initial;
      width: 100%;
      height: auto;
    }
  }
`;
