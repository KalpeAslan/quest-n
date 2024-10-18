import styled from "@emotion/styled";
import Icon from "@components/UI/icon/Icon";
import { Trans } from "@lingui/macro";
import { FC, useState } from "react";
import { keyframes } from "@emotion/react";
import Button from "@components/UI/button/Button";
import { ELinks } from "@models";

export const ChatWithUs: FC = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <StyledPulsedButton
      style={{ cursor: clicked && "pointer" }}
      className={"chat-with-us"}
      onClick={() => setClicked(true)}
    >
      {!clicked ? (
        <div
          className={"chat-with-us__closed"}
        >
          <Icon size={"25"} name={"alphaGuiltyLogo"} />
          <p style={{ marginLeft: 10 }} className={"c-font-16-18 c-font-color"}>
            <Trans id={"jweiv-jPOEG-WQOIE-quest"}>Chat with us!</Trans>
          </p>
        </div>
      ) : (
        <div className={"c-flex-items-center c-flex c-font-color"} style={{ gap: 10 }}>
          <Icon
            onClick={(e) => {
              e.stopPropagation();
              setClicked(false);
            }}
            className={"close-icon"}
            size={"25"}
            name={"menu-close"}
          />
          <a href={ELinks.discord} target={"_blank"} rel={"noreferrer"}>
            <StyledIconButton style={"roundedColorfull"}>
              <Icon size={"25"} name={"discord"} />
            </StyledIconButton>
          </a>
          <a href={ELinks.telegram} target={"_blank"} rel={"noreferrer"}>
            <StyledIconButton style={"roundedColorfull"}>
              <Icon size={"25"} name={"telegram"} />
            </StyledIconButton>
          </a>
        </div>
      )}
    </StyledPulsedButton>
  );
};

const waveAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 transparent, 0 0 0 0 transparent, 0 0 0 0 transparent, 0 0 0 0 transparent, 0 0 0 0 rgba(95, 206, 110, 0.45), 0 0 0 0 rgba(95, 206, 110, 0.45), 0 0 0 0 transparent, 0 0 0 0 rgba(95, 206, 110, 0.45);
  }
  100% {
    box-shadow: 0 0 0 15px transparent, 0 0 0 5px transparent, 0 0 0 7px transparent, 0 0 0 10px transparent, 0 0 0 15px transparent, 0 0 0 20px transparent;
  }
`;

const StyledPulsedButton = styled.button`
  height: 58px;
  padding: 7px 12px;
  border: 0.4px solid;
  border-radius: 60px;
  background: #202020;
  animation: ${waveAnimation} 3s infinite;
  box-shadow: 0 0 0 0 rgba(84, 126, 190, 0.7);
  transition: background-color 0.2s;

  .close-icon {
    cursor: pointer;
    position: relative;
    bottom: 2px;
  }

  .chat-with-us__closed {
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
  }
`;

const StyledIconButton = styled(Button)`
  border-radius: 50%;
  padding: 10px !important;
  width: 44px;
  height: 44px;
`;
