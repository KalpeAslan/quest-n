import styled from "@emotion/styled";

export const DeletePopupWrapper = styled.section`
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

  .soc {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fc5b3f;
    background-color: rgb(252 91 63 / 10%);
    border-radius: 50%;
  }

  .soc svg {
    z-index: 2;
  }

  .decor {
    position: absolute;
    top: -25%;
    left: -25%;
    content: "";
    width: 91px;
    height: 150px;
    background: linear-gradient(180deg, #f00 0%, #ff00f5 100%);
    z-index: 1;
    opacity: 0.5;
    transform: rotate(-119.38deg);
    filter: blur(70px);
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
