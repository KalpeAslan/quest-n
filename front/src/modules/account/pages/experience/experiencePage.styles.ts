import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CBreakpoints } from "@styles/variables";
import { keyframes } from "@emotion/react";

const blurAnimation = keyframes`
  from {
    backdrop-filter: blur(0px);
  }
  to {
    backdrop-filter: blur(5px); /* Adjust the blur amount as needed */
  }
`;

const unblurAnimation = keyframes`
  from {
    backdrop-filter: blur(5px);
  }
  to {
    backdrop-filter: blur(0px);
  }
`;

export const ExperiencePageStyles = styled(Box)<{
  fadeOutTime: number;
  isBlurred: boolean;
}>`
  flex: 1;
  width: 100%;
  padding: 0 16px;

  &::before {
    content: "";
    display: ${({ isBlurred }) => (isBlurred ? "block" : "none")};
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(0px);
    animation: ${({ isBlurred }) =>
        isBlurred ? blurAnimation : unblurAnimation}
      0.5s ease-in-out forwards;
    z-index: 3;
  }

  .border-radius-img {
    border-radius: 50%;
  }

  .blocks {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .sticky {
    display: none;
  }

  @media (min-width: ${CBreakpoints.preMd}px) {
    padding: 0 24px;
    display: grid;
    grid-template-areas:
      "header"
      "blocks";
    column-gap: 30px;

    .header {
      grid-area: header;
    }

    .blocks {
      grid-area: blocks;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }

  @media (min-width: 1280px) {
    .sticky {
      display: block;
      grid-area: sticky;
    }

    max-width: 1180px;
    margin-right: auto;
    margin-left: auto;
    grid-template-areas:
      "header header"
      "blocks sticky";
    grid-template-columns: 2fr 1fr;
    /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
    grid-template-rows: auto 1fr;

    .blocks {
      max-width: 635px;
    }
  }

  @media screen and (min-width: 1440px) {
    .blocks {
      max-width: none;
    }
  }
`;
