import styled from "@emotion/styled";

export const ProfitWrapper = styled.div`
  display: flex;
  align-items: center;

  .profit {
    display: flex;
    align-items: center;
  }

  .text {
    flex: 1;
  }

  .rank {
    position: relative;
    width: 50px;
    height: 64px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .rank-icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  .icon {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 24px;
    color: rgb(255 255 255 / 10%);
  }

  .ranks {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .rank-item {
    position: relative;
    width: 44px;
    height: 44px;
    margin: 0 -12px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  .rank-item:nth-child(1) {
    background: linear-gradient(270deg, #2b6345 0%, #2b503d 100%);
    z-index: 4;
  }

  .rank-item:nth-child(2) {
    background: linear-gradient(270deg, #2c503d 0%, #223b2e 100%);
    z-index: 3;
  }

  .rank-item:nth-child(2) p {
    opacity: 0.65;
  }

  .rank-item:nth-child(3) {
    background: linear-gradient(270deg, #1d2e26 0%, #182820 100%);
    z-index: 2;
  }

  .rank-item:nth-child(3) p {
    opacity: 0.35;
  }

  .rank-item:nth-child(4) {
    background: linear-gradient(
      270deg,
      rgb(30 46 38 / 0%) 37.98%,
      #18261f 88.44%
    );
    z-index: 1;
  }

  .rank-item:nth-child(4) p {
    margin-top: -8px;
    opacity: 0.35;
  }
`;
