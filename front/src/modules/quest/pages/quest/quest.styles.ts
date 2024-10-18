import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)<{ isOnboardingTaskDone: boolean }>`
  flex: 1;
  padding: 0 !important;
  padding-top: ${props =>
    props.isOnboardingTaskDone ? "0" : "122px"}!important;
  position: relative;

  @media screen and (min-width: 588px) {
    padding-top: ${props =>
      props.isOnboardingTaskDone ? "0" : "98px"}!important;
  }

  @media screen and (min-width: 768px) {
    padding: 24px 24px 40px 24px !important;
  }

  @media screen and (min-width: 1024px) {
    padding: 40px 20px 80px !important;
  }

  @media screen and (min-width: 1440px) {
    padding: 40px 60px 80px !important;
  }
`;

export const Header = styled(Box)`
  width: 100%;
  background: linear-gradient(
      122.62deg,
      rgba(84, 126, 190, 0.08) 14.13%,
      rgba(81, 220, 94, 0.08) 85.37%
    ),
    rgba(16, 19, 19, 0.95);
  padding-top: 12px;
  padding-bottom: 16px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;

  .title {
    margin-bottom: 8px;
    text-align: center;
  }

  .mobile-hidden {
    display: none;
  }

  @media screen and (min-width: 768px) {
    border-radius: 16px;
    padding: 16px;
    flex-direction: row;
    justify-content: space-between;
    position: static;
    margin-bottom: 24px;

    .title {
      max-width: 307px;
      margin-bottom: 0;
      text-align: left;
    }

    .mobile-hidden {
      display: inline;
    }
  }

  @media screen and (min-width: 1024px) {
    padding: 16px 28px;
    margin-bottom: 40px;

    .title {
      max-width: 490px;
    }
  }
`;
