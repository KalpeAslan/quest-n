import styled from "@emotion/styled";
import { Box } from "@mui/material";

import thirdM from "@assets/images/home-page/third-m.webp";
import thirdM2x from "@assets/images/home-page/third-m-2x.webp";
import thirdD from "@assets/images/home-page/third-d.webp";
import thirdD2x from "@assets/images/home-page/third-d-2x.webp";

export const AlphaquestSectionWrapper = styled(Box)`
  display: flex;
  flex-direction: column;

  .decor {
    width: calc(100% + 32px);
    height: 452px;
    margin: 0 -16px -15px;
    display: inline-block;
    background-image: url(${thirdM.src});
    background-image: -webkit-image-set(
      url(${thirdM.src}) 1x,
      url(${thirdM2x.src}) 2x
    );
    background-image: image-set(url(${thirdM.src}) 1x, url(${thirdM2x.src}) 2x);
    background-repeat: no-repeat;
    background-position: top 0 center;
  }

  .button {
    width: 100%;
    margin-top: 24px;
  }

  @media (min-width: 425px) {
    .decor {
      background-position: top 0 center;
    }
  }

  @media (min-width: 768px) {
    .content {
      text-align: center;
    }

    .decor {
      height: 619px;
      background-size: 620px;
      margin-bottom: 20px;
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
    position: relative;
    padding-bottom: 337px !important;

    .content {
      text-align: left;
    }

    .decor {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 1117px;
      height: 392px;
      margin: 0 24px;
      background-image: url(${thirdD.src});
      background-image: -webkit-image-set(
        url(${thirdD.src}) 1x,
        url(${thirdD2x.src}) 2x
      );
      background-image: image-set(
        url(${thirdD.src}) 1x,
        url(${thirdD2x.src}) 2x
      );
      background-position: bottom left;
      background-size: auto;
    }
  }
`;
