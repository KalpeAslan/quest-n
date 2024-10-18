import styled from "@emotion/styled";

export const InviteReferralButtonStylesButton = styled.button`
  width: 100%;
  padding: 8px;
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 1px solid rgb(217 217 217 / 10%);
  border-radius: 8px;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--button-primary-hover-background-color);
    outline-offset: 2px;
  }
`;

export const InviteReferralButtonStylesIcon = styled.div`
  margin-left: 12px;
  padding: 8px 8px 8px 16px;
  display: flex;
  color: #87f696;
  border-left: 1px solid rgb(217 217 217 / 10%);
`;
