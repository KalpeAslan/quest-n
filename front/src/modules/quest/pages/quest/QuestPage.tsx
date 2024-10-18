import { Wrapper } from "./quest.styles";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getIsOnboardingTaskDone } from "@/store/slices/system/system.selector";
import { IQuestShort } from "../../models";
import { FeaturedItems } from "../../components/featuredItems";
import { TrendingItems } from "../../components/trendingItems";
import { useCallback, useEffect, useState } from "react";
import { homeService, loyaltyService } from "@/api";
import { LoggerService } from "@/services";
import { PageLoader } from "@/components/pageLoader";
import { Advertisement } from "@/models";
import { AdvertisementsBlock } from "../../components/advertisementsBlock";

const QuestPage = () => {
  const isOnboardingTaskDone = useTypedSelector(getIsOnboardingTaskDone);

  const [featured, setFeatured] = useState<IQuestShort[]>([]);
  const [trending, setTrending] = useState<IQuestShort[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [featuredLoaded, setFeaturedLoaded] = useState<boolean>(false);
  const [trendingLoaded, setTrendingLoaded] = useState<boolean>(false);
  const [advertisementsLoaded, setAdvertisementsLoaded] =
    useState<boolean>(false);

  const getFeaturedItems = useCallback(async () => {
    try {
      const res = await loyaltyService.getLoyaltyProjectsData({
        featured: true,
        status: "active,participating,soon",
      });

      setFeatured(res.data.loyaltyProjects);
    } catch (error) {
      LoggerService.error("Error during quests response", error);
    } finally {
      setFeaturedLoaded(true);
    }
  }, []);

  const getTrendingItems = useCallback(async () => {
    try {
      const res = await loyaltyService.getLoyaltyProjectsData({
        trending: true,
      });

      setTrending(res.data.loyaltyProjects);
    } catch (error) {
      LoggerService.error("Error during quests response", error);
    } finally {
      setTrendingLoaded(true);
    }
  }, []);

  const getAdvertisements = useCallback(async () => {
    try {
      const { data: advertisementsData } =
        await homeService.getAdvertisements();

      setAdvertisements(advertisementsData);
    } catch (err: any) {
      LoggerService.error(
        "Error during getting advertisements on home page",
        err,
      );
    } finally {
      setAdvertisementsLoaded(true);
    }
  }, []);

  useEffect(() => {
    getFeaturedItems();
    getTrendingItems();
    getAdvertisements();
  }, [getFeaturedItems, getTrendingItems, getAdvertisements]);

  return (
    <div className="background-other">
      {featuredLoaded && trendingLoaded && advertisementsLoaded ? (
        <Wrapper
          className="c-wrap"
          component="section"
          isOnboardingTaskDone={isOnboardingTaskDone}
        >
          <AdvertisementsBlock items={advertisements} />

          <FeaturedItems projects={featured} />

          <TrendingItems projects={trending} />
        </Wrapper>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default QuestPage;
