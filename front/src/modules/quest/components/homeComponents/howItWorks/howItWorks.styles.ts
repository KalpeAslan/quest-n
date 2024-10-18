import { howItWorksBg } from "@/modules/quest/assets";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  margin-bottom: 70px;
  position: relative;
  z-index: 1;

  .title {
    margin-bottom: 50px;
  }

  .howItWorksItem {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 26px 30px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-image: url(${howItWorksBg.src});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;

    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }

  .desktop {
    display: none;
  }

  .icon {
    width: 37px !important;
    height: 32px !important;
  }

  .head {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .itemTitle {
    margin-bottom: 14px;
  }

  .image {
    margin-right: 37px;
    width: 50px;
    height: auto;
  }

  .description {
    margin-bottom: 14px;
  }

  .link {
    cursor: pointer;
    text-decoration: underline;
  }

  @media screen and (min-width: 768px) {
    margin-bottom: 111px;

    .title {
      margin-bottom: 42px;
    }

    .container {
      display: flex;
      justify-content: space-between;
    }

    .mobile {
      display: none;
    }

    .desktop {
      display: initial;
    }

    .icon {
      width: 48px !important;
      height: 42px !important;
    }

    .image {
      margin-right: 45px;
      width: auto;
      height: 57px !important;
    }

    .howItWorksItem {
      padding: 31px 48px;
      width: calc((100% - 70px) / 3);

      &:not(:last-child) {
        margin-bottom: 0;
      }
    }

    .head {
      margin-bottom: 23px;
    }

    .itemTitle {
      margin-bottom: 18px;
    }

    .description {
      margin-bottom: 18px;
    }
  }
`;
