import styled from "@emotion/styled";

import loyaltyM from "@assets/images/loyalty/loyalty-m.webp";
import loyaltyM2x from "@assets/images/loyalty/loyalty-m-2x.webp";

export const LoginInfoWrapper = styled.div`
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
    height: 100%;
    background-image: url(${loyaltyM.src});
    background-image: -webkit-image-set(
      url(${loyaltyM.src}) 1x,
      url(${loyaltyM2x.src}) 2x
    );
    background-image: image-set(
      url(${loyaltyM.src}) 1x,
      url(${loyaltyM2x.src}) 2x
    );
    background-repeat: no-repeat;
    background-position: 50%;
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

  .button {
    width: 100%;
  }

  @media (min-width: 768px) {
    width: calc(33% - 6px);

    &.active {
      border: none;
    }
  }
`;
