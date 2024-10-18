import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding-top: 30px !important;
  padding-bottom: 30px !important;

  .header {
    display: flex;
    margin-bottom: 25px;
  }

  .backButton {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    margin-right: 8px;
  }

  .backIcon {
    transform: rotate(180deg);
  }

  .filter {
    margin: 0 auto;
    margin-bottom: 25px;
  }

  .itemsWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .item {
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    align-self: stretch;

    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .buttonItem {
    padding: 2px;
    background: linear-gradient(93.11deg, #5e7cb9 3.14%, #7ad96e 103.3%);
  }

  .buttonWrapper {
    border-radius: 16px;
    height: 196px;
    min-height: 196px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
        130deg,
        rgba(94, 124, 185, 0.2) 0%,
        rgba(122, 217, 110, 0.2) 100%
      ),
      black;
  }

  .questButton {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 276px;
    height: 48px;
  }

  .questIcon {
    margin-right: 10px;
  }

  @media screen and (min-width: 768px) {
    padding-top: 40px !important;
    padding-bottom: 40px !important;

    .backButton {
      margin-right: 10px;
    }

    .header {
      margin-bottom: 30px;
    }

    .itemsWrapper {
      flex-direction: row;
      flex-wrap: wrap;
      row-gap: 11px;
    }

    .item {
      width: calc((100% - 11px) / 2);

      &:not(:last-child) {
        margin-bottom: 0;
      }

      &:not(:nth-child(2n)) {
        margin-right: 11px;
      }
    }

    .buttonItem {
      align-self: stretch;
      height: auto;
    }

    .buttonWrapper {
      height: 100%;
    }
  }

  @media screen and (min-width: 1040px) {
    .item {
      width: calc((100% - 22px) / 3);

      &:not(:nth-child(2n)) {
        margin-right: 0;
      }

      &:not(:nth-child(3n)) {
        margin-right: 11px;
      }
    }
  }
`;
