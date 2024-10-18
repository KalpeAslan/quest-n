import { NextPage } from "next";
import { useGetProfileQuestsQuery } from "@modules/account/store/account.api";
import { Box, CircularProgress, Theme, useMediaQuery } from "@mui/material";
import Filter from "../../../quest/components/filter/Filter";
import { t, Trans } from "@lingui/macro";
import { useState } from "react";
import { ISelect } from "@models";
import Link from "next/link";
import Button from "../../../../components/UI/button/Button";
import { Quest } from "@modules/account/components/quests/components/Quest";
import { EProjectType } from "@modules/quest/models";
import { CBreakpoints } from "../../../../styles/variables";

enum ERewardSelectData {
  NFT = "nft",
  TOKEN = "token",
  WHITELIST = "whitelist",
}

enum ECampaignStatus {
  Participating = "participating",
  Win = "win",
  Expired = "expired",
}

const Quests: NextPage = () => {
  const [rewardsValues, setRewardsValues] = useState<string[]>([]);
  const [campaignValues, setCampaignValues] = useState<string[]>([]);
  const [questsValues, setQuestsValues] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchValueForApi, setSearchValueForApi] = useState<string>("");

  const rewardsSelectData: ISelect = {
    items: [
      {
        id: 1,
        isSelected: false,
        value: ERewardSelectData.TOKEN,
        title: t({ id: "m3HVxzdF6vp5J6ZjCQhYsK-quests", message: "Token" }),
      },
      {
        id: 2,
        isSelected: false,
        value: ERewardSelectData.NFT,
        title: t({ id: "6cJx5H17GxViAig27HUbk5-quests", message: "NFT" }),
      },
      {
        id: 3,
        isSelected: false,
        value: ERewardSelectData.WHITELIST,
        title: t({
          id: "d3oa54Rbou5FAkNArARxqg-quests",
          message: "White List",
        }),
      },
    ],
    title: t({
      message: "All Rewards",
      id: "ksdn-34njsdv-2ksnfvjk",
    }),
  };

  const campaingsSelectData: ISelect = {
    items: [
      {
        id: 1,
        isSelected: false,
        value: ECampaignStatus.Win,
        title: t({ id: "d4J91BLrda9YgMoYsXrY4L-quests", message: "Win" }),
      },
      {
        id: 2,
        isSelected: false,
        value: ECampaignStatus.Participating,
        title: t({
          id: "nrk3eEi4kRPNiTpJWUjgn9-quests",
          message: "Participating",
        }),
      },
      {
        id: 3,
        isSelected: false,
        value: ECampaignStatus.Expired,
        title: t({ id: "8TXr1UuCEzCCCsJirKaU3R-quests", message: "Expired" }),
      },
    ],
    title: t({
      message: "All statuses",
      id: "erxsdn-34njsdv-2ksnfvjk",
    }),
  };

  const questsSelectData: ISelect = {
    items: [
      {
        id: 1,
        isSelected: false,
        value: EProjectType.Scoreboard,
        title: t({
          id: "d5aKS5sfqGWMsx6bLMWwmz-quests",
          message: "Scoreboard",
        }),
      },
      {
        id: 2,
        isSelected: false,
        value: EProjectType.LuckyDraw,
        title: t({ id: "xBaQaFpMGZio8d4Q3upw93-quests", message: "LuckyDraw" }),
      },
      {
        id: 3,
        isSelected: false,
        value: EProjectType.Guaranteed,
        title: t({
          id: "syM6WjmkphhXYuDhUVYzsj-quests",
          message: "Guaranteed",
        }),
      },
    ],
    title: t({
      message: "All Quests",
      id: "x2xsdn-34njsdv-2ksnfvjk",
    }),
  };

  const { data, isLoading } = useGetProfileQuestsQuery(
    {
      reward: rewardsValues ? rewardsValues.join(",") : "",
      status: campaignValues ? campaignValues.join(",") : "",
      projectType: questsValues ? questsValues.join(",") : "",
      search: searchValueForApi,
    },
    {},
  );

  const isClearQuery =
    !rewardsValues.length &&
    !campaignValues.length &&
    !questsValues.length &&
    !searchValueForApi;

  const exploreProjects = (
    <Box
      mt={4}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={2}
      p={"20px"}
      maxWidth={310}
      textAlign={"center"}
      bgcolor={"rgba(255, 255, 255, 0.05)"}
    >
      <Box mb={3} component={"p"} className={"c-font-color c-font-18-20"}>
        <Trans id={"xhg-34thjkfd-25234"}>
          You {"haven't"} participated in quests yet
        </Trans>
      </Box>
      <Link href={"/explore"}>
        <Button style={"primary"} size={"medium"} type={"button"}>
          <p>
            <Trans id="hEMBBP9fhUQ7dGS7mEBBFK-quests">Start earning</Trans>
          </p>
        </Button>
      </Link>
    </Box>
  );

  const isNotLg = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up(CBreakpoints.lg),
  );

  return (
    <Box width={"100%"}>
      <Filter
        campaingsValues={campaignValues}
        campaingsSelectData={campaingsSelectData}
        setCampaingsValues={setCampaignValues}
        rewardsValues={rewardsValues}
        rewardsSelectData={rewardsSelectData}
        setRewardsValues={setRewardsValues}
        searchItems={
          data
            ? data.map(item =>
                isNotLg ? item.title.slice(0, 12).concat("...") : item.title,
              )
            : []
        }
        inputValue={searchValue}
        handleCLearAllFilters={() => {
          setRewardsValues([]);
          setCampaignValues([]);
        }}
        questsSelectData={questsSelectData}
        questsValues={questsValues}
        setQuestsValues={setQuestsValues}
        setInputValue={setSearchValue}
        searchInput
        onSearch={() => setSearchValueForApi(searchValue)}
      />
      {isLoading ? (
        <Box
          mt={3}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          width={"100%"}
          className={"c-font-color-3"}
        >
          <CircularProgress color={"inherit"} size={24} />
        </Box>
      ) : data?.length > 0 ? (
        <>
          <Box
            mt={4}
            width={"100%"}
            display={"flex"}
            flexDirection={"row"}
            flexWrap={"wrap"}
            gap={"25px"}
          >
            {data?.map((quest, index) => {
              return <Quest data={quest} key={index} />;
            })}
          </Box>
        </>
      ) : isClearQuery ? (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          {exploreProjects}
        </Box>
      ) : (
        <Box
          mt={4}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <p className="c-font-16-20 c-font-color-9">
            <Trans id="hEZvvvKCWZKpmwA2RUvht6-quest">No projects found.</Trans>
          </p>
        </Box>
      )}
    </Box>
  );
};

export default Quests;
