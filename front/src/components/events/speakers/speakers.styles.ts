import styled from "@emotion/styled";

export const SpeakersStylesContainer = styled.section`
  padding: 40px 26px 0;

  .wrapper {
    z-index: 1;
  }

  .speaker-image {
    width: 78px;
    height: 49px;
    margin: 0 auto 10px;
    display: block;
  }

  .speakers-caption {
    margin-bottom: 30px;
    color: var(--color-w1);
    font-weight: 700;
    font-size: 46px;
    line-height: 56px;
    text-align: center;
  }

  .speakers-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

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

  @media (min-width: 1440px) {
    .nav {
      display: flex;
    }
  }

  @media screen and (min-width: 1280px) {
    .speakers {
      padding: 0;
    }

    .speakers-list {
      display: flex;
      justify-content: space-between;
    }
  }
`;
