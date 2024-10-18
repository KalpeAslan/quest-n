import styled from "@emotion/styled";

import boxM from "@assets/images/home-page/box-m.webp";
import boxM2x from "@assets/images/home-page/box-m-2x.webp";

export const FriendsCompleteTasksWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;
  text-align: center;

  &.active {
    text-align: left;
  }

  .image {
    width: 100%;
    height: 153px;
    padding: 16px 16px 0;
  }

  .decor {
    width: 100%;
    height: 120%;
    background-image: url(${boxM.src});
    background-image: -webkit-image-set(
      url(${boxM.src}) 1x,
      url(${boxM2x.src}) 2x
    );
    background-image: image-set(url(${boxM.src}) 1x, url(${boxM2x.src}) 2x);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .number {
    width: 24px;
    height: 24px;
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(270deg, #1d2e26 0%, #182820 100%);
    border-radius: 50%;
  }

  .content {
    padding: 0 16px 16px;
  }

  @media (min-width: 768px) {
    width: calc(33% - 6px);

    &.active {
      border: none;
    }
  }
`;
