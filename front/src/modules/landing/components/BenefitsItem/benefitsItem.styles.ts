import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  background: #1e2927;
  padding: 21px 20px 25px 15px;
  height: 235px;
  border-radius: 16px;

  .benefitImageWrapper {
    margin-bottom: 10px;
  }

  .benefitImage {
    width: auto;
    height: 50px;
  }

  .benefitTitle {
    margin-bottom: 10px;
  }

  @media screen and (min-width: 1024px) {
    display: flex;
    align-items: center;
    height: 185px;

    .benefitImageWrapper {
      margin-bottom: 0;
      margin-right: 10px;
    }

    .benefitImage {
      width: 100px;
      height: auto;
    }
  }
`;
