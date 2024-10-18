import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{ count: number }>`
  padding: 0;
  max-width: none;
  margin-bottom: 40px;

  .list .splide__pagination {
    margin: 0 auto;
    margin-top: 16px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: static;
    width: 240px;
  }

  .list .splide__pagination__page {
    width: ${props =>
      props.count ? (240 - (props.count - 1) * 4) / props.count : 0}px;
    height: 10px;
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

  .splide__arrows {
    display: none;
  }

  @media screen and (min-width: 768px) {
    .list .splide__pagination {
      display: none;
    }

    .splide__arrows {
      display: block;
    }

    .splide__arrow {
      cursor: pointer;
      position: absolute;
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 1;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #2b3232;
      border: none;
      outline: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }

    .nav .splide__arrow:disabled {
      display: none;
    }

    .nav .splide__arrow--next {
      left: auto;
      right: -16px;
    }
  }
`;
