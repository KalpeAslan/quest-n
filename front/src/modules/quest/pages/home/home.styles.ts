import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { createQuestBg } from "../../assets";

export const Wrapper = styled(Box)`
  padding-top: 65px !important;
  padding-bottom: 80px !important;
  position: relative;

  .videoBg1 {
    position: absolute;
    top: -200px;
    right: -400px;
    width: 800px;
    height: 800px;
    z-index: -1;
  }

  .videoBg2 {
    display: none;
  }

  .videoBg3 {
    position: absolute;
    width: 500px;
    height: 500px;
    z-index: -1;
    top: 500px;
    left: -150px;
  }

  .videoBg4 {
    position: absolute;
    width: 500px;
    height: 500px;
    bottom: 100px;
    left: 0;
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 768px) {
    padding-top: 87px !important;
    padding-bottom: 120px !important;

    .videoBg2 {
      display: initial;
      position: absolute;
      width: 600px;
      height: 600px;
      bottom: 150px;
      left: -200px;
    }

    .videoBg3 {
      width: 800px;
      height: 800px;
      left: -400px;
      top: 500px;
    }

    .videoBg4 {
      width: 700px;
      height: 700px;
      bottom: 600px;
      left: initial;
      right: -200px;
    }

    .mobile {
      display: none;
    }

    .desktop {
      display: initial;
    }
  }

  @media screen and (min-width: 1024px) {
    padding-top: 100px !important;

    .videoBg1 {
      width: 900px;
      height: 900px;
    }

    .videoBg3 {
      top: 700px;
      left: -300px;
    }
  }

  @media screen and (min-width: 1280px) {
    padding-bottom: 110px !important;

    .videoBg1 {
      width: 1000px;
      height: 1000px;
    }

    .videoBg4 {
      right: -100px;
      bottom: 500px;
    }
  }

  @media screen and (min-width: 1440px) {
    .videoBg1 {
      width: 1200px;
      height: 1200px;
      top: -300px;
    }

    .videoBg4 {
      right: 0;
      bottom: 400px;
    }
  }
`;

export const MainContainer = styled(Box)`
  background-image: url(${createQuestBg.src});
  background-size: 573px 715px;
  background-position: left -200px bottom 50px;
  background-repeat: no-repeat;

  @media screen and (min-width: 768px) {
    background-size: 800px auto;
    background-position: bottom 400px left -200px;
  }

  @media screen and (min-width: 1024px) {
    background-size: 800px auto;
    background-position: bottom 250px left -200px;
  }
`;
