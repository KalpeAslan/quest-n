import { FC, useRef } from "react";
import { IQuestShort } from "../../models";
import { Wrapper } from "./featuredItems.styles";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { Icon } from "@/components/UI/icon";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { sendAnalyticsDataThunk } from "@/store/slices/analytics/analytics.thunks";
import FeaturedItem from "../FeaturedItem/FeaturedItem";

interface Props {
  projects: IQuestShort[];
  className?: string;
}

const FeaturedItems: FC<Props> = ({ projects, className }) => {
  const slider = useRef(null);
  const { push } = useRouter();
  const dispatch = useAppDispatch();

  return (
    <Wrapper component="section" count={projects.length} className={className}>
      {projects.length === 1 && <FeaturedItem quest={projects[0]} />}

      {projects.length > 1 && (
        <Splide
          ref={slider}
          onClick={(_, Slide, e) => {
            if (
              // @ts-ignore
              e.target.id === "partnerTitle" ||
              // @ts-ignore
              e.target.id === "partnerImage"
            )
              return;

            const index =
              Slide.index + 1 > projects.length
                ? Slide.index - projects.length
                : Slide.index;

            const project = projects[index];

            dispatch(
              sendAnalyticsDataThunk({
                type: "quest_tap",
                options: {
                  event_property_quest_name: project.title,
                  event_property_quest_position: index,
                },
              }),
            );

            push(`/quest/${project.linkTitle}`);
          }}
          options={{
            perPage: 1,
            perMove: 1,
            rewind: false,
            rewindByDrag: true,
            pagination: true,
            autoplay: true,
            type: "loop",
            interval: 5000,
            mediaQuery: "min",
            trimSpace: false,
            dragMinThreshold: {
              mouse: 2,
              touch: 4,
            },
            flickPower: 300,
            breakpoints: {
              768: {
                gap: 12,
                perPage: 2,
                autoplay: false,
              },
              1024: {
                perPage: 4,
                autoplay: false,
              },
            },
          }}
          tag="section"
          hasTrack={false}
        >
          <div className="list">
            <SplideTrack>
              {projects.map(item => (
                <SplideSlide key={item.id}>
                  <FeaturedItem quest={item} />
                </SplideSlide>
              ))}
            </SplideTrack>

            <div className={classNames("nav", "splide__arrows")}>
              <button
                className={classNames(
                  "btn",
                  "splide__arrow splide__arrow--prev",
                )}
              >
                <Icon
                  size="26"
                  name="arrow-straight"
                  style={{
                    transformOrigin: "center",
                    transform: "rotate(-90deg)",
                  }}
                />
              </button>

              <button
                className={classNames(
                  "btn",
                  "splide__arrow splide__arrow--next",
                )}
              >
                <Icon
                  size="26"
                  name="arrow-straight"
                  style={{
                    transformOrigin: "center",
                    transform: "rotate(90deg)",
                  }}
                />
              </button>
            </div>
          </div>
        </Splide>
      )}
    </Wrapper>
  );
};

export default FeaturedItems;
