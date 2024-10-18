import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding: 0;
  max-width: none;

  .list {
    position: relative;
  }

  .nav {
    position: absolute;
    top: 50%;
    right: -48px;
    left: -48px;
    height: 0;
    display: none;
  }

  .btn {
    width: 40px;
    height: 40px;
    margin-top: -20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--slider-btn-color);
    background-color: var(--slider-btn-background-color);
    border: 1px solid var(--slider-btn-border-color);
    border-radius: 10px;
  }

  .btn:not(:disabled) {
    cursor: pointer;
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
    position: static;
  }

  .list .splide__pagination__page {
    width: 75px;
    height: 10px;
    margin: 0 2px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: 2px solid transparent;
    cursor: pointer;
    transform: none;
  }

  .list .splide__pagination__page::after {
    content: "";
    width: 100%;
    height: 2px;
    background-color: var(--hero-section-slider-pagination-color);
    opacity: 0.3;
  }

  .list .splide__pagination__page.is-active::after {
    opacity: 1;
  }

  .list .splide__slide {
    display: flex;
  }

  @media (min-width: 768px) {
    .list .splide__pagination {
      margin-top: 18px;
    }
  }
`;
