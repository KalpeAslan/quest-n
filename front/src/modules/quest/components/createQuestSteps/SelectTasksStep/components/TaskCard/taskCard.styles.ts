import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  padding: 16px;
  background: rgba(0, 0, 0, 0.33);
  border-radius: 16px;
  margin-bottom: 12px;
  cursor: pointer;

  .mark {
    width: 24px;
    height: 24px;
    background: #101313;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
  }

  .iconWrapper {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    margin-right: 8px;
  }
`;
