import styled from "@emotion/styled";
import Image from "next/image";

const AgendaItemStylesItem = styled.li`
  padding: 20px 28px 50px 20px;
  background: var(--color-b8);
  border-radius: 10px;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const AgendaItemStylesTopWrapper = styled.div`
  position: relative;
  height: 143px;
  margin-bottom: 30px;
  padding-left: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .divider {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 10px;
    width: 2px;
    height: 143px;
    background: var(--color-gr2);
  }

  @media screen and (min-width: 1280px) {
    width: 40%;
  }
`;

const AgendaItemStylesTime = styled.p`
  color: var(--color-gr2);
  font-weight: 500;
  font-size: 14px;
  line-height: 30px;

  @media screen and (min-width: 1280px) {
    width: 270px;
  }
`;

const AgendaItemStylesCaption = styled.h3`
  color: var(--color-w1);
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;

  @media screen and (min-width: 1280px) {
    width: 270px;
  }
`;

const AgendaItemStylesSpeakersList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  padding-left: 2px;
  flex: 1;
  display: flex;
`;

const AgendaItemStylesSpeakersItem = styled.li`
  display: flex;
  align-items: center;
  &:not(:last-child) {
    margin-bottom: 30px;
  }
  @media screen and (min-width: 1280px) {
    margin: 0;
    margin-right: 30px;
  }
`;

const AgendaItemStylesAvatarWrapper = styled.div`
  width: 70px;
  min-width: 70px;
  height: 70px;
  margin-right: 20px;
  overflow: hidden;
  border-radius: 50%;
`;

const AgendaItemStylesSpeakersAvatar = styled(Image)`
  width: 100%;
`;

const AgendaItemStylesSpeakersCaption = styled.h3`
  color: var(--color-w1);
  font-weight: 500;
  font-size: 24px;
  line-height: 30px;
`;

const AgendaItemStylesSpeakersPosition = styled.p`
  color: var(--color-w1);
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  opacity: 0.5;
`;

export {
  AgendaItemStylesSpeakersItem,
  AgendaItemStylesSpeakersList,
  AgendaItemStylesAvatarWrapper,
  AgendaItemStylesSpeakersAvatar,
  AgendaItemStylesSpeakersCaption,
  AgendaItemStylesSpeakersPosition,
  AgendaItemStylesItem,
  AgendaItemStylesTopWrapper,
  AgendaItemStylesTime,
  AgendaItemStylesCaption,
};
