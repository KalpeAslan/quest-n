import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CBreakpoints } from "../../../../styles/variables";

export const Wrapper = styled(Box)`
  display: flex;
  align-items: start;
  justify-content: left;
  height: 100%;

  .projects-page__sidebar {
    width: 260px;
    height: 100%;
    border-right: 1px solid #2c3232;
    position: relative;

    &__image {
      position: absolute;
      bottom: 0;
      width: 100%;
    }
  }

  .projects-page__content {
    padding-top: 30px !important;
    padding-bottom: 80px !important;

    .title {
      margin-bottom: 30px;
    }

    .cardsWrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .card {
      width: 100%;
      padding: 25px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      border-radius: 10px;

      &.own {
        background: rgba(135, 246, 150, 0.05);
        margin-bottom: 20px;
      }

      &.participated {
        background: rgba(135, 193, 246, 0.05);
        border: 1px solid transparent;
      }
    }

    .cardTitle {
      background: linear-gradient(270deg, #d0e356 0%, #87f696 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 23px;
      line-height: 26px;
      text-transform: uppercase;
      font-weight: 400;
      margin-bottom: 8px;
    }

    .link {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    @media screen and (min-width: ${CBreakpoints.tablet}px) {
      padding-top: 40px !important;
      padding-bottom: 40px !important;

      .title {
        margin-bottom: 47px;
      }

      .cardsWrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: start;
        gap: 20px;
      }

      .card {
        &.own {
          height: 100%;
          margin-bottom: 0;
        }
      }

      .cardTitle {
        font-size: 30px;
        line-height: 36px;
      }
    }
  }
`;
