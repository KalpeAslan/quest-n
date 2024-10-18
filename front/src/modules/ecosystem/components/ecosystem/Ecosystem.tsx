import classnames from "classnames";
import { Box } from "@mui/material";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import { t, Trans } from "@lingui/macro";

import { Icon } from "@components/UI/icon";
import { IEcosystemItem } from "@/modules/ecosystem/models";

import { Item } from "./components/item";
import { EcosystemWrapper } from "./ecosystem.styles";
import { ELinks } from "@/models";

const Ecosystem = () => {
  const EcosystemData: IEcosystemItem[] = [
    {
      id: 2,
      title: t({
        id: "jNiJUzXwYRotfoA48KNPyX-ecosystem",
        message: "AlphaAcademy",
      }),
      description: t({
        id: "6v7HAcWSgiYt3dcsdFk4jj-ecosystem",
        message:
          "Improve your knowledge about WEB 3.0 and get valuable insights from top experts",
      }),
      status: "active",
      statusText: "",
      path: "/blog",
      type: "self",
      icon: "ecosystem-loyalty",
      background: "linear-gradient(262.99deg, #AAC9F8 6.1%, #90E7F3 94.21%)",
    },
    {
      id: 3,
      title: t({
        id: "6e2CMgF1QEMXyGr9pkdBf4-ecosystem",
        message: "AlphaQuest",
      }),
      description: t({
        id: "9Cq5naJvv4cwimfbtNR5Xt-ecosystem",
        message:
          "Earn crypto, allocations, gifts with our next-level gamification tools",
      }),
      status: "active",
      statusText: "",
      path: "/quest",
      type: "self",
      icon: "ecosystem-accelerator",
      background: "linear-gradient(260.64deg, #BEFA9A 4.76%, #A9C9F8 90.61%)",
    },
    {
      id: 4,
      title: t({
        id: "ktpeaDSuce5DTTQqonsMQW-ecosystem",
        message: "AlphaLabs",
      }),
      description: t({
        id: "uuvmkQsrMwuqvhiWGWjWMP-ecosystem",
        message:
          "White-label services to create blockchain startup or presale from scratch",
      }),
      status: "active",
      statusText: "",
      path: ELinks.getInTouch,
      type: "redirect",
      icon: "ecosystem-accelerator",
      background: "linear-gradient(275.42deg, #FFF8BD 3.74%, #BEF99D 95.08%)",
      wide: true,
    },
    {
      id: 5,
      title: t({
        id: "pMZs5EdNywvMBN1ivq7pGg-ecosystem",
        message: "AlphaReferrals",
      }),
      description: t({
        id: "tdiJaSrCLWFHHDFGCzQVaM-ecosystem",
        message:
          "Earn more from crypto by inviting friends to our presales. The more they deposit, the more you earn.",
      }),
      status: "active",
      statusText: "",
      path: "/referral",
      type: "self",
      icon: "ecosystem-referrals",
      background: "linear-gradient(259.12deg, #A6FFEF 8.06%, #FFF8BD 91.94%)",
      wide: true,
    },
  ];

  return (
    <EcosystemWrapper
      className="c-wrap"
      mb={{ xs: 6, sm: 10 }}
      pr={{ xs: 0, sm: 3, xl: 6.87 }}
    >
      <Box
        className="c-font-20-24 c-sm-font-32-38 c-fw-500 c-font-color title"
        component="h3"
        mb={{ xs: 2, sm: 3 }}
      >
        <Trans id="mygjLZDt5nBpQgYKkqq8gJ-ecosystem">
          AlphaGuilty offers crypto gaining ecosystem
        </Trans>
      </Box>

      <section className="slider">
        {EcosystemData.length > 0 && (
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
                1125: {
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
                {EcosystemData.map((data: IEcosystemItem) => (
                  <SplideSlide key={data.id}>
                    <Item data={data} classname={`item-${data.id}`} />
                  </SplideSlide>
                ))}
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
      </section>

      <section className={"items"}>
        {EcosystemData.map((data: IEcosystemItem) => (
          <Item key={data.id} data={data} classname={`item-${data.id}`} />
        ))}
      </section>
    </EcosystemWrapper>
  );
};

export default Ecosystem;
