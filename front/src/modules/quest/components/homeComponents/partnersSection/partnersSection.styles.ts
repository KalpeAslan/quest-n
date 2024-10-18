import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  position: relative;
  z-index: 1;

  .title {
    margin-bottom: 35px;
  }

  .partnerItems {
    display: flex;
    flex-wrap: wrap;
    column-gap: 28px;
    row-gap: 28px;
  }

  .image {
    width: auto;
    height: 20px;
  }

  @media screen and (min-width: 768px) {
    .title {
      margin-bottom: 46px;
    }

    .partnerItems {
      column-gap: 45px;
      row-gap: 40px;
    }

    .image {
      height: 50px;
    }
  }

  @media screen and (min-width: 1024px) {
    .title {
      margin-bottom: 50px;
    }
  }
`;
