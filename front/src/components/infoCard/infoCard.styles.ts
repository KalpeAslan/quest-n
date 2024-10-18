import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const InfoCardStylesWrapper = styled.section`
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InfoCardStylesContent = styled.div`
  position: relative;
  padding: 80px 0 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  z-index: 2;
`;

export const InfoCardStylesIcon = styled(Box)`
  padding: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--button-checked-text-color);
  background: var(--button-checked-background-color);
  border-radius: 50%;
`;
