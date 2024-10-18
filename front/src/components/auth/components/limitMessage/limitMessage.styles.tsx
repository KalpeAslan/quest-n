import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Button } from "@components/UI/button";

export const LimitMessageStylesSoc = styled(Box)`
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fc5b3f;
  background-color: rgb(252 91 63 / 10%);
  border-radius: 50%;

  svg {
    z-index: 2;
  }
`;

export const LimitMessageStylesButtons = styled(Box)`
  width: 100%;
  max-width: 328px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

export const LimitMessageStylesLink = styled(props => <Button {...props} />)`
  width: 100%;
`;
