import styled from "@emotion/styled";

export const PointsWrapper = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  row-gap: 60px;
  column-gap: 25px;

  .points {
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: var(--text-color-2);
  }

  .image {
    margin-bottom: 24px;
  }

  .image img {
    max-width: 60px;
    max-height: 60px;
    display: block;
    object-fit: contain;
  }

  .title {
    display: flex;
    align-items: flex-start;
  }

  .text {
    font-size: 14px;
    line-height: 20px;
  }

  .list {
    margin: 0;
    padding-left: 24px;
  }

  @media (min-width: 630px) {
    .points {
      width: calc(50% - 13px);
      max-width: initial;
    }
  }

  @media (min-width: 768px) {
    .points {
      width: calc(33% - 15px);
    }
  }
`;
