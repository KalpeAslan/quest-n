import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 90vw;
  max-width: 480px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);

  .header {
    position: relative;
    padding: 16px 38px;
    min-height: 59px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
    text-align: center;
  }

  .close {
    position: absolute;
    top: 16px;
    right: 16px;
  }

  .title {
    flex: 1;
    text-align: center;
  }

  .content {
    position: relative;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .link {
    padding: 0 !important;
    font-size: 20px !important;
    line-height: 24px !important;
    text-decoration: none;
  }
`;
