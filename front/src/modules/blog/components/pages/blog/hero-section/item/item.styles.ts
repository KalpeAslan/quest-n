import styled from "@emotion/styled";
import Link from "next/link";

export const HeroSectionItemStyled = styled(Link)`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-decoration: none;

  .image {
    position: relative;
    height: 215px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #171c1c;
    background-color: #272c2c;
    aspect-ratio: 1 / 2;
    z-index: 1;
  }

  .image::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
      180deg,
      rgb(16 19 19 / 40%) 2.5%,
      rgb(16 19 19 / 0%) 22.76%
    );
  }

  .content {
    flex: 1;
    padding: 16px;
    display: flex;
    flex-direction: column;
    background: #171c1c;
    z-index: 3;
  }

  .header {
    display: flex;
    align-items: center;
  }

  .author {
    position: absolute;
    top: 178px;
    left: 16px;
    display: flex;
    align-items: center;
  }

  .author-image {
    width: 24px;
    height: 24px;
    min-width: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #171c1c;
    border-radius: 50%;
    background-color: #272c2c;
    overflow: hidden;
  }

  .decor {
    height: 16px;
    border-left: 1px solid rgb(255 255 255 / 30%);
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
      max-height: 44px;
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

  @media (min-width: 768px) {
    height: 100%;
    min-height: 480px;
    padding: 0.1px;
    border-radius: 16px;
    overflow: hidden;

    .content {
      position: relative;
      flex: 1;
      margin: 24px;
      margin-top: calc(480px / 1.6 - 24px);
      padding: 24px;
      display: grid;
      background: rgb(19 22 22 / 79%);
      backdrop-filter: blur(5px);
      grid-template-areas:
        "info header"
        "info author"
        "info footer";
      column-gap: 24px;
      grid-template-columns: 1fr 280px;
      /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
      grid-template-rows: auto auto 1fr;
      border-radius: 6px;
      overflow: hidden;
    }

    .author {
      position: initial;
      top: initial;
      left: initial;
      display: flex;
      align-items: center;
      align-items: flex-start;
      grid-area: author;
    }

    .author-text {
      max-width: 50px;
    }

    .author-image {
      width: 48px;
      height: 48px;
      min-width: 48px;
    }

    .image {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      height: auto;
      align-items: center;
      aspect-ratio: initial;
    }

    .header {
      grid-area: header;
      margin-bottom: 16px;
    }

    .info {
      grid-area: info;
      padding-right: 24px;
      border-right: 1px solid rgb(217 217 217 / 7%);
    }

    .footer {
      display: flex;
      align-items: flex-end;
      grid-area: footer;
    }

    .title {
      max-height: 76px;
    }

    .text p {
      max-height: 42px;
    }
  }
`;
