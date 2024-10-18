import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const InviteReferralPopupStylesWrapper = styled.section`
  width: 90vw;
  max-width: 480px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
`;

export const InviteReferralPopupStylesHeader = styled.header`
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
  text-align: center;
`;

export const InviteReferralPopupStylesTitle = styled(Box)`
  flex: 1;
  text-align: center;
`;

export const InviteReferralPopupStylesContent = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
