import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ReferralWrapper = styled(Box)`
  padding: 0 16px;
  display: grid;
  grid-template-areas:
    "header"
    "info"
    "blocks"
    "sticky";
  grid-template-columns: 100%;
  row-gap: 12px;

  .header {
    grid-area: header;
  }

  .info {
    margin-right: -16px;
    grid-area: info;
  }

  .blocks {
    grid-area: blocks;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .sticky {
    grid-area: sticky;
  }

  @media (min-width: 768px) {
    padding: 0 24px;
    display: grid;

    .info {
      margin-right: 0;
      grid-area: info;
    }

    .blocks {
      flex-direction: row;
    }
  }

  @media (min-width: 1024px) {
    max-width: 1180px;
    margin-right: auto;
    margin-left: auto;
    grid-template-areas:
      "header header"
      "info sticky"
      "blocks sticky";
    grid-template-columns: 2fr 1fr;
    /* stylelint-disable-next-line declaration-block-no-redundant-longhand-properties */
    grid-template-rows: auto 1fr;
    column-gap: 12px;
  }

  @media (min-width: 1440px) {
    column-gap: 30px;
  }
`;
