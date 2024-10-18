import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";

import { Icon } from "@components/UI/icon";
import { Speaker } from "@models";

import { SpeakerItem } from "./components/speakerItem";
import { SpeakersStylesContainer } from "@components/events/speakers/speakers.styles";
import { Trans } from "@lingui/macro";

type Props = {
  speakersData: Speaker[];
};

const EventSpeakersSection = ({ speakersData }: Props) => {
  const slider = useRef(null);

  return (
    <SpeakersStylesContainer>
      <div className={"wrapper"}>
        <h2 className={"speakers-caption"}>
          <Trans id="b6YexoxDnyhM4ngpfF9s9t-speakers">Our speakers</Trans>
        </h2>

        {isMobile ? (
          <ul className={"speakers-list"}>
            {speakersData.map((item: Speaker, index: number) => (
              <SpeakerItem key={index} data={{ ...item }} />
            ))}
          </ul>
        ) : (
          <Splide
            ref={slider}
            options={{
              rewind: false,
              gap: 12,
              pagination: true,
              trimSpace: false,
              perPage: 3,
              perMove: 3,
              flickPower: 300,
            }}
            tag="section"
            hasTrack={false}
          >
            <div className={"list"}>
              <SplideTrack>
                {speakersData.map((data: any, id: number) => (
                  <SplideSlide key={id}>
                    <SpeakerItem data={{ ...data }} />
                  </SplideSlide>
                ))}
              </SplideTrack>

              <div className={"nav splide__arrows"}>
                <button
                  className={"btn splide__arrow splide__arrow--prev"}
                  style={{ transform: "rotate(90deg)" }}
                >
                  <Icon size="16" name="menu-select" />
                </button>

                <button
                  className={"btn splide__arrow splide__arrow--next"}
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <Icon size="24" name="menu-select" />
                </button>
              </div>
            </div>
          </Splide>
        )}
      </div>
    </SpeakersStylesContainer>
  );
};

export default EventSpeakersSection;
