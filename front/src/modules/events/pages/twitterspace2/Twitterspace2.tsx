import { useEffect } from "react";
import { useContextSelector } from "use-context-selector";
import { Box } from "@mui/system";

import heroImage from "@assets/images/global-event/bear-2.webp";

import mishaSitalo from "@assets/images/global-event/speakers/misha-sitalo-alpha-guilty.webp";
import ethanFrancis from "@assets/images/global-event/speakers/ethan-francis-chainstack.webp";
import usmanAsim from "@assets/images/global-event/speakers/usman-asim-chainstack.webp";
import nickSanschagrin from "@assets/images/global-event/speakers/nick-sanschagrin-chainstack.webp";
import fyceeTelos from "@assets/images/global-event/speakers/fycee-telos.webp";

import alphaguilty from "@assets/images/global-event/companys-logo/alphaguilty.webp";
import chainstack from "@assets/images/global-event/companys-logo/сhainstack.webp";
import telos from "@assets/images/global-event/companys-logo/telos.webp";

import { EventHeroSection } from "@components/events/hero";
import { EventAccessSection } from "@components/events/access";
import { EventLinkSection } from "@components/events/link";
import { EventSpeakersSection } from "@components/events/speakers";
import { EventAgendaSection } from "@components/events/agenda";
import { AppContext } from "@context";
import { useRouter } from "next/router";
import { ApplySection } from "@/modules/ecosystem/components/applySection";
import { Wrapper } from "../../online-event.styles";
import { t } from "@lingui/macro";
import { Speaker } from "@/models";

const TwitterSpace2EventPage = () => {
  const twitter2EventSpeakersData: Speaker[] = [
    {
      image: ethanFrancis,
      name: t({
        id: "7KquU6WbTbeb4XBk9fdPkX-OnlineEvent",
        message: "Ethan Francis",
      }),
      position: t({
        id: "wj8A4XJFgHzz2sJqdzbqLy-OnlineEvent",
        message: "Developer Relations",
      }),
      project: {
        name: t({
          id: "jEQRc5pi9GzShkQyx2GHvX-OnlineEvent",
          message: "Chainstack",
        }),
        link: "https://chainstack.com/",
        logo: chainstack,
      },
      socLinks: { twitter: "https://twitter.com/TABASCOweb3" },
    },
    {
      image: usmanAsim,
      name: t({
        id: "hV6JekSt7ExZCB2qhw38sP-OnlineEvent",
        message: "Usman Asim",
      }),
      position: t({
        id: "eNDftWN3CcRgdXrDbWFxXN-OnlineEvent",
        message: "Developer Relations - Head of Avalanche Ecosystem",
      }),
      project: {
        name: t({
          id: "upmPa6YphbegBs73qtzFTb-OnlineEvent",
          message: "Chainstack",
        }),
        link: "https://chainstack.com/",
        logo: chainstack,
      },
      socLinks: { twitter: "https://twitter.com/asimfiles" },
    },
    {
      image: nickSanschagrin,
      name: t({
        id: "jNtPfdfpaBGxzDndkFQDmK-OnlineEvent",
        message: "Nick Sanschagrin",
      }),
      position: t({
        id: "qaoYdfcFirz3j2nRDTRz1n-OnlineEvent",
        message: "Growth",
      }),
      project: {
        name: t({
          id: "gZrgvvpjsFHkvxmJhkNoXE-OnlineEvent",
          message: "Chainstack",
        }),
        link: "https://chainstack.com/",
        logo: chainstack,
      },
      socLinks: { twitter: "https://twitter.com/NickSanschagrin" },
    },
    {
      image: mishaSitalo,
      name: t({
        id: "8YDPjJZVN2y6sqBEHqpguE-OnlineEvent",
        message: "Mikhail Sitalo",
      }),
      position: t({
        id: "jTvDkcCjizYqLtMbXKPP2U-OnlineEvent",
        message: "CEO AlphaGuilty",
      }),
      project: {
        name: t({
          id: "eL91BxCp2uXvEW3xtK4xPC-OnlineEvent",
          message: "Alphaguilty",
        }),
        link: "https://alphaguilty.io/",
        logo: alphaguilty,
      },
      socLinks: {
        linkedin: "https://www.linkedin.com/in/michaelsitalo/",
        twitter: "https://twitter.com/sitalomcap",
      },
    },
    {
      image: fyceeTelos,
      name: t({ id: "grDm2wbomatLeZmAHEo3Rd-OnlineEvent", message: "Fycee" }),
      position: t({
        id: "fHtQAATzT3gxr9xW3mmZf6-OnlineEvent",
        message: "Telos Ambassador",
      }),
      project: {
        name: t({ id: "pFmgVfSowuBkvkUNseWHCW-OnlineEvent", message: "Telos" }),
        link: "https://www.telos.net/",
        logo: telos,
      },
      socLinks: { twitter: "https://twitter.com/EironFycee" },
    },
  ];

  const { pathname } = useRouter();
  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  useEffect(() => {
    return () => {
      if (prevLocation) {
        prevLocation.current = pathname;
      }
    };
  }, []);

  return (
    <>
      <div className="background-other">
        <Wrapper className="c-wrap">
          <EventHeroSection
            maxCount={350}
            startCountDate="2022-12-11"
            endCountDate="2023-01-06"
            heroImage={heroImage}
            title={t({
              id: "17PWM72hKd9G5CnTbfK2Vt-events",
              message: "Crypto trends",
            })}
            subTitle={t({
              id: "7qKLocs5nfPZNG6BCwzGAN-events",
              message: "to follow in 2023",
            })}
            text={t({
              id: "oTC3THvGY5YdyPk9aNEQk9-events",
              message: "AlphaGuilty twitter space with KOL's",
            })}
            buttonName={t({
              id: "v9A8ShsgC8LVizGHy1Z6ym-events",
              message: "Participate in Twitter Space",
            })}
            buttonLink="https://go.alphaguilty.io/dec-conf-form"
          />

          <div className="wrapper">
            <Box mb={{ md: 10 }}>
              <EventAccessSection
                text={t({
                  id: "eSjdZ4qqy9aXHUewAsbEsx-events",
                  message:
                    "All twitter space participants can earn AlphaQuest tokens for social activity. All details in the link below.",
                })}
                buttonName={t({
                  id: "tJTZUoKaBZfvN5ZqFuHeLg-events",
                  message: "AlphaQuest",
                })}
                buttonLink="https://alphaguilty.io/quest/alphaguilty"
              />
            </Box>

            <Box mb={{ md: 10 }}>
              <EventLinkSection
                title={t({
                  id: "uCv3vbGLoeDM69y4AGtnWB-events",
                  message: "Twitter space online meetup",
                })}
                buttonName={t({
                  id: "8chE3euaXUjaWFgU34FNmV-events",
                  message: "Listen now",
                })}
                buttonLink="https://twitter.com/i/spaces/1PlJQpoWqgYGE"
                activeDate="2023-01-06T16:00"
                disabledDate="2023-01-06T17:30"
              />
            </Box>

            <Box mx={{ md: 7.12 }} mb={{ xs: 8.5, md: 13.5 }}>
              <EventSpeakersSection speakersData={twitter2EventSpeakersData} />
            </Box>

            <EventAgendaSection showInfo={false} />
          </div>

          <ApplySection />
        </Wrapper>
      </div>
    </>
  );
};

export default TwitterSpace2EventPage;
