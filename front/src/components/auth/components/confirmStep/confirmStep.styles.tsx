import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Button } from "@components/UI/button";
import { OverridableComponent } from "@mui/types";
import { BoxTypeMap } from "@mui/system";
import { Theme as MaterialTheme } from "@mui/material/styles/createTheme";

export const ConfirmStepStylesForm = styled(Box)`
  width: 100%;
  max-width: 328px;
  text-align: left;
` as OverridableComponent<BoxTypeMap<{}, "div", MaterialTheme>>;

export const ConfirmStepStylesButton = styled((props: any) => (
  <Button {...props} />
))`
  width: 100%;
`;

export const ConfirmStepStylesFooter = styled.footer`
  max-width: 328px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const ConfirmStepStylesLink = styled(props => <Button {...props} />)`
  height: 22px;
  justify-content: center;
  color: rgb(255 255 255 / 30%) !important;
  font-weight: 400 !important;
  text-decoration: underline;

  &:not(:disabled):hover {
    color: rgb(255 255 255 / 50%) !important;
  }

  &:disabled {
    color: rgb(255 255 255 / 20%) !important;
    text-decoration: none;
  }
`;
