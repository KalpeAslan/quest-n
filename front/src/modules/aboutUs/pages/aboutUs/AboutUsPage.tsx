import { Box } from "@mui/system";
import { t, Trans } from "@lingui/macro";
import Head from "next/head";

import { p4a, poa } from "@/modules/aboutUs/assets";

import { IAboutDataItem, IAboutPointItem } from "@/modules/aboutUs/models";
import { Picker } from "@/modules/aboutUs/components/picker";
import { Points } from "@/modules/aboutUs/components/points";
import { Slider } from "@/modules/aboutUs/components/slider";
import { AboutUsPageWrapper } from "./aboutUsPage.styles";

const AboutUsPage = () => {
  const aboutPointsData: IAboutPointItem[] = [
    {
      id: 1,
      icon: "menu-community",
      title: t({
        id: "ifaaXdEUN1ihaNrYv5oL6U-aboutUs",
        message: "Community & social hub",
      }),
      description: t({
        id: "mefCpav9QvUtpS7ALS4EFU-aboutUs",
        message:
          "Join like-minded investors, entrepreneurs, creators, and crypto enthusiasts all over the world. Our hub is meant to possess the most valuable info about the crypto and NFT industry, as well as closed groups, webinars, meetups, and many more.",
      }),
      soon: false,
      list: [],
    },
    {
      id: 2,
      icon: "menu-knowledge",
      title: t({
        id: "qVr1GHJtvqmAjaidPLyeNc-aboutUs",
        message: "AlphaAcademy",
      }),
      description: t({
        id: "dG4y6fY2XKPYzDaH1DvpFK-aboutUs",
        message:
          "Get private access to our unique knowledge base, with tips and insights from crypto industry leaders and the most acknowledged influencers on WEB 3.0. Hundreds of hours of video content, and thousands of scholarly articles about how crypto works, and how can you conquer the market.",
      }),
      soon: false,
      list: [],
    },
    {
      id: 3,
      icon: "menu-loyalty",
      title: t({
        id: "ehVUs3Q485jrKRw7wBH8qs-aboutUs",
        message: "AlphaQuest  Program",
      }),
      description: t({
        id: "vLCLZK1kwAURHt9ZfS1dhW-aboutUs",
        message:
          "AlphaQuest is a core feature of our community & social hub. This unique mechanic allows AlphaGuilty users to become a real part of our product. Each user can help our ecosystem grow better, stronger, and improve each day, increasing our mutual value and the value of all our projects",
      }),
      soon: false,
      list: [],
    },
    {
      id: 4,
      icon: "menu-calendar",
      title: t({
        id: "3AtEaKAPnNDm5oKCfHfXtD-aboutUs",
        message: "AlphaReminder",
      }),
      description: t({
        id: "8ZuBoifah4J85ogxwJR745-aboutUs",
        message:
          "Never miss upcoming presales, events, meetups, and webinars, which happen all over the space almost every day. Our sophisticated AlphaReminder tool will help to stay up to date with all crypto events around the globe.",
      }),
      soon: true,
      list: [],
    },
    {
      id: 5,
      icon: "menu-launchpad",
      title: t({
        id: "1m5WdPw6nX3aE6MMmtYBi7-aboutUs",
        message: "Multi packages of pre-sales",
      }),
      description: t({
        id: "vqG8Xa3bGNxSknuL6G56DB-aboutUs",
        message:
          "Join our multi-launches of complementary projects. Get access to even more allocation and obtain multi-asset packages with additional benefits.",
      }),
      soon: true,
      list: [],
    },
    {
      id: 6,
      icon: "menu-staking",
      title: t({ id: "3a9MN1TGvtFsPkwcqdY7ZS-aboutUs", message: "Staking" }),
      description: t({
        id: "4T2haou2GzWqe8SYAQjhV1-aboutUs",
        message:
          "Earn extra access to our limited sales by stacking your $ALPHAG. The more you stake, the higher allocation you get.",
      }),
      soon: true,
      list: [],
    },
    {
      id: 7,
      icon: "menu-marketplace",
      title: t({
        id: "3wzkeoJ1NUbP1beTBwLLNS-aboutUs",
        message: "Marketplace",
      }),
      description: t({
        id: "gpyUsrZJc3keF9X93Qde2o-aboutUs",
        message:
          "We are developing a robust and community-driven cross-chain marketplace to boost our primary and secondary markets. Trading virtual assets have never been so easy.",
      }),
      soon: true,
      list: [],
    },
    {
      id: 8,
      icon: "menu-dashboard",
      title: t({
        id: "4FGShqPjYwKrjVUTawFK82-aboutUs",
        message: "Data-driven analytics",
      }),
      description: t({
        id: "7SFr1PF3N9ovfemiLUzBQF-aboutUs",
        message:
          "Our high-scaled analytic algorithms evaluate tons of data, generating customs reports, such as:",
      }),
      soon: true,
      list: [
        t({
          id: "cSHN7PRLKRH3kx92Tyn1WD-aboutUs",
          message: "Projects vitality rate",
        }),
        t({ id: "iNcSYG5ojbEExZs4nteQkn-aboutUs", message: "Community score" }),
        t({ id: "thGR2CZe8vEQ2t3ED3kYas-aboutUs", message: "Influence rate" }),
        t({ id: "5CDH3K2H1sjJ1kCpfB6rzg-aboutUs", message: "Scam score" }),
      ],
    },
  ];

  const aboutData: IAboutDataItem[] = [
    {
      id: 1,
      icon: "web",
      title: t({
        id: "4hQAzkK3KbzrrBACsw4257-aboutUs",
        message: "Pay for Allocation (P4A)",
      }),
      description: t({
        id: "vEc1dwKcCyMm3WqquQqvBZ-aboutUs",
        message:
          "Simply stake enough of $ALPHAG tokens to get into an investment tier. The more tokens the higher the tier, the higher the allocation you get.",
      }),
      image: p4a,
    },
    {
      id: 2,
      icon: "web",
      title: t({
        id: "vvBeMwyQm97G8P4kaZPCdC-aboutUs",
        message: "Proof of Allocation (PoA)",
      }),
      description: t({
        id: "35H4Djdtk2dTBn1BLhoi2P-aboutUs",
        message:
          "A place in a leaderboard of 1000 participants who are able to participle in project launches. The leaderboard gets fixed before the sale, based on simple descending order of tokens staked. Those who made it there, participates in the sales.",
      }),
      image: poa,
    },
  ];

  return (
    <>
      <Head>
        <title>About us</title>
        <link rel="canonical" href="/about-us" />
      </Head>

      <AboutUsPageWrapper className="c-wrap">
        <Box className="header" mb={{ xs: 5, sm: 7.5, md: 5 }}>
          <Box
            component="h2"
            className="c-font-32-38 c-md-font-48-56 c-fw-500 c-text-center c-font-color"
            mt={{ xs: 5, sm: 7.5 }}
            mb={2.5}
          >
            <Trans id="eT28xcptcxdTCaWHU4mcsU-aboutUs">
              Meet the multi-chain P4A launcher
            </Trans>
          </Box>

          <p className="c-font-16-22 c-sm-font-20-28 c-fw-400 c-text-center c-font-color-6">
            <Trans id="gC36Xc9dvAnVEBR5EiW7mS-aboutUs">
              We created absolutely new P4A model, which allows users to
              participate in sales without giveaways, lotteries or just dumb
              luck.
            </Trans>
          </p>
        </Box>

        <Box mb={7.5}>
          <Picker data={aboutData} />

          <Slider data={aboutData} />
        </Box>

        <Box mb={5}>
          <Points data={aboutPointsData} />
        </Box>
      </AboutUsPageWrapper>
    </>
  );
};

export default AboutUsPage;
