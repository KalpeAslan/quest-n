import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding: 0 16px;

  .projectItems {
    display: flex;
    flex-direction: column;
  }

  .text {
    margin-top: 42px;
    color: rgba(250, 250, 250, 0.3);
  }

  @media screen and (min-width: 768px) {
    padding: 0;

    .mobile-show {
      display: none;
    }
  }

  @media screen and (min-width: 1024px) {
    .projectItems {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .text {
      margin-top: 40px;
    }
  }
`;
