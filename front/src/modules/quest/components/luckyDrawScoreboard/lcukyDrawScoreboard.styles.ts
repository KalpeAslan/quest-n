import styled from "@emotion/styled";

export const TableWrapper = styled.section<{ isInfoPopup: boolean }>`
  .desctop {
    display: ${props => (props.isInfoPopup ? "block" : "none")};
  }

  .mobile {
    display: ${props => (props.isInfoPopup ? "none" : "block")};
  }

  @media (min-width: 768px) {
    .mobile {
      display: none;
    }

    .desctop {
      display: block;
    }
  }
`;

export const LuckyDrawScoreboardStylesEmptyScoreBoard = styled.div`
  background: linear-gradient(180deg, rgba(16, 19, 19, 0.49) 0%, #101313 100%),
    url("/images/scoreboard/luckydraw.png") no-repeat center;
  width: 100%;
  height: 400px;
  background-size: contain;
`;

export const TableDecor = styled.section`
  .image {
    position: relative;
    width: 100%;
    z-index: 1;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .content {
    position: absolute;
    top: calc(50% - 50px);
    right: 0;
    left: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
  }

  .position {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .point {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    max-width: 260px;
  }
`;
