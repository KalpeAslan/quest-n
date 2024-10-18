import styled from "@emotion/styled";
import { Box } from "@mui/system";

export const ButtonsWrapper = styled(Box)`
  width: 100%;
  max-width: 328px;

  .button {
    height: 48px;
    padding: 11px 16px !important;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    border: none;
    position: relative;

    & > svg {
      position: absolute;
      left: 16px;
    }
  }

  .iframeButton {
    width: calc((100% - 20px) / 2);
  }

  .button:not(:last-child) {
    margin-bottom: 24px;
  }

  .button:hover {
    cursor: pointer;
  }

  .button:focus-visible {
    outline: 2px solid #9ef7aa !important;
  }

  .button:hover,
  .button:active,
  .button:focus {
    text-decoration: none !important;
  }

  .button-twitter {
    background-color: rgb(250 250 250 / 10%);

    svg {
      color: var(--tasks-twitter-icon-color);
    }
  }

  .button-discord {
    background-color: rgb(250 250 250 / 10%);

    svg {
      color: var(--tasks-discord-icon-color);
    }
  }

  .button-google {
    background-color: rgb(250 250 250 / 10%);

    svg {
      color: var(--tasks-google-icon-color);
    }
  }

  .button-email {
    width: 100%;
  }

  .divider {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .divider::before,
  .divider::after {
    content: "";
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    flex-grow: 1;
  }

  .divider::before {
    margin-right: 8px;
  }

  .divider::after {
    margin-left: 8px;
  }
`;
