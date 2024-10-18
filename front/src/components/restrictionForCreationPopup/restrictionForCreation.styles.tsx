import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { Button } from "@components/UI/button";

type TSocButtons = {
  type: "twitter" | "discord" | "telegram" | string;
};

export const RestrictionForCreationStylesWrapper = styled.section`
  width: 90vw;
  max-width: 480px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
`;

export const RestrictionForCreationStylesHeader = styled.header`
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  text-align: center;
`;

export const RestrictionForCreationStylesTitle = styled(Box)`
  flex: 1;
  text-align: center;
`;

export const RestrictionForCreationStylesContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const RestrictionForCreationStylesSoc = styled(Box)<TSocButtons>`
  width: 100%;
  max-width: 328px;
  padding: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 10px;

  svg {
    color: ${props =>
      props.type === "twitter"
        ? "#1d9bf0"
        : props.type === "discord"
        ? "#5562ea"
        : "#08c"};
  }
`;

export const RestrictionForCreationStylesFooter = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 16px;
`;

export const RestrictionForCreationStylesButt = styled(props => (
  <Button {...props} />
))`
  width: calc(50% - 8px);
`;

export const RestrictionForCreationStylesType = styled.span`
  text-transform: capitalize;
`;
