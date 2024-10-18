import { partnerProjectService } from "@/api/services/partnerProject";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  IQuestShort,
  IPartnerProject,
  LoyaltyProjectReward,
  LoyaltyProjectStatuses,
  LoyaltyProjectTrending,
} from "../../../quest/models";
import { LoggerService } from "@/services";
import Head from "next/head";
import { Box } from "@mui/material";
import { PartnerProjectHeader } from "../../components/PartnerProjectHeader";
import { Wrapper } from "./partnerProject.styles";
import { Trans, t } from "@lingui/macro";
import { loyaltyService } from "@/api";
import { ISelect } from "@/models";
import { useContextSelector } from "use-context-selector";
import { AppContext } from "@/context";
import { PageLoader } from "@/components/pageLoader";
import { Filter } from "@/modules/quest/components/filter";
import { Projects } from "@/modules/quest/components/projects";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getCurrentPartnerProject } from "@/modules/account/store/account.selector";

const anchorId = "projects";

const PartnerProjectPage = () => {
  const { query, push, replace, pathname } = useRouter();
  const { id: queryId } = query as { id: string };

  const [projectData, setProjectData] = useState<IPartnerProject | null>(null);
  const [isQuestsLoaded, setIsQuestsLoaded] = useState<boolean>(false);
  const [isProjectLoaded, setIsProjectLoaded] = useState<boolean>(false);

  const project = useTypedSelector(getCurrentPartnerProject);

  const id = useMemo(() => queryId || project?.linkTitle, [project?.linkTitle, queryId]);

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

  const statusesSelectData: ISelect = {
    title: t({ id: "3D6vmoxgELtixF5VxEVUyJ-quest", message: "Statuses" }),
    items: [
      {
        id: 6,
        title: t({
          id: "saCgYX4aiM2m6BXAKNyE11-quest",
          message: "Participating",
        }),
        value: LoyaltyProjectStatuses.Participating.toLowerCase(),
      },
      {
        id: 7,
        title: t({ id: "vmUhCibMKZmBsn9qfoSp76-quest", message: "Expired" }),
        value: LoyaltyProjectStatuses.Expired.toLowerCase(),
      },
      {
        id: 8,
        title: t({ id: "vnjL9sxPW573CwE7TP6UN9-quest", message: "Soon" }),
        value: LoyaltyProjectStatuses.Soon.toLowerCase(),
      },
      {
        id: 9,
        title: t({ id: "5W5KHk5joDChEih2jYGofV-quest", message: "Active" }),
        value: LoyaltyProjectStatuses.Active.toLowerCase(),
      },
    ],
  };

  const [isMoreLoaded, setIsMoreLoaded] = useState<boolean>(true);

  const [allProjects, setAllProjects] = useState<IQuestShort[]>([]);

  const [currentPage, setCurrentPage] = useState<number | null>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [searchCount, setSearchCount] = useState<number | null>(null);

  const [campaingsValues, setCampaingsValues] = useState<string[]>([]);
  const [rewardsValues, setRewardsValues] = useState<string[]>([]);
  const [statusesValues, setStatusesValues] = useState<string[]>([]);
  const [isInit, setIsInit] = useState<boolean>(false);

  const [searchVal, setSearchVal] = useState<string>("");

  const [inputValue, setInputValue] = useState<string>("");
  const [searchValues, setSearchValues] = useState<string[]>([]);

  const [shouldResetObserver, setShouldResetObserver] =
    useState<boolean>(false);

  const prevLocation = useContextSelector(
    AppContext,
    state => state.prevLocation,
  );

  const setSearchParams = useCallback(() => {
    const params: { [key: string]: string } = {};

    if (campaingsValues.length) {
      params.campaigns = campaingsValues.join(",");
    }

    if (rewardsValues.length) {
      params.reward = rewardsValues.join(",");
    }

    if (statusesValues.length) {
      params.status = statusesValues.join(",");
    }

    if (searchVal) {
      params.search = searchVal;
    }

    replace({ query: { id, ...params } });
  }, [replace, campaingsValues, rewardsValues, statusesValues, searchVal]);

  const init = () => {
    const campaings = (query.trending as string) || "";
    const rewards = (query.reward as string) || "";
    const statuses = (query.status as string) || "";
    const search = (query.search as string) || "";

    if (campaings !== "") {
      setCampaingsValues(campaings.split(","));
    } else {
      setCampaingsValues([]);
    }

    if (rewards !== "") {
      setRewardsValues(rewards.split(","));
    } else {
      setRewardsValues([]);
    }

    if (statuses !== "") {
      setStatusesValues(statuses.split(","));
    } else {
      setStatusesValues([]);
    }

    if (search !== "") {
      setSearchVal(search);
      setInputValue(search);
    } else {
      setSearchVal("");
      setInputValue("");
    }

    setIsInit(true);
  };

  const handleCLearAllFilters = useCallback(() => {
    setCampaingsValues([]);
    setRewardsValues([]);
    setStatusesValues([]);
  }, []);

  useEffect(() => {
    if (isInit) {
      setCurrentPage(1);
      getProjects("regular", 1);
      setShouldResetObserver(true);
      setSearchParams();
    }
  }, [campaingsValues, rewardsValues, statusesValues, searchVal]);

  const handleOnSearch = (v?: string) => {
    setCurrentPage(1);
    handleCLearAllFilters();
    setSearchVal(v || "");
  };
  const getProjects = async (type: "more" | "regular", page?: number) => {
    if (!id) return;

    const params: { [key: string]: string } = {
      partner: id,
    };

    if (type === "regular") {
      setIsQuestsLoaded(false);
    }

    if (campaingsValues && campaingsValues.length > 0) {
      params.campaign = campaingsValues.join(",");
    }

    if (rewardsValues && rewardsValues.length > 0) {
      params.reward = rewardsValues.join(",");
    }

    if (statusesValues && statusesValues.length > 0) {
      params.status = statusesValues.join(",");
    }

    if (searchVal) {
      params.search = searchVal;
    }

    if (type === "more") {
      setIsMoreLoaded(false);

      if (currentPage) {
        const newPage = (page || currentPage) + 1;
        setCurrentPage(newPage);

        params.page = `${newPage}`;
      }
    }

    if (type === "regular") {
      if (page || currentPage) {
        params.page = `${page || currentPage}`;
      }
    }

    try {
      const { data } = await loyaltyService.getLoyaltyProjectsData(params);

      if (data && type === "more") {
        setAllProjects([...allProjects, ...data.loyaltyProjects]);
      }

      if (data && type === "regular") {
        setAllProjects(data.loyaltyProjects);
      }

      setSearchCount(data.searchCount);
      setSearchValues(data.projectsTitle);

      setHasMore(data.isShowMore);
      setShouldResetObserver(false);
    } catch (error: any) {
      LoggerService.error("Error during event response", error);
    } finally {
      if (type === "more") {
        setIsMoreLoaded(true);
      } else {
        setIsQuestsLoaded(true);
      }
    }
  };

  useEffect(() => {
    init();

    return () => {
      setIsInit(false);

      if (prevLocation) {
        prevLocation.current = pathname;
      }
    };
  }, []);

  const getProjectData = useCallback(async () => {
    if (!id) return;

    try {
      const { data } = await partnerProjectService.getPartnerProjectData(id);

      if (!data?.project) {
        push("/404");
      }

      setProjectData(data.project);
    } catch (error: any) {
      push("/404");
      LoggerService.error("Failed during get project data", error);
    } finally {
      setIsProjectLoaded(true);
    }
  }, [id, push]);

  useEffect(() => {
    getProjectData();
  }, [getProjectData]);

  return (
    <div className="background-other">
      <Head>
        <title>AlphaPartner ${projectData && projectData.name}</title>
        <link rel="canonical" href={`partners/${id}`} />
      </Head>

      <Wrapper>
        {!isQuestsLoaded || !isProjectLoaded ? (
          <PageLoader />
        ) : (
          <>
            <PartnerProjectHeader project={projectData} />
            <Box
              sx={{
                flex: 1,
                marginTop: "40px !important",
                marginBottom: "40px !important",
              }}
              component="section"
              className="c-wrap"
            >
              <Box
                component="h3"
                className="c-font-32-38 c-fw-500 c-font-color"
                mb={2}
              >
                <Trans id="jjwXo7RuT6cymY5Y7tf7hX-quest">Quests</Trans>
              </Box>

              <Box
                className={"c-flex c-flex-items-center"}
                gap={1}
                mb={{
                  xs:
                    campaingsValues.length > 0 ||
                    rewardsValues.length > 0 ||
                    statusesValues.length > 0
                      ? 2
                      : 3,
                }}
              >
                <Filter
                  className="filter"
                  campaingsValues={campaingsValues}
                  setCampaingsValues={setCampaingsValues}
                  campaingsSelectData={campaingsSelectData}
                  rewardsValues={rewardsValues}
                  setRewardsValues={setRewardsValues}
                  rewardsSelectData={rewardsSelectData}
                  statusesValues={statusesValues}
                  setStatusesValues={setStatusesValues}
                  statusesSelectData={statusesSelectData}
                  handleCLearAllFilters={handleCLearAllFilters}
                  searchInput={true}
                  searchItems={searchValues}
                  inputValue={inputValue}
                  setInputValue={setInputValue}
                  onSearch={handleOnSearch}
                />
              </Box>

              {searchVal && searchCount !== null && (
                <Box
                  component="p"
                  id={anchorId}
                  className="c-font-20-24 c-font-color"
                  mb={3}
                >
                  {searchCount}{" "}
                  <Trans id="hpHE89KJ5mPvSaziVLnPnA-quest">
                    results found for
                  </Trans>{" "}
                  &quot;{searchVal}
                  &quot;
                </Box>
              )}

              <Box mb={3}>
                <Projects
                  isMoreLoaded={isMoreLoaded}
                  shouldResetObserver={shouldResetObserver}
                  loadMore={hasMore && isQuestsLoaded}
                  projects={allProjects}
                  handleNext={() => getProjects("more")}
                  isLoaded={isQuestsLoaded}
                />
              </Box>
            </Box>
          </>
        )}
      </Wrapper>
    </div>
  );
};

export default PartnerProjectPage;
