import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;

  .show-more-btn {
    justify-content: flex-start;

    &.opened button {
      color: var(--color-g10) !important;
    }

    button {
      color: #87f696 !important;
      font-size: 16px !important;
      line-height: 25px !important;
      text-decoration: underline !important;
      padding: 0 !important;

      svg {
        display: none;
      }
    }
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;

    .imageWrapper {
      position: relative;
      flex-grow: 2;
      height: 50%;
      position: relative;
      max-width: 400px;
      min-width: 400px;
      min-height: 500px;
    }

    .image {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .mobile {
      display: none;
    }

    .desktop {
      display: block;
    }
  }
`;
