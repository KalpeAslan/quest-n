import styled from "@emotion/styled";

export const Wrapper = styled.section`
  width: 90vw;
  max-width: 380px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
  padding: 40px 18px 20px;
  position: relative;

  .closeButton {
    position: absolute;
    right: 18px;
    top: 8px;
  }
`;
