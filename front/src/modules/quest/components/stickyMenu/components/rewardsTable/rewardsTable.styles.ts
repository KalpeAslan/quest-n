import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;

  .showMoreHeader {
    margin-top: 20px;
  }

  .showMoreButton {
    color: #87f696 !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    line-height: 20px !important;
  }
`;

export const InfoItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .info-decor {
    flex: 1;
    height: 15px;
    min-width: 10px;
    margin: 0 5px 5px;
    background-image: linear-gradient(
      to right,
      var(--sticky-menu-info-title-color) 33%,
      rgb(255 255 255 / 0%) 0%
    );
    background-position: bottom;
    background-size: 5px 1px;
    background-repeat: repeat-x;
  }
`;
