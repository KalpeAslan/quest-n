import styled from "@emotion/styled";
import { Box } from "@mui/material";
import onboardingReward from "@assets/images/quest/onbording-reward.png";

export const SocWrapper = styled(Box)`
  position: relative;
  width: 50%;
  min-height: 178px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #87f696;
  z-index: 2;

  & svg {
    z-index: 2;
  }

  .decor {
    position: absolute;
    top: calc(50% - 68px);
    left: 0;
    content: "";
    width: 100%;
    height: 136px;
    background: linear-gradient(
      276.97deg,
      rgb(135 246 150 / 60%) 28.54%,
      rgb(0 255 255 / 60%) 49.83%,
      rgb(156 22 239 / 60%) 81.31%,
      rgb(66 0 255 / 60%) 104.23%
    );
    z-index: 1;
    opacity: 0.5;
    filter: blur(51px);
  }

  .icon {
    position: absolute;
    top: calc(50% - 63.5px);
    left: calc(50% - 63.5px);
  }
`;

export const ContWrapper = styled(Box)`
  z-index: 2;
`;

export const FooterWrapper = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 2;

  .butt {
    min-width: 208px !important;
  }
`;

export const WdDecor = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-image: url(${onboardingReward.src});
  background-repeat: no-repeat;
  background-position: right 50% top -30px;
  z-index: 1;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #101313;
    opacity: 0.6;
  }
`;
