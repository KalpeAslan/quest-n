import styled from "@emotion/styled";
import { Box } from "@mui/material";

import launchM from "@assets/images/home-page/launch-m-2x.webp";
import launchM2x from "@assets/images/home-page/launch-m-2x.webp";
import launchD from "@assets/images/home-page/launch-d.webp";
import launchD2x from "@assets/images/home-page/launch-d-2x.webp";

export const Wrapper = styled(Box)`
  position: static;

  .wrapper {
    position: static;
  }

  .decor {
    width: calc(100% + 32px);
    height: 315px;
    margin: 0 -16px -15px;
    display: inline-block;
    background-image: url(${launchM.src});
    background-image: -webkit-image-set(
      url(${launchM.src}) 1x,
      url(${launchM2x.src}) 2x
    );
    background-image: image-set(
      url(${launchM.src}) 1x,
      url(${launchM2x.src}) 2x
    );
    background-repeat: no-repeat;
    background-position: top -30px left -40px;
  }

  .button {
    width: 100%;
    margin-top: 24px;
  }

  @media (min-width: 540px) {
    .decor {
      background-position: top 0 center;
    }
  }

  @media (min-width: 768px) {
    .content {
      text-align: center;
    }

    .decor {
      width: calc(100% + 100px);
      height: 650px;
      margin: 0;
      background-image: url(${launchD.src});
      background-image: -webkit-image-set(
        url(${launchD.src}) 1x,
        url(${launchD2x.src}) 2x
      );
      background-image: image-set(
        url(${launchD.src}) 1x,
        url(${launchD2x.src}) 2x
      );
      margin-top: -20px;
      margin-left: -60px;
      background-position: top -120px left;
    }

    .button {
      width: initial;
    }

    .title,
    .text,
    .button {
      position: relative;
      z-index: 1;
    }
  }

  @media (min-width: 1024px) {
    .wrapper {
      position: relative;
      margin-top: -160px;
      padding: 160px 24px 0;
    }

    .content {
      max-width: 536px;
      margin-bottom: 200px;
      margin-left: auto;
      text-align: left;
    }

    .decor {
      position: absolute;
      top: 0;
      left: 0;
      height: 735px;
      margin-top: 40px;
      margin-left: -20px;
      background-size: 70%;
      background-position: top -15px left;
    }
  }

  @media (min-width: 1345px) {
    .decor {
      background-position: top -15px left -25px;
    }
  }
`;
