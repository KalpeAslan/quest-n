import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const HighlightsStylesWrapper = styled(Box)`
  padding: 0;
  max-width: none;
  display: none;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 1024px) {
    display: flex;
    flex-flow: row wrap;
  }
`;

export const HighlightsStylesSlider = styled.section`
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

  .list .splide__slide {
    display: flex;
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

  @media (min-width: 1024px) {
    display: none;
  }
`;
