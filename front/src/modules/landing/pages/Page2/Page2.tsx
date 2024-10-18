import { Box } from "@mui/material";
import { Wrapper } from "./page2.styles";
import { Button } from "@/components/UI/button";
import { useRouter } from "next/router";
import Image, { StaticImageData } from "next/image";
import {
  benefits1,
  benefits2,
  benefits3,
  benefits4,
  benefits5,
  benefits6,
  benefits7,
  page2ImageDesktop,
  page2ImageMobile,
} from "../../assets";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { BenefitsItem } from "../../components/BenefitsItem";
import { Trans, t } from "@lingui/macro";

export interface IBenefit {
  id: number;
  image: StaticImageData;
  title: string;
  description: string;
}

const Page2 = () => {
  const router = useRouter();

  const benefitsData: IBenefit[] = [
    {
      id: 1,
      image: benefits1,
      title: t({
        id: "s5Y5i4KQmgHKB4fVcENyo4-landing",
        message: "Earn crypto",
      }),
      description: t({
        id: "xqznaA3LNS4hD9rHuaxaiM-landing",
        message: "Collect rewards after completing simple tasks",
      }),
    },
    {
      id: 2,
      image: benefits2,
      title: t({
        id: "9x5RKnfuSgBkcgfP95WTEU-landing",
        message: "Win AG Tokens",
      }),
      description: t({
        id: "9goD7GiXU8HKQyphe7uN84-landing",
        message: "Collect unique tokens from the platform AlphaQuilty",
      }),
    },
    {
      id: 3,
      image: benefits3,
      title: t({
        id: "jEfkhCJ2aaP41XDj47Hn7b-landing",
        message: "Collect NFT",
      }),
      description: t({
        id: "6PWXTHZ4a8sy1frjR5YDcb-landing",
        message: "Collect cool unique NFTs, be the first",
      }),
    },
    {
      id: 4,
      image: benefits4,
      title: t({
        id: "hTHDJKJNVhD5kBipBUfj2i-landing",
        message: "Join to exclusive Whitelist",
      }),
      description: t({
        id: "dx9cu3WPwJFhHtbqzQQK3h-landing",
        message: "Get access to exclusive whitelists",
      }),
    },
    {
      id: 5,
      image: benefits5,
      title: t({
        id: "edVJSvRZpZprHxtNfFE79P-landing",
        message: "Take Discord roles",
      }),
      description: t({
        id: "5cGPFfZrY5s26bnddta4oe-landing",
        message:
          "Monetize your social activity and turn it into tokens, prizes, special whitelists",
      }),
    },
    {
      id: 6,
      image: benefits6,
      title: t({
        id: "kthMzd1n7tGjpXsJP9CpoM-landing",
        message: "Join to the strong crypto-communities",
      }),
      description: t({
        id: "27UFmDNjVJRjhknZnhTc7e-landing",
        message:
          "Find strong crypto-communities and become a part of them try yourself as an ambassador!",
      }),
    },
    {
      id: 7,
      image: benefits7,
      title: t({
        id: "fZSWCL5jzUvqHUA88Ph8Xi-landing",
        message: "Find a new GEMs in crypto-world!",
      }),
      description: t({
        id: "82tBDFbmf162uicwnkRC3c-landing",
        message:
          "Find a new and cool project first! be the first adopter, get access to exclusive projects at a very early stage!",
      }),
    },
  ];

  return (
    <div className="background-other">
      <Wrapper>
        <Box className="topWrapper c-wrap">
          <Box>
            <Box
              component="h1"
              className="c-font-32-36 c-fw-500 c-font-color c-md-font-54-58 title"
            >
              <Trans id="mAAu917VvjTmqsxL67q1kd-landing">
                <span className="c-font-color-3">
                  Earn crypto by completing tasks
                </span>{" "}
                and using your social activity
              </Trans>
            </Box>

            <Box
              component="p"
              className="c-font-22-25 c-fw-500 c-font-color c-md-font-32-38 subTitle"
            >
              <Trans id="vAieW1awGwQ4u1GtYx9VVg-landing">
                Register to start multiplying your earnings
              </Trans>
            </Box>

            <Button
              style="colorfull"
              className="button c-fw-500 c-font-20-22"
              onClick={() => router.push("/sign-up")}
            >
              <Trans id="3LfRbQSj7fuS83KUNV2bZD-landing">Start earning</Trans>
            </Button>
          </Box>

          <Box className="imageWrapper">
            <Image
              src={page2ImageMobile}
              alt={t({
                id: "6ui2qMUz9Q5K6m3oiisq47-landing",
                message: "Quests",
              })}
              className="imageMobile"
            />
            <Image
              src={page2ImageDesktop}
              alt={t({
                id: "tJB5nfC4rzo9bLB2kctitk-landing",
                message: "Quests",
              })}
              className="imageDesktop"
            />
          </Box>
        </Box>

        <Box className="c-font-color c-wrap c-font-30-38 c-fw-500 benefitsTitle">
          <Trans id="2R7ZqQjoFjU57UhZuVkbdz-landing">Benefits</Trans>
        </Box>

        <section className="slider">
          <Splide
            className="slider-wrapper"
            options={{
              type: "loop",
              autoplay: true,
              interval: 4000,
              speed: 4000,
              easing: "linear",
              rewind: false,
              fixedWidth: "290px",
              gap: 15,
              pagination: false,
              trimSpace: true,
              mediaQuery: "min",
              perMove: 1,
              flickPower: 300,
              padding: { left: 16, right: 16 },
              breakpoints: {
                1024: {
                  fixedWidth: "440px",
                  padding: { left: 24, right: 24 },
                },
                1440: {
                  padding: {
                    left: "calc(((100% - 1180px) / 2) + 55px)",
                    right: "calc(((100% - 1180px) / 2) + 55px)",
                  },
                },
              },
            }}
            tag="section"
            hasTrack={false}
          >
            <div className="list">
              <SplideTrack>
                {benefitsData.map((data: IBenefit) => (
                  <SplideSlide key={data.id}>
                    <BenefitsItem data={data} />
                  </SplideSlide>
                ))}
              </SplideTrack>
            </div>
          </Splide>
        </section>
      </Wrapper>
    </div>
  );
};

export default Page2;
