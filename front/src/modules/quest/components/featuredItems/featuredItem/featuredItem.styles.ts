import styled from "@emotion/styled";

export const Wrapper = styled.div<{ participated?: boolean; soon?: boolean }>`
  cursor: pointer;
  width: 100%;
  text-decoration: none;
  color: initial;
  display: flex;
  flex-direction: column;
  position: relative;
  border: 1px solid ${props => (props.participated ? "#f5d47a" : "transparent")};

  .adminLabel {
    border-radius: 9px;
    background: #1e1e1e;
    padding: 10px;
    position: absolute;
    top: 10px;
    right: 10px;
  }

  & > .content {
    z-index: 1;
    position: relative;
    padding: 44px 16px 16px;
    background: linear-gradient(
      180deg,
      rgba(30, 37, 37, 0) 0%,
      rgba(30, 37, 37, 0.46) 4.04%,
      rgba(30, 37, 37, 0.78) 8.39%,
      rgba(30, 37, 37, 0.91) 12.13%,
      #1e2525 17.56%
    );
    margin-top: -43px;
    flex: 1;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .statusDivider {
    width: 1px;
    height: 10px;
    background: rgba(255, 255, 255, 0.3);
  }

  .items {
    display: flex;
    gap: 8px;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .btn {
    padding: 0;
    padding-top: 8px;
    padding-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props =>
      props.soon ? "calc((100% - 32px) / 3)" : "calc((100% - 16px) / 2)"};
  }

  .btnIcon {
    min-width: 16px;
    min-height: 16px;
    margin-right: 8px;
  }

  /* .rewardItem {
    display: flex;
    align-items: center;
    padding: 5px 7px;
    border-radius: 6px;
    pointer-events: none;
    margin-right: 10px;
    width: fit-content;

    &.exp {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 1000;
      color: #141414;
    }
  } */

  .rewardItem {
    display: flex;
    align-items: center;
    padding: 5px 7px;
    border-radius: 6px;
    pointer-events: none;
    margin-right: 10px;
    width: fit-content;
    height: 26px;

    &.primary {
      background: linear-gradient(180deg, #f5d47a 0%, #d7ad3a 100%) !important;
      color: #141414;
    }

    &.colorfull {
      color: #ffffff;
    }

    &.exp {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 1000;
      color: #141414;
    }
  }

  .analytics-button {
    background: #222626;
    border-radius: 8px;
  }
  
  @media screen and (min-width: 768px) {
    border-radius: 16px;
    overflow: hidden;
  }
`;
