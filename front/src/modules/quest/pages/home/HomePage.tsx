import { Wrapper, MainContainer } from "./home.styles";
import { useCallback, useEffect, useState } from "react";
import { IQuestShort } from "../../models";
import { IPartner } from "@/models";
import { homeService, loyaltyService } from "@/api";
import { LoggerService } from "@/services";
import { PageLoader } from "@/components/pageLoader";
import { HeroSection } from "../../components/homeComponents/heroSection";
import { HowItWorks } from "../../components/homeComponents/howItWorks";
import { FeaturedSection } from "../../components/homeComponents/featuredSection";
import { CreateQuestSection } from "../../components/homeComponents/createQuestSection";
import { PartnersSection } from "../../components/homeComponents/partnersSection";
import { Box } from "@mui/material";
import { homeBgMobile } from "../../assets";
import Image from "next/image";
import { isMobile } from "react-device-detect";

const HomePage = () => {
  const [featured, setFeatured] = useState<IQuestShort[]>([]);
  const [partners, setPartners] = useState<IPartner[]>([]);

  const [featuredLoaded, setFeaturedLoaded] = useState<boolean>(false);
  const [partnersLoaded, setPartnersLoaded] = useState<boolean>(false);

  const getFeaturedItems = useCallback(async () => {
    try {
      const res = await loyaltyService.getLoyaltyProjectsData({
        featured: true,
        status: "active,participating,soon",
      });

      const res1 = await loyaltyService.getLoyaltyProjectsData({
        trending: true,
        status: "active,participating,soon",
      });

      setFeatured(
        Object.values(
          [...res.data.loyaltyProjects, ...res1.data.loyaltyProjects]
            .sort((a, b) => {
              const aUSDT = a.rewards.tokens.find(
                item => item.symbol.toLowerCase() === "usdt",
              );
              const bUSDT = b.rewards.tokens.find(
                item => item.symbol.toLowerCase() === "usdt",
              );

              if (aUSDT && bUSDT) {
                return Number(bUSDT.amount) - Number(aUSDT.amount);
              }
              if (aUSDT) {
                return -1;
              }
              if (bUSDT) {
                return 1;
              }

              const aSum = a.rewards.tokens.reduce(
                (acc, item) => acc + Number(item.amount),
                0,
              );
              const bSum = b.rewards.tokens.reduce(
                (acc, item) => acc + Number(item.amount),
                0,
              );

              return bSum - aSum;
            })
            .slice(0, 8)
            .reduce(
              (acc, item) => ({ ...acc, [item.id]: item }),
              {} as Record<number, IQuestShort>,
            ),
        ),
      );
    } catch (error) {
      LoggerService.error("Error during quests response", error);
    } finally {
      setFeaturedLoaded(true);
    }
  }, []);

  const getPartners = useCallback(async () => {
    try {
      const { data: partnersData } = await homeService.getHomePartnersData();

      setPartners(partnersData);
    } catch (err: any) {
      LoggerService.error("Error during getting projects on home page", err);
    } finally {
      setPartnersLoaded(true);
    }
  }, []);

  useEffect(() => {
    getFeaturedItems();
    getPartners();
  }, [getFeaturedItems, getPartners]);

  return (
    <MainContainer>
      {featuredLoaded && partnersLoaded ? (
        <Box overflow="hidden">
          <Wrapper className="c-wrap c-font-color">
            {!isMobile && (
              <video
                id="background-video1"
                autoPlay
                loop
                muted
                className="videoBg1 desktop"
              >
                <source src="/videos/homePageBg1.mp4" type="video/mp4" />
              </video>
            )}

            <Image
              src={homeBgMobile}
              alt="Home bg"
              className="videoBg1 mobile"
            />

            {/* <video
              id="background-video2"
              autoPlay
              loop
              muted
              className="videoBg2"
            >
              <source src="/videos/homePageBg3.mp4" type="video/mp4" />
            </video> */}

            {/* <video
              id="background-video3"
              autoPlay
              loop
              muted
              className="videoBg3"
            >
              <source src="/videos/homePageBg3.mp4" type="video/mp4" />
            </video> */}

            {/* <video
              id="background-video4"
              autoPlay
              loop
              muted
              className="videoBg4"
            >
              <source src="/videos/homePageBg4.mp4" type="video/mp4" />
            </video> */}

            <HeroSection />

            <HowItWorks />

            <FeaturedSection quests={featured} />

            <CreateQuestSection />

            <PartnersSection partners={partners} />
          </Wrapper>
        </Box>
      ) : (
        <PageLoader />
      )}
    </MainContainer>
  );
};

export default HomePage;
