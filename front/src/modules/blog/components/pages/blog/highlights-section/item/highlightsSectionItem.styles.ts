import styled from "@emotion/styled";
import Link from "next/link";
import { Box } from "@mui/material";

const HighlightsSectionStylesWrapper = styled(Link)`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: initial;
  background-color: var(--loyalty-cards-background-color);
  border-radius: 16px;
  text-decoration: none;
  overflow: hidden;
  text-decoration: none;

  @media (min-width: 1024px) {
    width: calc(33.33% - 8px);
  }
`;

const HighlightsSectionStylesImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1.65 / 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #272c2c;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      180deg,
      rgb(0 0 0 / 0%) 66.67%,
      rgb(0 0 0 / 68%) 87.5%,
      rgb(0 0 0 / 82%) 100%
    );
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`;

const HighlightsSectionStylesContent = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
    display: flex;
    justify-content: space-between;
  }

  .author {
    position: absolute;
    right: 16px;
    bottom: 16px;
    left: 16px;
    display: flex;
    align-items: center;
    z-index: 2;
  }

  .author-image {
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: flex;
    align-items: center;
    color: #272c2c;
    border-radius: 50%;
    background-color: #171c1c;
    overflow: hidden;
  }

  @supports (
    (display: -webkit-box) or (-webkit-box-orient: vertical) or
      (-webkit-line-clamp: 2)
  ) {
    .title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      max-height: 48px;
      overflow: hidden;
    }

    .text p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      max-height: 39px;
      overflow: hidden;
    }
  }

  .info-item {
    margin-top: auto;
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
`;

const HighlightsSectionStylesAuthor = styled.div`
  position: absolute;
  right: 16px;
  bottom: 16px;
  left: 16px;
  display: flex;
  align-items: center;
  z-index: 2;
`;

const HighlightsSectionStylesAuthorImage = styled(Box)`
  width: 24px;
  height: 24px;
  min-width: 24px;
  display: flex;
  align-items: center;
  color: #272c2c;
  border-radius: 50%;
  background-color: #171c1c;
  overflow: hidden;
`;

export {
  HighlightsSectionStylesWrapper,
  HighlightsSectionStylesImage,
  HighlightsSectionStylesContent,
  HighlightsSectionStylesAuthor,
  HighlightsSectionStylesAuthorImage,
};
