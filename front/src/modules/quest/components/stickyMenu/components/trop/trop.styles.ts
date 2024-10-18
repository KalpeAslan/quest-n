import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  border-radius: 17px;
  background: #101313;
  z-index: 1;
  position: relative;
  width: fit-content;
  margin: 0 auto;

  .main {
    width: fit-content;
    border-radius: 17px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(
      145deg,
      rgba(135, 246, 150, 0.1) 4.67%,
      rgba(71, 192, 88, 0.04) 98.09%
    );
    padding: 10px 14px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }
`;
