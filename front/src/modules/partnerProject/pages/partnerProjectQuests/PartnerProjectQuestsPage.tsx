import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  IQuestShort,
  LoyaltyProjectReward,
  LoyaltyProjectStatuses,
  LoyaltyProjectTrending,
} from "../../../quest/models/Quest";
import { loyaltyService } from "@/api";
import { LoggerService } from "@/services";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import {
  getAccountState,
  getPartnerProject,
} from "@/modules/account/store/account.selector";
import {
  setIsAdminPanelOpened,
  setPartnerProjectSettingsLinkTitle,
} from "@/store/slices/system/system.slice";
import { Wrapper } from "./partnerProjectQuests.styles";
import { Box, Theme, useMediaQuery } from "@mui/material";
import { Button } from "@/components/UI/button";
import { QuestCard } from "../../components/QuestCard";
import { DeletePopup } from "../../components/QuestCard/DeletePopup";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { PageLoader } from "@/components/pageLoader";
import { Icon } from "@/components/UI/icon";
import { Trans, t } from "@lingui/macro";
import { ISelect } from "@/models";
import { Filter } from "@/modules/quest/components/filter";
import PartnerProjectHeader from "@modules/partnerProject/components/PartnerProjectHeader/PartnerProjectHeader";
import BreadCrumbs from "../../../../components/breadCrumbs/BreadCrumbs";
import { PartnerProjectsDropdown } from "@modules/quest/components/partnerProjectsDropdown/PartnerProjectsDropdown";
import { CBreakpoints } from "@styles/variables";
import Image from "next/image";
import { usePrivateRouteRedirect } from "@/hooks/usePrivateRouteRedirect";
// import { PartnerProjectHeader } from "@modules/partnerProject/components/PartnerProjectHeader";

const PartnerProjectQuestsPage = () => {
  const { push, query } = useRouter();
  const [campaingsValues, setCampaingsValues] = useState<string[]>([]);
  const [rewardsValues, setRewardsValues] = useState<string[]>([]);
  const [statusesValues, setStatusesValues] = useState<string[]>([]);

  const [searchVal, setSearchVal] = useState<string>("");

  const [inputValue, setInputValue] = useState<string>("");
  const [searchValues, setSearchValues] = useState<string[]>([]);

  const dispatch = useAppDispatch();
  const { accountInfo, isPartnerProjectsLoaded } =
    useTypedSelector(getAccountState);

  const [questsLoaded, setIsQuestsLoaded] = useState<boolean>(false);
  const [quests, setQuests] = useState<IQuestShort[]>([]);
  const [deleteLinkTitle, setDeleteLinkTitle] = useState<string | null>(null);

  const id = query.linkTitle as string;
  const project = useTypedSelector(getPartnerProject(id));

  usePrivateRouteRedirect();

  const getQuests = useCallback(async () => {
    if (!id) return;

    try {
      const params: { [key: string]: string } = {};

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

      const { data } = await loyaltyService.getLoyaltyProjectsData({
        ...params,
        partner: id,
        visible: false,
        paginate: false,
        full: true,
      });

      setQuests(data.loyaltyProjects);
      setSearchValues(data.projectsTitle);
    } catch (error: any) {
      LoggerService.error("Error during event response", error);
    } finally {
      setIsQuestsLoaded(true);
    }
  }, [campaingsValues, id, rewardsValues, searchVal, statusesValues]);

  useEffect(() => {
    getQuests();
  }, [getQuests]);

  useEffect(() => {
    if (accountInfo?.connected === null || !isPartnerProjectsLoaded || !id)
      return;

    if (!accountInfo?.connected || !project) {
      push("/");
    }

    return () => {
      if (!accountInfo?.connected || !project) {
        push("/");
      }
    };
  }, [accountInfo?.connected, push, isPartnerProjectsLoaded, id]);

  useEffect(() => {
    dispatch(setPartnerProjectSettingsLinkTitle(id));

    return () => {
      dispatch(setPartnerProjectSettingsLinkTitle(null));
    };
  }, [id, dispatch]);

  useEffect(() => {
    dispatch(setIsAdminPanelOpened(true));

    return () => {
      dispatch(setIsAdminPanelOpened(false));
    };
  }, [dispatch]);

  const handleCLearAllFilters = useCallback(() => {
    setCampaingsValues([]);
    setRewardsValues([]);
    setStatusesValues([]);
  }, []);

  const handleOnSearch = (v?: string) => {
    handleCLearAllFilters();
    setSearchVal(v || "");
  };

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

  const isLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.lg),
  );

  return (
    <div className="background-other">
      {!project || !questsLoaded ? (
        <PageLoader />
      ) : (
        <Wrapper className="c-font-color">
          {isLg && (
            <div className={"partner-project-quests__sidebar"}>
              <Box p={2}>
                <PartnerProjectsDropdown />
              </Box>
              <Image
                className={"partner-project-quests__sidebar__image"}
                width={50}
                height={150}
                src={"/images/project/sidebar__gradient.png"}
                alt={"sidebar"}
              />
            </div>
          )}

          <div className="partner-project-quests__content c-wrap">
            {project && (
              <Box
                className={"quest-analytics__anchor"}
                sx={theme => ({
                  [theme.breakpoints.down(CBreakpoints.md)]: {
                    mb: 6,
                  },
                  mb: 3,
                })}
              >
                <BreadCrumbs
                  links={[
                    {
                      title: t({
                        message: "Projects",
                        id: "blkfdb95-fglknf-f3gn4k-dfg",
                      }),
                      link: "/admin/projects",
                      id: 0,
                    },
                    {
                      title: project.name,
                      link: `/admin/project/${project.linkTitle}`,
                      id: 1,
                    },
                  ]}
                />
              </Box>
            )}
            <PartnerProjectHeader project={project} showAdminPanel />

            <DeletePopup
              deleteLinkTitle={deleteLinkTitle}
              setDeleteLinkTitle={setDeleteLinkTitle}
              getQuests={getQuests}
            />

            <Box className="header" mt={4}>
              <Box
                component="h2"
                className="c-font-color c-fw-500 c-font-32-38"
              >
                <Trans id="X5EZ9LK92H4G2DKwNy6Aaj4-partnerProject">
                  Quests
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

            <Box className="itemsWrapper">
              <Box className="item buttonItem">
                <Box className="buttonWrapper">
                  <Button
                    style="colorfull"
                    className="questButton"
                    target="_self"
                    href={`/admin/project/${id}/quest/create/init`}
                  >
                    <>
                      <Icon
                        name="menu-loyalty"
                        size="22"
                        className="questIcon"
                      />
                      <Trans id="35xrwH81nTC66txNFzkfnu-partnerProject">
                        Create new quest
                      </Trans>
                    </>
                  </Button>
                </Box>
              </Box>

              {quests.map(item => (
                <QuestCard
                  project={item}
                  key={item.linkTitle}
                  partnerProjectLinkTitle={id}
                  setDeleteLinkTitle={setDeleteLinkTitle}
                />
              ))}
            </Box>
          </div>
        </Wrapper>
      )}
    </div>
  );
};

export default PartnerProjectQuestsPage;
