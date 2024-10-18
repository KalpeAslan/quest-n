import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { createQuestBgDesktop, createQuestBgTablet } from "../../../assets";

export const Wrapper = styled(Box)`
  margin-bottom: 152px;
  position: relative;
  z-index: 1;

  .title {
    margin-bottom: 32px;
  }

  .button {
    width: fit-content;
    font-size: 24px !important;
    font-weight: 500 !important;
    line-height: 33px !important;

    .div {
      display: flex;
      align-items: center;
      padding: 13px 30px;
    }
  }

  .icon {
    margin-right: 15px;
  }

  @media screen and (min-width: 768px) {
    margin-bottom: 163px;
    background-image: url(${createQuestBgTablet.src});
    background-size: 100% 100%;
    padding: 20px 71px;
    background-repeat: no-repeat;

    .title {
      margin-bottom: 40px;
    }
  }

  @media screen and (min-width: 1024px) {
    padding: 76px 71px;
    background-image: url(${createQuestBgDesktop.src});
  }
`;
