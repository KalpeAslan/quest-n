import styled from "@emotion/styled";
import { Box } from "@mui/material";

import heroD from "@assets/images/home-page/hero-d.webp";
import heroD2x from "@assets/images/home-page/hero-d-2x.webp";

export const TopSectionWrapper = styled(Box)`
  .content {
    text-align: center;
  }

  .title {
    display: flex;
    flex-direction: column;
    text-align: left;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .button {
    width: 100%;
    max-width: 328px;
  }

  .text {
    text-align: left;
  }

  .title,
  .text,
  .button {
    position: relative;
    z-index: 1;
  }

  @media (min-width: 768px) {
    .title,
    .text {
      text-align: center;
    }
  }

  @media (min-width: 1024px) {
    position: relative;

    .title,
    .text {
      text-align: left;
    }

    .text {
      max-width: 610px;
    }

    .content {
      text-align: left;
      max-width: 800px;
    }

    .buttons {
      flex-direction: row;
    }

    .button {
      max-width: 240px;
      font-size: 20px !important;
      line-height: 24px !important;
    }
  }
`;

export const TopSectionDecor = styled.div`
  background-image: url(${heroD.src});
  background-image: -webkit-image-set(
    url(${heroD.src}) 1x,
    url(${heroD2x.src}) 2x
  );
  background-image: image-set(url(${heroD.src}) 1x, url(${heroD2x.src}) 2x);
  width: calc(100% + 48px);
  height: 500px;
  margin: -112px -16px -100px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center right 30%;

  @media (min-width: 768px) {
    width: calc(100% + 48px);
    height: 890px;
    margin: -200px -24px -250px;
    background-size: 140% auto;
    background-position: center right 34%;
  }

  @media (min-width: 1024px) {
    position: absolute;
    top: 0;
    right: 0;
    height: 928px;
    margin-left: 50px;
    margin-right: -50px;
    margin-top: -60px;
    background-size: auto 90%;
    margin-bottom: 0;
    background-position: top 60px left calc(50% + 200px);
  }
`;
