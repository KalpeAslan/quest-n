import { useEffect } from "react";
import { useContextSelector } from "use-context-selector";
import { Box } from "@mui/system";

import heroImage from "@assets/images/global-event/hero.webp";

import mishaSitalo from "@assets/images/global-event/speakers/misha-sitalo-alpha-guilty.webp";
import lynnNguyen from "@assets/images/global-event/speakers/lynn-nguyen-roseon-world.webp";
import leonLee from "@assets/images/global-event/speakers/leon-lee-only1.webp";
import berkerZor from "@assets/images/global-event/speakers/berker-zor-babylons.webp";
import marielaTanchez from "@assets/images/global-event/speakers/mariela-tanchez-gate-io.webp";
import igorPlusa from "@assets/images/global-event/speakers/igor-plusa.webp";

import roseonWorld from "@assets/images/global-event/companys-logo/roseon-world.webp";
import only1 from "@assets/images/global-event/companys-logo/only1.webp";
import babylons from "@assets/images/global-event/companys-logo/babylons.webp";
import gateIo from "@assets/images/global-event/companys-logo/gate-io.webp";
import alphaguilty from "@assets/images/global-event/companys-logo/alphaguilty.webp";

import { EventHeroSection } from "@components/events/hero";
import { EventAccessSection } from "@components/events/access";
import { EventLinkSection } from "@components/events/link";
import { EventSpeakersSection } from "@components/events/speakers";
import { EventAgendaSection } from "@components/events/agenda";
import { Speaker } from "@models";
import { AppContext } from "@context";
import { useRouter } from "next/router";
import { ApplySection } from "@/modules/ecosystem/components/applySection";
import { Wrapper } from "../../online-event.styles";
import { t } from "@lingui/macro";

const OnlineEventPage = () => {
  const onlineEventSpeakersData: Speaker[] = [
    {
      image: lynnNguyen,
      name: t({
        id: "cBpxXdsmmRiqMcnCK1UQNX-OnlineEvent",
        message: "Lynn Nguyen",
      }),
      position: t({
        id: "4zMCv8DNZzxeUqtvpC1fUK-OnlineEvent",
        message: "Head of Partnerships",
      }),
      project: {
        name: t({
          id: "jiSBvVPW4yMAYMxp9peNCG-OnlineEvent",
          message: "Roseon World",
        }),
        link: "https://roseon.world/",
        logo: roseonWorld,
      },
      socLinks: {
        linkedin: "https://www.linkedin.com/in/lynnnguyen268/",
        twitter: "https://twitter.com/lynn_roseon",
      },
    },
    {
      image: mishaSitalo,
      name: t({
        id: "iLnh6e4GJEWTUMgHeBi8cJ-OnlineEvent",
        message: "Mikhail Sitalo",
      }),
      position: t({
        id: "3Gu7gZXnaksL9ZAGB7C6iq-OnlineEvent",
        message: "CEO AlphaGuilty",
      }),
      project: {
        name: t({
          id: "sekHus1BBeUPF3YaACPTMd-OnlineEvent",
          message: "AlphaGuilty",
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
      image: leonLee,
      name: t({
        id: "uNmRfLiLjm1F6X2Q7gu8mi-OnlineEvent",
        message: "Leon Lee",
      }),
      position: t({
        id: "c3HvSTHj3REFUTvhR4a8Wj-OnlineEvent",
        message: "Founder and CEO",
      }),
      project: {
        name: t({ id: "vECd25YffyywJtUzqRfWPs-OnlineEvent", message: "Only1" }),
        link: "https://only1.app",
        logo: only1,
      },
      socLinks: {
        linkedin: "https://www.linkedin.com/in/leon-lee-ba4822108/",
        twitter: "https://twitter.com/leon_only1",
      },
    },
    {
      image: berkerZor,
      name: t({
        id: "czWm3Mzj4wXfSHr18hynTq-OnlineEvent",
        message: "Berker Zor",
      }),
      position: t({
        id: "iegrVabgaVrqGfDm86W7mT-OnlineEvent",
        message: "Business Developer",
      }),
      project: {
        name: t({
          id: "di5v8J4u23vvzPEAmfKeGV-OnlineEvent",
          message: "Babylons",
        }),
        link: "https://babylons.io/",
        logo: babylons,
      },
      socLinks: {
        linkedin: "https://www.linkedin.com/in/berker-zor-59588b225/",
        twitter: "https://twitter.com/babylonsnft",
      },
    },
    {
      image: marielaTanchez,
      name: t({
        id: "nrKhPZks37wvFZADo7vbeR-OnlineEvent",
        message: "Mariela Tanchez",
      }),
      position: t({
        id: "1jvSWyaB1QzvrStkYvL3bN-OnlineEvent",
        message: "Global Head of Business Development",
      }),
      project: {
        name: t({
          id: "pe8XEdD2fCXzoCxAsHdL3S-OnlineEvent",
          message: "Gate.io",
        }),
        link: "https://www.gate.io/ru/nft",
        logo: gateIo,
      },
      socLinks: {
        linkedin: "https://www.linkedin.com/in/mariela-t%C3%A1nchez-3ba36554/",
        twitter: "https://twitter.com/mtanchezm",
      },
    },
    {
      image: igorPlusa,
      name: t({
        id: "v2BnWd5a8RaKbA5Sha6uxr-OnlineEvent",
        message: "Igor Płusa",
      }),
      position: t({
        id: "awH1jxgcBPvKfZKMCdKGAg-OnlineEvent",
        message: "Entrepreneur | Advisor | Digital Assets Investor",
      }),
      project: null,
      socLinks: {
        linkedin: "https://www.linkedin.com/in/igor-plusa-6b5250103/",
        twitter: "https://mobile.twitter.com/igor_gamelounge",
      },
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
            maxCount={623}
            startCountDate="2022-08-27"
            endCountDate="2022-09-07"
            heroImage={heroImage}
            title={t({
              id: "uhacGSrncCCCKdmHv1pP45-events",
              message: "DeFi investment",
            })}
            subTitle={t({
              id: "qNPkvoLtPvGMW4p3hVJzK2-events",
              message: "and Go-To-market strategies on a bear market",
            })}
            text={t({
              id: "shX4SCdncbMoU38f3rJnNK-events",
              message: "Online meetup of KOLs among launchpads",
            })}
            buttonName={t({
              id: "5779d5NVzRRLrESYNNxJxU-events",
              message: "Participate in online meetup",
            })}
            buttonLink="https://go.alphaguilty.io/defi_conf"
          />

          <div className="wrapper">
            <Box mb={{ md: 10 }}>
              <EventAccessSection
                text={t({
                  id: "8ScaTpyV1zGv3xryLuWgLa-events",
                  message:
                    "All conference participants will be granted access to our upcoming token sale. All the details will be announced in our Social Media.",
                })}
                buttonName={t({
                  id: "48Cb8LTZzshfwhPuMoZjkk-events",
                  message: "Private Discord group",
                })}
                buttonLink="https://discord.com/invite/WEpqA7DPDN"
              />
            </Box>

            <Box mb={{ md: 10 }}>
              <EventLinkSection
                title={t({
                  id: "56oWL4VUpDzAiNQwJLAaLk-events",
                  message: "Online Meetup Live Stream",
                })}
                buttonName={t({
                  id: "cR7ZbuK3X7qUvKw19ogzbT-events",
                  message: "Watch Now",
                })}
                buttonLink="https://go.alphaguilty.io/online-meetup-youtube"
                activeDate="2022-09-07"
                disabledDate="2022-09-08"
              />
            </Box>

            <Box mx={{ md: 7.12 }} mb={{ xs: 8.5, md: 13.5 }}>
              <EventSpeakersSection speakersData={onlineEventSpeakersData} />
            </Box>

            <EventAgendaSection showInfo={true} />
          </div>

          <ApplySection />
        </Wrapper>
      </div>
    </>
  );
};

export default OnlineEventPage;
