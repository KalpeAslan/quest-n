import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  max-width: 680px;
  width: 100%;

  .btnBack {
    margin-right: 32px;
    max-width: 120px;
  }

  .btnSave {
    max-width: 328px;
  }

  .desktop {
    display: none;
  }

  @media screen and (min-width: 464px) {
    .desktop {
      display: inline;
    }

    .mobile {
      display: none;
    }
  }
`;
