import styled from "@emotion/styled";

export const Wrapper = styled.section`
  width: 90vw;
  max-width: 328px;
  background-color: var(--color-b0);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
  border-radius: 16px;

  .header {
    padding: 16px 16px 16px 44px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .title {
    width: 240px;
  }

  .content {
    padding: 24px;
  }

  .imageWrapper {
    position: relative;
    width: 280px;
    height: 136px;
  }

  .button {
    display: block;
    margin: 0 auto;
    width: 100%;
  }

  @media (min-width: 1024px) {
    max-width: 480px;

    .title {
      width: 392px;
    }

    .content {
      padding: 24px 16px;
    }

    .imageWrapper {
      position: relative;
      width: 448px;
      height: 136px;
    }

    .button {
      max-width: 208px;
    }
  }
`;
