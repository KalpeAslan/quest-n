import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const PartnersWrapper = styled(Box)`
  .list {
    position: relative;
    z-index: 2;
  }

  .item {
    display: flex;
    flex-direction: column;
  }

  .partner {
    width: 100%;
    padding: 0 20px 20px;
    display: block;
    color: var(--partner-text-color);
    background-color: var(--partner-background-color);
    border-radius: 16px;
    transition: background-color 0.3s;
  }

  .title {
    color: var(--partner-text-color);
  }

  .subtitle {
    color: var(--partner-text-color-2);
  }

  .partner-logo-wrap {
    height: 160px;
    padding: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid var(--partner-border-2-color);
  }

  .partner-logo {
    width: 216px;
    height: 120px;
    background-position: bottom center;
    background-size: 216px;
  }

  .partner:hover {
    background-color: var(--partner-hover-background-color);
  }

  .partner:hover .partner-logo {
    background-position: top center;
  }

  .partner :not(.caps-coin) svg {
    filter: grayscale(100%);
  }

  .partner .caps-coin svg {
    filter: invert(50%);
  }

  .partner :not(.caps-coin):hover svg,
  .partner :not(.caps-coin):focus svg,
  .partner :not(.caps-coin):active svg {
    filter: none;
  }

  .partner .caps-coin:hover svg,
  .partner .caps-coin:focus svg,
  .partner .caps-coin:active svg {
    filter: invert(50%);
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

  .splide__arrow {
    position: relative;
    right: 0;
    left: 0;
    opacity: 1;
    transform: none;
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

  @media (min-width: 768px) {
    .list .splide__pagination {
      margin-top: 18px;
    }
  }

  @media (min-width: 1024px) {
    .nav {
      display: flex;
    }
  }
`;
