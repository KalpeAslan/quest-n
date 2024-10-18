import classnames from "classnames";
import { Box } from "@mui/material";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { IPartner } from "@models";

import { useEffect, useState } from "react";
import { PartnersWrapper } from "./partners.styles";

export type PartnersProps = {
  partners: IPartner[];
};

const Partners = ({ partners }: PartnersProps) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <PartnersWrapper className="c-wrap" pr={{ xs: 0, sm: 3, xl: 6.87 }}>
      <Box
        className="c-font-20-24 c-sm-font-32-38 c-fw-500 c-font-color"
        component="h3"
        mb={2}
      >
        <Trans id="fTs2XNcZ9YoaEpjkKjijvS-ecosystem">Our Partners</Trans>
      </Box>

      {isMounted && partners.length > 0 && (
        <Splide
          className="slider-wrapper"
          options={{
            rewind: false,
            fixedWidth: "266px",
            gap: 12,
            pagination: false,
            trimSpace: false,
            mediaQuery: "min",
            perPage: 1,
            perMove: 1,
            flickPower: 300,
            breakpoints: {
              768: {
                fixedWidth: "",
                perPage: 3,
                perMove: 3,
              },
              910: {
                perPage: 4,
                perMove: 4,
              },
            },
          }}
          tag="section"
          hasTrack={false}
        >
          <div className="list">
            <SplideTrack>
              {partners.map(
                ({ id, image, title, description, link }: IPartner) => (
                  <SplideSlide key={id}>
                    <a
                      className={classnames("partner", "c-text-no-decoration")}
                      rel="noreferrer"
                      target="_blank"
                      href={link}
                    >
                      <div className="partner-logo-wrap">
                        <div
                          className="partner-logo"
                          style={{ backgroundImage: `url(${image})` }}
                        />
                      </div>

                      <Box
                        className={classnames(
                          "title",
                          "c-font-16-22 c-font-bold c-text-center",
                        )}
                        mt={2.5}
                      >
                        {title}
                      </Box>

                      <div
                        className={classnames(
                          "subtitle",
                          "c-font-14-19 c-text-center",
                        )}
                      >
                        {description}
                      </div>
                    </a>
                  </SplideSlide>
                ),
              )}
            </SplideTrack>

            <div className={classnames("nav", "splide__arrows")}>
              <button
                className={classnames(
                  "btn",
                  "splide__arrow splide__arrow--prev",
                )}
              >
                <Icon
                  size="24"
                  name="arrow-straight"
                  style={{ transform: "rotate(-90deg)" }}
                />
              </button>

              <button
                className={classnames(
                  "btn",
                  "splide__arrow splide__arrow--next",
                )}
              >
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
    </PartnersWrapper>
  );
};

export default Partners;
