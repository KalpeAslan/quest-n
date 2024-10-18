import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const EcosystemWrapper = styled(Box)`
  position: relative;
  z-index: 3;

  .list {
    position: relative;
  }

  .nav {
    position: absolute;
    top: 50%;
    right: -19px;
    left: -19px;
    height: 0;
    display: none;
  }

  .btn {
    width: 40px;
    height: 32px;
    margin-top: -16px;
    padding: 8px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--slider-btn-color);
    background-color: rgb(250 250 250 / 10%);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 8px;
  }

  .btn:not(:disabled) {
    cursor: pointer;
  }

  .btn:focus-visible {
    outline: 1px solid var(--button-primary-hover-background-color);
    outline-offset: 1px;
  }

  .nav .splide__arrow:disabled {
    display: none;
  }

  .nav .splide__arrow--next {
    margin-left: auto;
  }

  .list .splide__pagination {
    margin-top: 8px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .list .splide__pagination li {
    width: 100%;
    margin: 0 2px !important;
    padding: 6px 0;
    max-width: 75px;
    display: flex !important;
    align-items: center;
    cursor: pointer;
  }

  .list .splide__pagination__page {
    width: 100%;
    height: 2px;
    content: "";
    display: inline-block;
    background-color: var(--hero-section-slider-pagination-color);
    border: none;
    opacity: 0.3;
  }

  .list .splide__pagination__page.is-active {
    opacity: 1;
  }

  .items {
    display: none;
  }

  @media (min-width: 768px) {
    .slider {
      display: none;
    }

    .title {
      text-align: center;
    }

    .items {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
  }

  @media (min-width: 1024px) {
    .title {
      text-align: left;
    }
  }
`;
