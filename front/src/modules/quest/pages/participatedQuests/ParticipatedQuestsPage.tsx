import { loyaltyService } from "@/api";
import { useCallback, useEffect, useState } from "react";
import {
  IQuestShort,
  LoyaltyProjectReward,
  LoyaltyProjectStatuses,
  LoyaltyProjectTrending,
} from "../../models";
import { LoggerService } from "@/services";
import { useRouter } from "next/router";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setIsAdminPanelOpened } from "@/store/slices/system/system.slice";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { PageLoader } from "@/components/pageLoader";
import { Wrapper } from "./participatedQuests.styles";
import { FeaturedItem } from "../../components/featuredItems/featuredItem";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import { ISelect } from "../../../../models/Select";
import { Trans, t } from "@lingui/macro";
import { Filter } from "../../components/filter";
import { usePrivateRouteRedirect } from "@/hooks/usePrivateRouteRedirect";

const ParticipatedQuestsPage = () => {
  const [participatedQuestsLoaded, setParticipatedQuestsLoaded] =
    useState<boolean>(false);
  const [participatedQuests, setParticipatedQuests] = useState<IQuestShort[]>(
    [],
  );

  const [campaingsValues, setCampaingsValues] = useState<string[]>([]);
  const [rewardsValues, setRewardsValues] = useState<string[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");

  const [inputValue, setInputValue] = useState<string>("");
  const [searchValues, setSearchValues] = useState<string[]>([]);

  const { push } = useRouter();

  const dispatch = useAppDispatch();

  const accountInfo = useTypedSelector(getAccountInfo);

  const getParticipatedQuests = useCallback(async () => {
    try {
      const params: { [key: string]: string } = {};

      if (campaingsValues && campaingsValues.length > 0) {
        params.campaign = campaingsValues.join(",");
      }

      if (rewardsValues && rewardsValues.length > 0) {
        params.reward = rewardsValues.join(",");
      }

      if (searchVal) {
        params.search = searchVal;
      }

      const { data } = await loyaltyService.getLoyaltyProjectsData({
        ...params,
        status: LoyaltyProjectStatuses.Participating,
        paginate: false,
        full: true,
      });

      setParticipatedQuests(data.loyaltyProjects);
      setSearchValues(data.projectsTitle);
    } catch (error: any) {
      LoggerService.error("Error during participated response", error);
    } finally {
      setParticipatedQuestsLoaded(true);
    }
  }, [campaingsValues, rewardsValues, searchVal]);

  const handleCLearAllFilters = useCallback(() => {
    setCampaingsValues([]);
    setRewardsValues([]);
  }, []);

  const handleOnSearch = (v?: string) => {
    handleCLearAllFilters();
    setSearchVal(v || "");
  };

  useEffect(() => {
    getParticipatedQuests();
  }, [getParticipatedQuests]);

  useEffect(() => {
    dispatch(setIsAdminPanelOpened(true));

    return () => {
      dispatch(setIsAdminPanelOpened(false));
    };
  }, [dispatch]);

  usePrivateRouteRedirect("/");

  const campaingsSelectData: ISelect = {
    title: t({ id: "3jxfr1gVzH517LboojKKxA-quest", message: "Campaigns" }),
    items: [
      {
        id: 1,
        title: t({ id: "iwYPxVg1UXRfYqmzTGvMFZ-quest", message: "Trending" }),
        value: LoyaltyProjectTrending.Trending.toLowerCase(),
      },
      {
        id: 2,
        title: t({ id: "aJXBffrvaraDSQ2sbzP1Ar-quest", message: "Newest" }),
        value: LoyaltyProjectTrending.Newest.toLowerCase(),
      },
    ],
  };

  const rewardsSelectData: ISelect = {
    title: t({ id: "hRWqjUSm6Gjs521VUcJguu-quest", message: "Rewards" }),
    items: [
      {
        id: 3,
        title: t({ id: "eA1djsm53REStFouP5zxk3-quest", message: "Token" }),
        value: LoyaltyProjectReward.Token.toLowerCase(),
      },
      {
        id: 4,
        title: t({ id: "ebq3FpZRFp12gY1Cu9Ei8y-quest", message: "NFT" }),
        value: LoyaltyProjectReward.NFT.toLowerCase(),
      },
      {
        id: 5,
        title: t({ id: "gU4V7Gaeuwnyvh6L73oPS1-quest", message: "Whitelist" }),
        value: LoyaltyProjectReward.Whitelist.toLowerCase(),
      },
    ],
  };

  return (
    <div className="background-other">
      {participatedQuestsLoaded ? (
        <Wrapper className="c-wrap">
          <Box className="header">
            <Button
              style="secondary"
              className="backButton"
              target="_self"
              href="/admin/projects"
            >
              <Icon name="slider-arrow" size="19" className="backIcon" />
            </Button>

            <Box component="h2" className="c-font-color c-fw-500 c-font-32-38">
              <Trans id="x8JrjE9AYY3hE9DniVVvBY-quest">
                Quests you participate in
              </Trans>
            </Box>
          </Box>

          <Filter
            className="filter"
            campaingsValues={campaingsValues}
            setCampaingsValues={setCampaingsValues}
            campaingsSelectData={campaingsSelectData}
            rewardsValues={rewardsValues}
            setRewardsValues={setRewardsValues}
            rewardsSelectData={rewardsSelectData}
            handleCLearAllFilters={handleCLearAllFilters}
            searchInput={true}
            searchItems={searchValues}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSearch={handleOnSearch}
          />

          <Box className="itemsWrapper">
            <Box className="item buttonItem">
              <Box className="buttonWrapper">
                <Button
                  style="colorfull"
                  className="questButton"
                  target="_self"
                  href="/explore"
                >
                  <>
                    <Icon name="menu-loyalty" size="22" className="questIcon" />
                    <Trans id="7NhEpeGgTfetN9QUTcZFo1-quest">
                      Participate in new Quest
                    </Trans>
                  </>
                </Button>
              </Box>
            </Box>

            {participatedQuests.map(item => (
              <FeaturedItem
                project={item}
                key={item.id}
                className="item"
                onClick={() => push(`/quest/${item.linkTitle}`)}
              />
            ))}
          </Box>
        </Wrapper>
      ) : (
        <PageLoader />
      )}
    </div>
  );
};

export default ParticipatedQuestsPage;
