import styled from "@emotion/styled";
import Image from "next/image";

const SpeakerItemStylesItem = styled.div`
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background: var(--color-b8);
  overflow: hidden;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  @media screen and (min-width: 1280px) {
    &:not(:last-child) {
      margin: 0;
    }
  }
`;

const SpeakerItemStylesImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 275px;
  overflow: hidden;
`;

const SpeakerItemStylesItemImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

const SpeakerItemStylesContent = styled.div`
  flex: 1;
  padding: 17px 20px 13px;
  display: flex;
  flex-direction: column;
`;

const SpeakerItemStylesTopWrapper = styled.div`
  margin-bottom: 13px;
`;

const SpeakerItemStylesTitle = styled.div`
  display: flex;
  align-items: flex-start;
`;

const SpeakerItemStylesLogo = styled.a`
  width: 35px;
  min-width: 35px;
  height: 35px;
  margin-left: auto;
  border-radius: 50%;
  overflow: hidden;
`;

const SpeakerItemStylesItemIcon = styled(Image)`
  height: 35px;
  width: 35px;
`;

const SpeakerItemStylesName = styled.h3`
  margin-right: 15px;
  color: var(--color-w1);
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
`;

const SpeakerItemStylesPosition = styled.p`
  color: var(--color-w1);
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  opacity: 0.5;
`;

const SpeakerItemStylesBottomWrapper = styled.div`
  margin-top: auto;
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgb(255 255 255 / 50%);
`;

const SpeakerItemStylesSocList = styled.ul`
  width: fit-content;
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
`;

const SpeakerItemStylesSocItem = styled.li`
  &:not(:last-child) {
    margin-right: 13px;
  }
`;

const SpeakerItemStylesSocLink = styled.a`
  height: 20px;
  display: block;
  color: var(--color-w1);
`;

const SpeakerItemStylesProjectLink = styled.a`
  color: var(--color-gr9);
  font-weight: 500;
  font-size: 14px;
  text-decoration: none;
  line-height: 20px;
  text-transform: lowercase;
`;

export {
  SpeakerItemStylesBottomWrapper,
  SpeakerItemStylesContent,
  SpeakerItemStylesItem,
  SpeakerItemStylesItemIcon,
  SpeakerItemStylesProjectLink,
  SpeakerItemStylesSocItem,
  SpeakerItemStylesSocLink,
  SpeakerItemStylesSocList,
  SpeakerItemStylesTitle,
  SpeakerItemStylesItemImage,
  SpeakerItemStylesLogo,
  SpeakerItemStylesName,
  SpeakerItemStylesPosition,
  SpeakerItemStylesTopWrapper,
  SpeakerItemStylesImageWrapper,
};
