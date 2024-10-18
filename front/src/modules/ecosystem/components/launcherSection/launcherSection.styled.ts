import styled from "@emotion/styled";
import { Box } from "@mui/material";

import secondM from "@assets/images/home-page/second-m.webp";
import secondM2x from "@assets/images/home-page/second-m-2x.webp";
import secondD from "@assets/images/home-page/second-d.webp";
import secondD2x from "@assets/images/home-page/second-d-2x.webp";

export const LauncherSectionWrapper = styled(Box)`
  .decor {
    width: calc(100% + 32px);
    height: 500px;
    margin: 0 -16px 24px;
    display: inline-block;
    background-image: url(${secondM.src});
    background-image: -webkit-image-set(
      url(${secondM.src}) 1x,
      url(${secondM2x.src}) 2x
    );
    background-image: image-set(
      url(${secondM.src}) 1x,
      url(${secondM2x.src}) 2x
    );
    background-repeat: no-repeat;
    background-position: top 0 right 50%;
  }

  .button {
    width: 100%;
    margin-top: 24px;
  }

  @media (min-width: 768px) {
    .content {
      text-align: center;
    }

    .button {
      width: auto;
    }
  }

  @media (min-width: 1024px) {
    position: relative;

    .decor {
      position: absolute;
      top: calc(50% - 262px);
      left: 0;
      width: 524px;
      height: 524px;
      margin: 0 0 0 24px;
      background-image: url(${secondD.src});
      background-image: -webkit-image-set(
        url(${secondD.src}) 1x,
        url(${secondD2x.src}) 2x
      );
      background-image: image-set(
        url(${secondD.src}) 1x,
        url(${secondD2x.src}) 2x
      );
      background-repeat: no-repeat;
      background-position: top 0 left 0;
    }

    .content {
      margin-left: auto;
      padding: 180px 0;
      max-width: 536px;
      text-align: left;
    }

    .title,
    .text,
    .button {
      position: relative;
      z-index: 1;
    }
  }
`;
