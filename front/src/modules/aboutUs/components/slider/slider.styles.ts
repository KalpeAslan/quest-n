import styled from "@emotion/styled";

export const SliderWrapper = styled.section`
  margin: auto;
  padding: 0;
  max-width: 480px;

  .content {
    position: relative;
    flex: 1;
    width: 100%;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    order: 1;
    z-index: 2;
  }

  .text {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    order: 1;
  }

  .list {
    position: relative;
  }

  .nav {
    display: none;
  }

  .pagination {
    margin-top: 30px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pagination-item {
    margin: 0 2px !important;
    padding: 6px 0;
    max-width: 75px;
    display: flex !important;
    align-items: center;
    cursor: pointer;
    opacity: 0.3;
  }

  .pagination-item::after {
    width: 100%;
    height: 2px;
    content: "";
    display: inline-block;
    background-color: var(--hero-section-slider-pagination-color);
  }

  .active {
    opacity: 1;
  }

  @media (min-width: 1024px) {
    display: none;
  }
`;
