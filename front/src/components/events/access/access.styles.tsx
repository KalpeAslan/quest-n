import styled from "@emotion/styled";
import { Button } from "@components/UI/button";
import Image from "next/image";

const AccessModuleAccess = styled.section`
  position: relative;
  padding: 30px 20px 0;
  background: radial-gradient(
    circle,
    rgb(0 148 255 / 41%) 5%,
    rgb(255 255 255 / 0%) 50%
  );
  overflow: hidden;

  @media screen and (min-width: 1280px) {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: visible;
  }
`;

const AccessModuleCaption = styled.h2`
  margin-bottom: 30px;
  color: var(--color-w1);
  font-weight: 500;
  font-size: 32px;
  line-height: 36px;
  letter-spacing: -0.02em;
  text-align: center;

  @media screen and (min-width: 1280px) {
    position: relative;
    margin-bottom: 0;
    font-size: 48px;
    line-height: 56px;
    z-index: 1;
  }
`;

const AccessModuleImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 277px;
  margin-bottom: 30px;

  @media screen and (min-width: 1280px) {
    width: fit-content;
    height: fit-content;
    margin: 0 auto;
    margin-bottom: 30px;
  }
`;

const AccessModuleAccessImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 50%;
  width: 513px;
  height: 277px;
  transform: translateX(-50%);

  @media screen and (min-width: 1280px) {
    position: static;
    width: 562px;
    height: auto;
    transform: none;
  }
`;

const AccessModuleText = styled.p`
  position: relative;
  margin-bottom: 30px;
  color: var(--color-w1);
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: -0.01em;
  text-align: center;
  z-index: 2;

  @media screen and (min-width: 1280px) {
    width: 646px;
    margin: 0 auto;
    margin-bottom: 34px;
  }
`;

const AccessModuleAccessButton = styled(props => <Button {...props} />)`
  position: relative;
  width: 100%;
  z-index: 2;

  @media screen and (min-width: 1280px) {
    width: auto;
  }
`;

export {
  AccessModuleAccess,
  AccessModuleCaption,
  AccessModuleImageWrapper,
  AccessModuleAccessImage,
  AccessModuleText,
  AccessModuleAccessButton,
};
