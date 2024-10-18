import { Button } from "@components/UI/button";
import styled from "@emotion/styled";
import { Box } from "@mui/system";

export const AccountWrapper = styled(Box)`
  padding: 24px 24px 16px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 16px;

  .footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: rgb(250 250 250 / 30%);
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }

  .button {
    width: calc(50% - 8px);
    padding: 10px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fafafa;
    background: rgb(255 255 255 / 10%);
    border: none;
    border-radius: 10px;
  }

  .button:hover {
    cursor: pointer;
  }

  .button:focus-visible {
    outline: 2px solid #fafafa !important;
  }

  .button:hover,
  .button:active,
  .button:focus {
    text-decoration: none !important;
  }

  .active {
    background: rgb(255 255 255 / 30%);
  }

  .footer-button {
    display: flex;
    align-items: center;
    color: rgb(250 250 250 / 30%) !important;
    font-weight: 400 !important;
    font-size: 14px !important;
    text-decoration: underline;
  }

  .footer-button:focus-visible {
    outline: 2px solid #fafafa !important;
  }

  .footer-button:hover,
  .footer-button:active,
  .footer-button:focus {
    text-decoration: none !important;
  }
`;

export const AccountButton = styled(Button)`
  width: 100%;
`;

export const AccountLink = styled(Button)`
  margin: 0 auto;
  margin-top: 14px;
  width: fit-content;
`;
