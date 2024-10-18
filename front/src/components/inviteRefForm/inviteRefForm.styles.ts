import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const InviteRefFormStylesWrapper = styled.section`
  width: 100%;
  max-width: 296px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
`;

export const InviteRefFormStylesItemWrapper = styled(Box)`
  padding-bottom: 5px;
  border-bottom: 1px solid rgb(255 255 255 / 10%);
`;

export const InviteRefFormStylesItemValue = styled.div`
  display: flex;
  align-items: center;
`;
