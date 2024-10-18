import { useRef, useState } from "react";
import classnames from "classnames";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";

import { Icon } from "@components/UI/icon";
import { IAboutDataItem } from "@/modules/aboutUs/models";

import { Item } from "./item";
import { SliderWrapper } from "./slider.styles";

type Props = {
  data: IAboutDataItem[];
};

const Slider = ({ data }: Props) => {
  const slider = useRef(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  return (
    <SliderWrapper>
      <Splide
        ref={slider}
        options={{
          perPage: 1,
          perMove: 1,
          rewind: true,
          rewindByDrag: true,
          pagination: false,
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
        onMoved={(slide, index) => {
          setCurrentIndex(index);
        }}
      >
        <div className="list">
          <SplideTrack>
            {data.map((item: IAboutDataItem) => (
              <SplideSlide key={item.id}>
                <Item
                  title={item.title}
                  description={item.description}
                  image={item.image}
                />
              </SplideSlide>
            ))}
          </SplideTrack>

          <div className={classnames("nav", "splide__arrows")}>
            <button
              className={classnames("btn", "splide__arrow splide__arrow--prev")}
              style={{ transform: "rotate(90deg)" }}
            >
              <Icon size="16" name="menu-select" />
            </button>

            <button
              className={classnames("btn", "splide__arrow splide__arrow--next")}
              style={{ transform: "rotate(-90deg)" }}
            >
              <Icon size="24" name="menu-select" />
            </button>
          </div>

          <ul className={classnames("pagination", "splide__pagination")}>
            {data.map((item, id) => (
              <li
                className={classnames(
                  "pagination-item",
                  id === currentIndex ? "active" : "",
                )}
                key={id}
                style={{ width: `${100 / data.length - 4}%` }}
                onClick={() => (slider as any).current.go(id)}
              />
            ))}
          </ul>
        </div>
      </Splide>
    </SliderWrapper>
  );
};

export default Slider;
