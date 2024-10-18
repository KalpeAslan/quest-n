import styled from "@emotion/styled";
import Link from "next/link";

export const PostsSectionItemStyles = styled(Link)`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: initial;
  background-color: var(--loyalty-cards-background-color);
  border-radius: 16px;
  text-decoration: none;
  overflow: hidden;
  text-decoration: none;

  .image {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 16px;
    overflow: hidden;
    z-index: 1;
  }

  .image::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(0deg, rgb(23 28 28 / 90%), rgb(23 28 28 / 90%));
  }

  .image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .content {
    position: relative;
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 2;
  }

  .header {
    display: flex;
    justify-content: space-between;
  }

  .like {
    z-index: 2;
  }

  .author {
    margin: 8px 0;
    display: flex;
    align-items: center;
    z-index: 2;
  }

  .author-image {
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #272c2c;
    overflow: hidden;
  }

  .decor {
    height: 16px;
    border-left: 1px solid rgb(255 255 255 / 30%);
  }

  .author-desctop,
  .like-desctop {
    display: none;
  }

  .data {
    display: flex;
    align-items: center;
  }

  .soc {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .soc svg,
  .icon svg {
    height: 16px !important;
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
      overflow: hidden;
    }

    .text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
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

  @media (min-width: 768px) {
    flex-direction: row;
    background-color: transparent;
    border-radius: none;

    .author-mobile,
    .like-mobile,
    .decor,
    .soc {
      display: none;
    }

    .data {
      width: 100%;
    }

    .author-desctop,
    .like-desctop {
      display: initial;
    }

    .image {
      position: relative;
      top: initial;
      right: initial;
      bottom: initial;
      left: initial;
      width: 256px;
      aspect-ratio: 1.6 / 1;
      background-color: var(--loyalty-cards-background-color);
      border-radius: 16px;
    }

    .image::after {
      background: linear-gradient(
        180deg,
        rgb(0 0 0 / 0%) 66.67%,
        rgb(0 0 0 / 68%) 87.5%,
        rgb(0 0 0 / 82%) 100%
      );
    }

    .content {
      padding: 0 0 0 16px;
    }

    .author-desctop {
      position: absolute;
      right: 8px;
      bottom: 8px;
      left: 8px;
      margin: 0;
      display: flex;
      align-items: center;
      z-index: 2;
    }
  }
`;
