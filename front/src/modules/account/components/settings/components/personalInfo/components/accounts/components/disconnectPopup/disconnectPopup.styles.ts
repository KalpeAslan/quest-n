import styled from "@emotion/styled";

export const DisconnectPopupWrapper = styled.section`
  width: 90vw;
  max-width: 480px;
  min-width: 288px;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);

  .header {
    padding: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgb(255 255 255 / 10%);
    text-align: center;
  }

  .title {
    flex: 1;
    text-align: center;
  }

  .content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .button-google svg {
    color: var(--tasks-google-icon-color);
  }

  .button-twitter svg {
    color: #1d9bf0;
  }

  .button-discord svg {
    color: #5562ea;
  }

  .button-telegram svg {
    color: #08c;
  }

  .button-phone svg {
    color: var(--text-color-2);
  }

  .button-email svg {
    color: var(--text-color-2);
  }

  .soc {
    width: 100%;
    max-width: 328px;
    padding: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 10px;
  }

  .footer {
    width: 100%;
    display: flex;
    gap: 16px;
  }

  .butt {
    width: calc(50% - 8px);
  }
`;
