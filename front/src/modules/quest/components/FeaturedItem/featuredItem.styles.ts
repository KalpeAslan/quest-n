import styled from "@emotion/styled";
import Link from "next/link";

export const Wrapper = styled(Link)`
  text-decoration: none;
  display: block;
  border-radius: 16px;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);

  * {
    text-decoration: none;
  }

  .backgroundImage {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transition: transform 300ms ease-out;
  }

  &:hover .backgroundImage {
    transform: scale(1.3);
  }

  .backgroundFilter {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: lightgray 50% / cover no-repeat, #1e2525;
    backdrop-filter: blur(10px);
  }

  .imageContainer {
    padding: 9px 9px 0px;
  }

  .imageWrapper {
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 10px;
    overflow: hidden;
  }

  .image {
    object-fit: cover;
  }

  .content {
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #252525 100%);
    padding: 15px 16px 19px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .partnersContainer {
    width: calc(100% - 14px);
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    backdrop-filter: blur(2.1991562843322754px);
    border: 0.458px solid rgba(255, 255, 255, 0.08);
    background: rgba(27, 27, 27, 0.62);
    background-blend-mode: screen, normal;
    border-radius: 8.247px;
    padding: 10px;
  }

  .mainPartnerProjectContainer {
    display: flex;
    align-items: center;
  }

  .mainPartnerProjectImageWrapper {
    margin-right: 12px;
    position: relative;
  }

  .mainPartnerProjectImageContainer {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
  }

  .partnerProjectItemWrapper {
    display: flex;
    align-items: center;
  }

  .partnerProjectItemContainer {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .partnerProjectImageWrapper {
    position: relative;
    margin-right: 9px;
  }

  .partnerProjectImageContainer {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    overflow: hidden;
  }

  .divider {
    width: 1px;
    height: 9px;
    background: rgba(255, 255, 255, 0.4);
    margin-right: 10px;
  }

  .prizePoolContainer {
    margin-top: 14px;
  }

  .prizePoolTitle {
    margin-bottom: 8px;
  }

  .rewardItem {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    border-radius: 6px;
    pointer-events: none;
    margin-right: 10px;
    width: fit-content;

    &.primary {
      background: linear-gradient(180deg, #f5d47a 0%, #d7ad3a 100%) !important;
      color: #141414;
    }

    &.colorfull {
      color: #ffffff;
    }

    &.exp {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 1000;
      color: #141414;
    }
  }

  .rewardImg {
    margin-right: 2px;
    min-width: 15px;
    min-height: 15px;
  }

  .typeLabel {
    display: flex;
    align-items: center;
    padding: 7px 10px;
    border-radius: 9px;
    background: rgba(30, 30, 30, 0.6);
    backdrop-filter: blur(5px);
    position: absolute;
    left: 14px;
    top: 14px;
  }

  .typeLabelImage {
    height: 13px;
    width: auto !important;
  }
`;
