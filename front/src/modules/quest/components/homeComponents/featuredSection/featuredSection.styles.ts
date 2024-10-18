import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  margin-bottom: 90px;
  position: relative;
  z-index: 1;

  .title {
    margin-bottom: 48px;
  }

  .container {
    margin-bottom: 40px;
  }

  .featuredItem:not(:last-child) {
    margin-bottom: 30px;
  }

  .featuredItem:last-child {
    display: none;
  }

  .link {
    text-decoration: underline;
    margin: 0 auto;
    display: block;
    width: fit-content;
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .title {
      margin-bottom: 61px;
    }

    .desktop {
      display: block;
    }

    .mobile {
      display: none !important;
    }

    .container {
      margin-bottom: 55px;
    }

    .featuredItem {
      width: calc((100% - 30px) / 2);

      &:not(:last-child) {
        margin-bottom: 0;
      }

      &:last-child {
        display: initial;
      }
    }

    .link {
      margin-left: 0;
    }
  }

  @media screen and (min-width: 1024px) {
    margin-bottom: 112px;

    .title {
      margin-bottom: 60px;
    }

    .container {
      margin-bottom: 60px;
    }

    .featuredItem {
      width: calc((100% - 40px) / 3);

      :last-child {
        display: none;
      }
    }
  }
`;
