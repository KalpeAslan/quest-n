import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";

import { IPostItem } from "@models";
import { Icon } from "@components/UI/icon";

import { Item } from "./item";

// import st from "./highlights.module.css";
import {
  HighlightsStylesSlider,
  HighlightsStylesWrapper,
} from "./highlights.styles";

type Props = {
  data: IPostItem[];
};

export const HighlightsSection = ({ data }: Props) => {
  return (
    <>
      <HighlightsStylesSlider>
        {data.length > 0 && (
          <Splide
            className={"slider-wrapper"}
            options={{
              rewind: false,
              fixedWidth: "280px",
              gap: 12,
              pagination: false,
              trimSpace: false,
              mediaQuery: "min",
              perPage: 1,
              perMove: 1,
              flickPower: 300,
            }}
            tag="section"
            hasTrack={false}
          >
            <div className={"list"}>
              <SplideTrack>
                {data.map((data: IPostItem) => (
                  <SplideSlide key={data.postId}>
                    <Item data={data} />
                  </SplideSlide>
                ))}
              </SplideTrack>

              <div className={"nav splide__arrows"}>
                <button className={"btn splide__arrow splide__arrow--prev"}>
                  <Icon
                    size="24"
                    name="arrow-straight"
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </button>

                <button className={"btn splide__arrow splide__arrow--next"}>
                  <Icon
                    size="24"
                    name="arrow-straight"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </button>
              </div>
            </div>
          </Splide>
        )}
      </HighlightsStylesSlider>

      <HighlightsStylesWrapper component="section" mx={{ xs: 0, sm: 0 }}>
        {data.length > 0 &&
          data.map((item: IPostItem) => <Item key={item.postId} data={item} />)}
      </HighlightsStylesWrapper>
    </>
  );
};
