import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)`
  .mainBlock {
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: #101313;
    padding: 68px 24px 24px;
    margin-top: -47px;
    margin-bottom: 20px;
  }

  .winnersCount {
    width: fit-content;
    margin: 0 auto;
    margin-bottom: 20px;
    padding: 10px 15px;
    border-radius: 24px;
    opacity: 0.9;
    background: linear-gradient(
      180deg,
      rgba(135, 246, 150, 0.15) 0%,
      rgba(135, 246, 150, 0.11) 100%
    );
  }

  .taskProgressBar {
    margin-top: 24px;
  }

  .tokenRewardContainer:not(:last-child) {
    margin-bottom: 10px;
  }

  .statusText {
    margin-top: 24px;
  }

  .claimButton {
    width: 100%;
    margin-top: 20px;
    display: block;
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;

    &.countDownColor {
      color: #87f696;
      background: rgba(250, 250, 250, 0.1);
    }
  }

  .scoreboard-animation-enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  .scoreboard-animation-enter-active {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 500ms, transform 500ms;
  }
  .scoreboard-animation-exit {
    opacity: 1;
  }
  .scoreboard-animation-exit-active {
    opacity: 0;
    transform: translateY(-50%);
    transition: opacity 500ms, transform 500ms;
  }
`;
