import styled from "@emotion/styled";

export const SliderWrapper = styled.section`
  .list {
    position: relative;
  }

  .list li {
    display: flex;
  }

  .nav {
    display: none;
  }

  .nav .splide__arrow:disabled {
    display: none;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

export const BlocksWrapper = styled.section`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    gap: 12px;

    &.active {
      border: 1px solid rgb(255 255 255 / 10%);
      border-radius: 16px;
    }

    & > .decor {
      margin: 16px 0;
      border-right: 1px solid rgb(255 255 255 / 10%);
    }
  }
`;
