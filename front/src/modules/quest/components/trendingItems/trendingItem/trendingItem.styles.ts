import styled from "@emotion/styled";

export const Wrapper = styled.div<{ participated?: boolean }>`
  cursor: pointer;
  width: 100%;
  text-decoration: none;
  color: initial;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${props => (props.participated ? "#f5d47a" : "transparent")};
  position: relative;

  .imageWrapper {
    position: relative;
    height: 224px;
    width: 100%;
  }

  & > .content {
    z-index: 1;
    position: relative;
    padding: 16px;
    background: linear-gradient(
      180deg,
      rgba(30, 37, 37, 0) 0%,
      rgba(30, 37, 37, 0.72) 11.98%,
      #1e2525 41.06%
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
  }

  @media screen and (min-width: 768px) {
    border-radius: 16px;
    overflow: hidden;
    margin-bottom: 0;
    flex-direction: row;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    .imageWrapper {
      min-width: 307px;
      width: 307px;
      height: auto;
    }

    & > .content {
      background: #1e2525;
      flex-grow: 1;
      margin-top: 0;
    }
  }

  .rewardItem {
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
      right: 16px;
      z-index: 1000;
      color: #141414;
    }
  }

  @media screen and (min-width: 768px) {
    .rewardItem.exp {
      bottom: 16px;
      left: 16px;
      top: auto;
      right: auto;
    }
  }

  @media screen and (min-width: 1024px) {
    margin-bottom: 0;
    width: calc((100% - 12px) / 2);

    &:last-child {
      margin-bottom: 12px;
    }

    & > .content {
      margin-left: -133px;
      background: linear-gradient(
        270deg,
        #1e2525 69.27%,
        rgba(30, 37, 37, 0.78) 84.9%,
        rgba(30, 37, 37, 0) 100%
      );
      max-width: calc(100% - 307px + 133px);
    }
  }
`;
