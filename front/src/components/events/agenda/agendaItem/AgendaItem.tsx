import { Agenda } from "@models";

import {
  AgendaItemStylesItem,
  AgendaItemStylesTime,
  AgendaItemStylesCaption,
  AgendaItemStylesSpeakersList,
  AgendaItemStylesSpeakersItem,
  AgendaItemStylesSpeakersAvatar,
  AgendaItemStylesSpeakersCaption,
  AgendaItemStylesSpeakersPosition,
  AgendaItemStylesTopWrapper,
  AgendaItemStylesAvatarWrapper,
} from "./agendaItem.styles";

type Props = {
  data: Agenda;
};

const AgendaItem = ({ data: { time, title, speakers } }: Props) => {
  return (
    <AgendaItemStylesItem>
      <AgendaItemStylesTopWrapper>
        <AgendaItemStylesTime>{time}</AgendaItemStylesTime>

        <AgendaItemStylesCaption>{title}</AgendaItemStylesCaption>

        <div className={"divider"} />
      </AgendaItemStylesTopWrapper>

      <AgendaItemStylesSpeakersList>
        {speakers.map((item: any, index: number) => (
          <AgendaItemStylesSpeakersItem key={index}>
            <AgendaItemStylesAvatarWrapper>
              <AgendaItemStylesSpeakersAvatar
                className={"lazyload"}
                src={item.avatar}
                alt={item.name}
                fill
              />
            </AgendaItemStylesAvatarWrapper>

            <div>
              <AgendaItemStylesSpeakersCaption>
                {item.name}
              </AgendaItemStylesSpeakersCaption>

              <AgendaItemStylesSpeakersPosition>
                {item.position}
              </AgendaItemStylesSpeakersPosition>
            </div>
          </AgendaItemStylesSpeakersItem>
        ))}
      </AgendaItemStylesSpeakersList>
    </AgendaItemStylesItem>
  );
};

export default AgendaItem;
