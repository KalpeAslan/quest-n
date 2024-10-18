import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  margin-bottom: 92px;
  z-index: 1;
  position: relative;

  .title {
    margin-bottom: 49px;
  }

  .mainButton {
    width: 100%;
    max-width: 260px;
    padding-top: 16px !important;
    padding-bottom: 16px !important;
    font-size: 22px !important;
    font-weight: 700 !important;
    line-height: 30px !important;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      margin-left: 13px;
      width: 18px !important;
      height: 15px !important;
    }
  }

  @media screen and (min-width: 768px) {
    margin-bottom: 110px;

    .title {
      margin-bottom: 60px;
    }
  }

  @media screen and (min-width: 1024px) {
    margin-bottom: 163px;

    .title {
      margin-bottom: 50px;
    }

    .mainButton {
      max-width: 330px;
      font-size: 30px !important;
      line-height: 40px !important;

      .icon {
        width: 24px !important;
        height: 20px !important;
      }
    }
  }
`;
