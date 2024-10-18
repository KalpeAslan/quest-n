import styled from "@emotion/styled";
import questCardBg from "@assets/images/quest/quest-card-bg.webp";
import { CBreakpoints } from "@styles/variables";
import { computeBackgroundTransform } from "@modules/quest/components/projects/components/projectCard/projectCardUtils";

export const Wrapper = styled.div<{ index: number }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: initial;
  border: 1px solid transparent;
  background-size: cover;
  border-radius: 16px;
  text-decoration: none;
  overflow: hidden;
  min-height: 252px;
  cursor: pointer;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${questCardBg.src}) no-repeat center;
    background-size: cover;
    border-radius: 16px;
    z-index: -1;
  }
  ${props =>
    props.index &&
    `
    &::before {
      ${computeBackgroundTransform(props.index, "desktop")}
    }
  `}

  &.participated {
    border: 1px solid #f5d47a;
  }

  &.expired {
    opacity: 0.5;
  }

  .image {
    width: 100%;
    overflow: hidden;
  }

  .image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    aspect-ratio: 1.7 / 1;
  }

  & > .content {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    position: relative;
    z-index: 2;
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

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .info-decor {
    flex: 1;
    height: 15px;
    min-width: 10px;
    margin: 0 5px 5px;
    background-image: linear-gradient(
      to right,
      var(--sticky-menu-info-title-color) 33%,
      rgb(255 255 255 / 0%) 0%
    );
    background-position: bottom;
    background-size: 5px 1px;
    background-repeat: repeat-x;
  }

  .items {
    display: flex;
    gap: 8px;
    overflow: auto;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
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
    height: 26px;

    &.primary {
      background: linear-gradient(180deg, #f5d47a 0%, #d7ad3a 100%) !important;
      color: #141414;
    }

    &.colorfull {
      color: #ffffff;
    }

    &.exp {
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
  }

  .typeLabelImage {
    height: 13px;
    width: auto !important;
  }

  @media (min-width: 768px) {
    width: calc(50% - 6px);
  }

  @media (min-width: 1024px) {
    width: calc(33.33% - 8px);
  }

  @media (max-width: ${CBreakpoints.tablet}px) {
    &::before {
      ${({ index }) => computeBackgroundTransform(index, "tablet")};
    }
  }

  @media (max-width: ${CBreakpoints.md}px) {
    &::before {
      ${props => computeBackgroundTransform(props.index, "mobile")};
    }
  }
`;
