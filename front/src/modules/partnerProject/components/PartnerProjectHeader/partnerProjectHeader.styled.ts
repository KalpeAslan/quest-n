import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px !important;

  .imageWrapper {
    position: relative;
    margin: 0 auto;
    margin-top: -48px;
    width: 64px;
    min-width: 64px;
    height: 64px;
  }

  .image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }

  .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .icon {
    color: #fff;
  }

  .show-more-btn {
    margin-top: 8px;
    margin-left: -8px;
    margin-bottom: 20px;
    justify-content: flex-start;

    button {
      color: rgba(255, 255, 255, 0.3) !important;
    }

    span {
      font-size: 14px !important;
      line-height: 20px !important;
      color: rgba(255, 255, 255, 0.3) !important;
    }

    svg {
      width: 20px !important;
      height: 20px !important;
      stroke: rgba(255, 255, 255, 0.3) !important;
    }
  }

  .show-more-btn.opened {
    margin-top: 0;
  }

  .soc ul {
    justify-content: center;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: rgba(217, 217, 217, 0.1);
    margin-top: 20px;
    margin-bottom: 12px;
  }

  .paramsContainer {
    display: flex;
    justify-content: space-between;
  }

  .green {
    color: #87f696;
  }

  .tablet {
    display: none;
  }

  @media screen and (min-width: 768px) {
    padding: 24px !important;

    .mobile {
      display: none;
    }

    .tablet {
      display: block;
    }

    .topWrapper {
      display: flex;
      align-items: center;
    }

    .imageWrapper {
      margin: 0;
      width: 48px;
      min-width: 48px;
      height: 48px;
      margin-right: 34px;
    }

    .divider {
      margin-top: 24px;
      margin-bottom: 24px;
    }

    .icon {
      width: 15px !important;
      height: 15px !important;
    }

    .mr-24 {
      margin-right: 24px;
    }

    .soc ul {
      justify-content: flex-start;
    }

    .show-more-btn {
      margin-bottom: 4px;
      margin-top: 4px;
    }
  }

  @media screen and (min-width: 1024px) {
    display: flex;

    .leftWrapper {
      display: flex;
      align-items: flex-start;
      width: 100%;
    }

    .imageWrapper {
      margin: 0;
      width: 64px;
      min-width: 64px;
      height: 64px;
      margin-right: 24px;
    }

    .icon {
      width: 20px !important;
      height: 20px !important;
    }

    .show-more-btn {
      margin-bottom: 6px;
    }

    .divider {
      margin: 0;
      height: auto;
      width: 1px;
      margin-left: 24px;
      margin-right: 24px;
    }

    .param {
      display: flex;
      flex-direction: column-reverse;
      font-size: 14px;
      line-height: 20px;
    }

    .green {
      font-size: 20px;
      line-height: 24px;
    }

    .mb {
      margin-bottom: 24px;
    }

    .mr {
      margin-right: 24px;
    }

    .desktop {
      display: block;
    }
    .desktop-admin {
      display: flex !important;
    }

    .tablet {
      display: none;
    }
  }
`;

export const DescriptionWrapper = styled(Box)`
  @supports (
    (display: -webkit-box) or (-webkit-box-orient: vertical) or
      (-webkit-line-clamp: 2)
  ) {
    &.desc {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
`;
