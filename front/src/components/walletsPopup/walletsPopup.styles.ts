import styled from "@emotion/styled";
import { Box } from "@mui/material";

// Wrapper component
const WalletsPopupStylesWrapper = styled.section`
  width: 80vw;
  max-width: 500px;
  min-width: 288px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 12px;
  background-color: var(--wallets-popup-background-color);
  box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
`;

// Button component
const WalletsPopupStylesButton = styled(Box)`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--wallets-popup-button-hover-background-color);
    cursor: pointer;
  }
`;

const WalletsPopupStylesLink = styled.a`
  text-decoration: none;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--wallets-popup-button-hover-background-color);
    cursor: pointer;
  }
`;

// Title component
const WalletsPopupStylesTitle = styled(Box)`
  color: var(--wallets-popup-text-color);
  transition: color 0.3s;

  ${WalletsPopupStylesButton}:hover & {
    color: var(--wallets-popup-text-hover-color);
  }
`;

// Subtitle component
const WalletsPopupStylesSubtitle = styled.div`
  color: var(--wallets-popup-sub-text-color);
  transition: color 0.3s;

  ${WalletsPopupStylesButton}:hover & {
    color: var(--wallets-popup-sub-text-hover-color);
  }
`;

export {
  WalletsPopupStylesWrapper,
  WalletsPopupStylesButton,
  WalletsPopupStylesTitle,
  WalletsPopupStylesSubtitle,
  WalletsPopupStylesLink,
};

// .wrapper {
//   width: 80vw;
//   max-width: 500px;
//   min-width: 288px;
//   padding: 10px;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
//   border-radius: 12px;
//   background-color: var(--wallets-popup-background-color);
//   box-shadow: 0 2px 6px var(--wallets-popup-box-shadow);
// }
//
// .button {
//   padding: 24px 16px;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   border-radius: 12px;
//   transition: background-color .3s;
// }
//
// .title {
//   color: var(--wallets-popup-text-color);
//   transition: color .3s;
// }
//
// .sub-title {
//   color: var(--wallets-popup-sub-text-color);
//   transition: color .3s;
// }
//
// .button:hover {
//   background-color: var(--wallets-popup-button-hover-background-color);
//   cursor: pointer;
// }
//
// .button:hover .title {
//   color: var(--wallets-popup-text-hover-color);
// }
//
// .button:hover .sub-title {
//   color: var(--wallets-popup-sub-text-hover-color);
// }
