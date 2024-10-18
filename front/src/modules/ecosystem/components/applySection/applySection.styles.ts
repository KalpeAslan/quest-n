import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ApplySectionWrapper = styled(Box)`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    position: static;
    padding: 80px 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    z-index: 2;
  }

  .text {
    max-width: 750px;
  }
`;
