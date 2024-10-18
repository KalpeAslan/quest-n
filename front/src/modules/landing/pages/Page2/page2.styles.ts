import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding-top: 43px;
  padding-bottom: 85px;

  .title {
    text-align: center;
    max-width: 334px;
    margin: 0 auto;
    margin-bottom: 25px;
  }

  .subTitle {
    text-align: center;
    max-width: 292px;
    margin: 0 auto;
    margin-bottom: 34px;
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

  .benefitsTitle {
    margin-bottom: 30px;
  }

  .splide {
    margin: 0 auto;
  }

  .splide__arrows {
    display: none;
  }

  @media screen and (min-width: 1024px) {
    .topWrapper {
      display: flex;
      margin-bottom: 187px;
    }

    .title {
      max-width: 554px;
      text-align: left;
      margin-bottom: 30px;
    }

    .subTitle {
      max-width: 444px;
      text-align: left;
      margin: 0;
      margin-bottom: 40px;
    }

    .button {
      margin: 0;
    }

    .imageMobile {
      display: none;
    }

    .imageWrapper {
      position: relative;
      flex: 1;
    }

    .imageDesktop {
      display: initial;
      position: absolute;
      left: -288px;
    }
  }
`;
