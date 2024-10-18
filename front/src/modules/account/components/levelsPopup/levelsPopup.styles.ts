import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  width: 90vw;
  max-width: 330px;
  min-width: 330px;
  height: 90vh;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  position: relative;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
  overflow: scroll;

  .content {
    padding: 77px 24px 0;
  }

  .item {
    padding-bottom: 25px;
    margin-bottom: 25px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:last-of-type {
      border-bottom: none;
    }
  }

  .imageWrapper {
    width: 65px;
    height: 65px;
    max-width: 65px;
    max-height: 65px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .pointsWrapper {
    padding: 5px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    width: fit-content;
    height: fit-content;
  }

  .leftWrapper {
    margin-bottom: 18px;
    display: flex;
  }

  .benefitItem {
    display: flex;
    align-items: center;
    column-gap: 8px;
    color: rgba(255, 255, 255, 0.8);

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 768px) {
    max-width: 700px;
    min-width: 700px;
    max-height: 741px;

    .mobile {
      display: none;
    }

    .desktop {
      display: initial;
    }

    .item {
      display: flex;
      justify-content: space-between;
    }
  }
`;

export const Gradient = styled(Box)`
  z-index: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, rgba(19, 21, 21, 0) 0%, #131515 100%);
  width: 100%;
  height: 62px;
  pointer-events: none;
`;

export const Header = styled(Box)`
  z-index: 1;
  padding: 16px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 24px;
  line-height: 24px;
  padding-right: 45px;
  background-color: var(--wallets-popup-background-color);

  .closeBtn {
    position: absolute;
    right: 16px;
    top: 16px;
  }
`;
