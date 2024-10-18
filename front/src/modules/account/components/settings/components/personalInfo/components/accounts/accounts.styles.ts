import styled from "@emotion/styled";

export const AccountsWrapper = styled.div`
  .button {
    width: 100%;
    max-width: 328px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .butt {
    padding: 13px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 48px;
    max-width: 48px;

    p {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .button-google svg {
    color: var(--tasks-google-icon-color);
  }

  .button-twitter svg {
    color: var(--tasks-twitter-icon-color);
  }

  .button-discord svg {
    color: var(--tasks-discord-icon-color);
  }

  .button-telegram svg {
    color: var(--tasks-telegram-icon-color);
  }

  .button-creds svg {
    color: var(--text-color-2);
  }

  .soc-wrapper {
    max-width: 328px;
    gap: 15px;
    display: flex;
    align-items: center;
  }

  .soc {
    flex: 1;
    max-width: 328px;
    padding: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 10px;
  }

  .disconnect {
    display: none;
  }

  .accountItem:not(:last-child) {
    margin-bottom: 25px;
  }

  .credsAuth {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid #2f2f2f;
  }

  .changePasswordBtn {
    color: rgba(255, 255, 255, 0.5);
    background: none;
    border: none;
    outline: none;
    text-decoration: underline;
    margin-top: 20px;
    cursor: pointer;
  }

  @media screen and (min-width: 768px) {
    .disconnect {
      display: block;
    }

    .butt {
      max-width: 48px !important;
    }

    .accounts {
      max-width: 680px;
      display: flex;
      justify-content: space-between;
      column-gap: 25px;
      row-gap: 25px;
      flex-wrap: wrap;
    }

    .accountItem {
      width: calc((100% - 25px) / 2);

      &:not(:last-child) {
        margin-bottom: 0;
      }
    }
  }
`;
