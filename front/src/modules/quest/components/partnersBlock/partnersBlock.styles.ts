import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding: 70px 16px 80px;

  .marquee {
    background: #171c1c;
    padding: 12px 0;
    border-radius: 16px;
  }

  @media screen and (min-width: 768px) {
    padding: 70px 0 0;
  }
`;
