import styled from "@emotion/styled";

export const LvlWrapper = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  opacity: 0.2;

  &.active {
    opacity: 1;
  }

  .image {
    width: 30px;
    min-width: 30px;
    height: 30px;
    margin-bottom: 11px;
    border-radius: 50%;
    overflow: hidden;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  @media (min-width: 360px) {
    .image {
      width: 40px;
      min-width: 40px;
      height: 40px;
    }
  }
`;
