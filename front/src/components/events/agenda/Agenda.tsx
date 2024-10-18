import { t, Trans } from "@lingui/macro";

import { AgendaItem } from "./agendaItem";

import agendaImage from "@assets/images/global-event/agendaImage.webp";

import mishaSitalo from "@assets/images/global-event/speakers/misha-sitalo-alpha-guilty.webp";
import lynnNguyen from "@assets/images/global-event/speakers/lynn-nguyen-roseon-world.webp";
import leonLee from "@assets/images/global-event/speakers/leon-lee-only1.webp";
import berkerZor from "@assets/images/global-event/speakers/berker-zor-babylons.webp";
import marielaTanchez from "@assets/images/global-event/speakers/mariela-tanchez-gate-io.webp";
import igorPlusa from "@assets/images/global-event/speakers/igor-plusa.webp";

import {
  AgendaStylesCaption,
  AgendaStylesContainer,
  AgendaStylesImage,
  AgendaStylesText,
  AgendaStylesButton,
  AgendaStylesDate,
  AgendaStylesList,
} from "./agenda.styles";
import { Agenda } from "@/models";

type Props = {
  showInfo: boolean;
};

const EventAgendaSection = ({ showInfo }: Props) => {
  const agendaData: Agenda[] = [
    {
      time: "3 PM - 3:10 PM GMT +2",
      title: t({
        id: "k4yXGf7CgmaA1mXdZSvyTK-OnlineEvent",
        message: "Welcome",
      }),
      speakers: [],
    },
    {
      time: "3:10 PM - 3:20 PM GMT +2",
      title: t({
        id: "5EgT35tXY1PFDXHimfvDcR-OnlineEvent",
        message: "How to benefit from your partners on a bear market",
      }),
      speakers: [
        {
          name: t({
            id: "44HoBZbsXqCShdothVQ7YY-OnlineEvent",
            message: "Lynn Nguyen",
          }),
          position: t({
            id: "3Npbt46sWihpk9jBJMb1m6-OnlineEvent",
            message: "Head of Partnerships",
          }),
          avatar: lynnNguyen.src,
        },
      ],
    },
    {
      time: "3:20 PM - 3:30 PM GMT +2",
      title: t({
        id: "ogwQodybexuRZcNWEWXZGN-OnlineEvent",
        message: "Smart investment mechanics of tomorrow",
      }),
      speakers: [
        {
          name: t({
            id: "5f2eZgY463GCBcWsN3M8nE-OnlineEvent",
            message: "Mikhail Sitalo",
          }),
          position: "CEO",
          avatar: mishaSitalo.src,
        },
      ],
    },
    {
      time: "3:30 PM - 3:40 PM GMT +2",
      title: t({
        id: "9mkEN4WENva7R1jAotbaHq-OnlineEvent",
        message: "How NFTs will change the creator economy due to bear market",
      }),
      speakers: [
        {
          name: t({
            id: "ehQSJrM9UhPnwUY5ncsrqh-OnlineEvent",
            message: "Leon Lee",
          }),
          position: t({
            id: "67BYvsgDjib4K9NubRFhST-OnlineEvent",
            message: "Founder and CEO",
          }),
          avatar: leonLee.src,
        },
      ],
    },
    {
      time: "3:40 PM - 3:50 PM GMT +2",
      title: t({
        id: "d1UZpJBjfshqAcu37eHq85-OnlineEvent",
        message:
          '"Safety guidelines" of launchpads  could damage the ecosystem in the long run ',
      }),
      speakers: [
        {
          name: t({
            id: "oAHy2FAuP7UENDLR2JW1ov-OnlineEvent",
            message: "Berker Zor",
          }),
          position: t({
            id: "mhmKxG6cnj22Ea8egpdXeB-OnlineEvent",
            message: "Business Developer",
          }),
          avatar: berkerZor.src,
        },
      ],
    },
    {
      time: "3:50 AM - 4 PM GMT +2",
      title: t({
        id: "29B7x9Uym4TzQkMzEjcMoy-OnlineEvent",
        message:
          "How to continue in crypto during bear market without risking assets",
      }),
      speakers: [
        {
          name: t({
            id: "rBsNkYjnNXwmtSefhn9QBH-OnlineEvent",
            message: "Mariela Tanchez",
          }),
          position: t({
            id: "fEvGmeRcERoKFRnoM1jACx-OnlineEvent",
            message: "Global Head of Business Development",
          }),
          avatar: marielaTanchez.src,
        },
      ],
    },
    {
      time: "4 PM - 4:10 PM GMT +2",
      title: t({
        id: "cR5LbmfzHVf11a7Z2h5WVy-OnlineEvent",
        message:
          "How to create token economy to support your ecosystem during bear market",
      }),
      speakers: [
        {
          name: t({
            id: "7m5KbQy7K13XiCYf1vx6Mo-OnlineEvent",
            message: "Igor Płusa",
          }),
          position: t({
            id: "euCVqcNSChT5Wq3aytcumV-OnlineEvent",
            message: "Entrepreneur | Advisor | Digital Assets Investor",
          }),
          avatar: igorPlusa.src,
        },
      ],
    },
    {
      time: "4:10 PM - 4:50 PM GMT +2",
      title: t({
        id: "xeQ4SGmDBVtzDZ5Rt3peT8-OnlineEvent",
        message: "Q&A Session",
      }),
      speakers: [],
    },
  ];

  return (
    <AgendaStylesContainer>
      <AgendaStylesImage
        className={"lazyload"}
        src={agendaImage}
        alt="agenda image"
      />

      <AgendaStylesCaption>
        <Trans id="5X4F4QZGvRAkpKqA5wWUpG-events">Agenda</Trans>
      </AgendaStylesCaption>

      <AgendaStylesText>
        <Trans id="x7NPrZqweuKEJTCfhRQ6oV-events">
          Join our group and ask your question. Our speakers will form an agenda
          according to users questions in Discord.
        </Trans>
      </AgendaStylesText>

      <AgendaStylesButton
        style="primary"
        type="button"
        href="https://discord.com/invite/WEpqA7DPDN"
        target="_blank"
      >
        <Trans id="k61MGCL9i89p9eSPzKZvac-events">Private Discord group</Trans>
      </AgendaStylesButton>

      {showInfo && (
        <>
          <AgendaStylesDate>
            <Trans id="hm2DXFJFEv5odqUbANPHtj-events">
              WEDNESDAY, SEPTEMBER.7
            </Trans>
          </AgendaStylesDate>

          <AgendaStylesList>
            {agendaData.map((item: any, index: number) => (
              <AgendaItem key={index} data={{ ...item }} />
            ))}
          </AgendaStylesList>
        </>
      )}
    </AgendaStylesContainer>
  );
};

export default EventAgendaSection;
