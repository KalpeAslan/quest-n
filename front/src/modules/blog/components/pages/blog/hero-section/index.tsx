import { useRef } from "react";
import classnames from "classnames";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";

import { IPostItem } from "@models";
import { Icon } from "@components/UI/icon";

import { Item } from "./item";
import { Wrapper } from "./heroSection.styles";

type Props = {
  data: IPostItem[];
};

export const HeroSection = ({ data }: Props) => {
  const slider = useRef(null);

  return (
    <Wrapper component="section" mx={{ xs: -2, sm: 0 }}>
      {data.length === 1 && <Item data={data[0]} />}

      {data.length > 1 && (
        <Splide
          ref={slider}
          options={{
            perPage: 1,
            perMove: 1,
            rewind: true,
            rewindByDrag: true,
            pagination: true,
            autoplay: true,
            interval: 5000,
            trimSpace: false,
            dragMinThreshold: {
              mouse: 2,
              touch: 4,
            },
            flickPower: 300,
          }}
          tag="section"
          hasTrack={false}
        >
          <div className="list">
            <SplideTrack>
              {data.map(item => (
                <SplideSlide key={item.postId}>
                  <Item data={item} />
                </SplideSlide>
              ))}
            </SplideTrack>

            <div className={classnames("nav", "splide__arrows")}>
              <button
                className={classnames(
                  "btn",
                  "splide__arrow splide__arrow--prev",
                )}
                style={{ transform: "rotate(90deg)" }}
              >
                <Icon size="16" name="menu-select" />
              </button>

              <button
                className={classnames(
                  "btn",
                  "splide__arrow splide__arrow--next",
                )}
                style={{ transform: "rotate(-90deg)" }}
              >
                <Icon size="24" name="menu-select" />
              </button>
            </div>
          </div>
        </Splide>
      )}
    </Wrapper>
  );
};
