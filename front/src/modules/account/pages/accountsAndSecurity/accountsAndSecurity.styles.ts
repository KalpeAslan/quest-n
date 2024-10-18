import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const AccountsAndSecurityStyles = styled(Box)`
  flex: 1;
  width: 100%;
  padding: 0 16px;

  .sticky {
    display: none;
  }

  @media (min-width: 768px) {
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
      gap: 12px;
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
  }

  @media (min-width: 1440px) {
    padding: 0 55px;
  }
`;
