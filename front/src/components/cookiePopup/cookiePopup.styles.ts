import styled from "@emotion/styled";
import { css } from "@emotion/react";

const CookiePopupWrapper = styled.div`
  position: fixed;
  right: 0;
  bottom: 8px;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999999999;
`;

const CookiePopupContent = styled.div`
  width: 100%;
  max-width: 525px;
  margin: 0 16px;
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--cookie-popup-background-color);
  border: 1px solid var(--cookie-popup-border-color);
  border-radius: 16px;
  text-align: center;

  @media (min-width: 450px) {
    flex-direction: row;
  }
`;

const CookiePopupButton = css`
  width: 100%;

  @media (min-width: 570px) {
    width: auto;
    margin-left: auto;
  }
`;

export { CookiePopupWrapper, CookiePopupButton, CookiePopupContent };
