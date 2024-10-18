import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Button } from "@components/UI/button";

type TWalletButtonStylesContent = {
  connect: boolean;
};

export const WalletButtonStylesContent = styled.section`
  display: flex;
  flex-direction: column;
  max-width: 328px;
  height: 48px;
`;

export const WalletButtonStylesInfo = styled.div<TWalletButtonStylesContent>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 1px solid rgb(255 255 255 / 10%);
  background: ${props =>
    props.connect ? "transparent" : "var(--button-task-background-color)"};
  border-radius: 10px;
  height: 48px;
  margin-right: 16px;
`;

export const WalletButtonStylesIcon = styled(Box)`
  margin-right: 10px;
`;

export const WalletButtonStylesText = styled.div`
  text-align: center;
`;

export const WalletButtonStylesButton = styled(props => (
  <Button {...props} />
))<TWalletButtonStylesContent>`
  height: 100%;
  width: 100%;
  padding: 13px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fafafa;
  background-color: rgb(250 250 250 / 10%);
  border: none;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid #fafafa !important;
  }

  &:hover,
  &:active,
  &:focus {
    text-decoration: none !important;
  }

  ${props => props.connect && "border-radius: 10px"};
`;

export const WalletDisconnect = styled(props => <Button {...props} />)`
  padding: 13px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 48px;
  max-width: 48px;
`;
