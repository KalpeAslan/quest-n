import styled from "@emotion/styled";
import { Button } from "@components/UI/button";
import { Box } from "@mui/material";

export const CodeStepStylesButtons = styled(Box)`
  width: 100%;
  max-width: 328px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const CodeStepStylesButton = styled(props => <Button {...props} />)`
  width: 100%;
`;

export const CodeStepStylesLink = styled(props => <Button {...props} />)`
  height: 22px;
  justify-content: center;
  color: rgb(255 255 255 / 30%) !important;
  font-weight: 400 !important;
  text-decoration: underline;

  &:not(:disabled):hover {
    color: rgb(255 255 255 / 50%) !important;
  }

  &:not(:disabled):hover {
    color: rgb(255 255 255 / 50%) !important;
  }

  &:disabled {
    color: rgb(255 255 255 / 20%) !important;
    text-decoration: none;
  }
`;
