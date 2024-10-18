import { NextPage } from "next";
import { useGetProfileRewardsQuery } from "@modules/account/store/account.api";
import { Box, CircularProgress } from "@mui/material";
import { Reward } from "@modules/account/components/rewards/components/Reward";
import Filter from "../../../quest/components/filter/Filter";
import { t, Trans } from "@lingui/macro";
import { useState } from "react";
import { ETokenType, IFullRewardWithNft, ISelect } from "@models";
import Link from "next/link";
import Button from "../../../../components/UI/button/Button";
import { adminRewardService } from "@api/services/admin/rewards";
import { EProjectType } from "@modules/quest/models";
import RewardDescriptionPopup from "@modules/quest/components/stickyMenu/components/rewardDescriptionPopup/RewardDescriptionPopup";

enum ERewardSelectData {
  NFT = "nft",
  TOKEN = "token",
  WHITELIST = "whitelist",
}

enum ECampaignStatus {
  CLAIMED = "CLAIMED",
  NOT_CLAIMED = "NOT",
}

const Rewards: NextPage = () => {
  const [rewardsValues, setRewardsValues] = useState<string[]>([]);
  const [campaignValues, setCampaignValues] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchValueForApi, setSearchValueForApi] = useState<string>("");

  const rewardsSelectData: ISelect = {
    items: [
      {
        id: 1,
        isSelected: false,
        value: ERewardSelectData.TOKEN,
        title: t({ id: "eE2tvCxx1mPd69PyTbByhX-rewards", message: "Token" }),
      },
      {
        id: 2,
        isSelected: false,
        value: ERewardSelectData.NFT,
        title: t({ id: "r8SNGuoVYL9zzr4tGz1CWL-rewards", message: "NFT" }),
      },
      {
        id: 3,
        isSelected: false,
        value: ERewardSelectData.WHITELIST,
        title: t({
          id: "5KCUr6JfmtLMLaBWQnVK71-rewards",
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
        value: ECampaignStatus.CLAIMED,
        title: t({ id: "4M7xGWxFMGfHebzfYfFUBW-rewards", message: "Claimed" }),
      },
      {
        id: 2,
        isSelected: false,
        value: ECampaignStatus.NOT_CLAIMED,
        title: t({
          id: "59w8Y14uHSEHV52hABNa2W-rewards",
          message: "Not Claimed",
        }),
      },
    ],
    title: t({
      message: "All claiming Statuses",
      id: "xsdn-34njsdv-2ksnfvjk",
    }),
  };

  const [selectedReward, setSelectedReward] =
    useState<IFullRewardWithNft | null>(null);

  const { data, isLoading } = useGetProfileRewardsQuery({
    isClaimed: campaignValues.reduce((acc, currentValue) => {
      if (currentValue === ECampaignStatus.CLAIMED) acc += "true";
      else if (currentValue === ECampaignStatus.NOT_CLAIMED) acc += "false";
      return acc;
    }, ""),
    reward: rewardsValues ? rewardsValues.join(",") : "",
    search: searchValueForApi,
  });

  const isClearQuery =
    !rewardsValues.length && !campaignValues.length && !searchValue;

  const processRewardItem = async item => {
    let modifiedItem = { ...item };
    if (item.contract.type === ETokenType.Nft) {
      try {
        const { data } = await adminRewardService.getNftMetadata(
          item.contract.id,
          item.tokenIds[0],
        );
        modifiedItem.nftMetadata = data;
      } catch {
        console.log("Error getting nft metadata");
      }
    }

    modifiedItem.amount =
      item.loyaltyProject === EProjectType.Scoreboard
        ? item.amount * (item.endPlace - item.startPlace + 1)
        : item.amount;

    setSelectedReward(modifiedItem);
    return modifiedItem;
  };
  const exploreProjects = (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={2}
      p={"20px"}
      maxWidth={330}
      bgcolor={"rgba(255, 255, 255, 0.05)"}
      mt={3}
    >
      <Box mb={3} component={"p"} className={"c-font-color"}>
        <Trans id={"shg-34thjkfd-25234"}>
          You {" don't "}have any rewards yet
        </Trans>
      </Box>
      <Link href={"/explore"}>
        <Button style={"primary"} size={"medium"} type={"button"}>
          <p>
            <Trans id="4irc3f11Z6E7nwZpQ1whK5-reward">Start earning</Trans>
          </p>
        </Button>
      </Link>
    </Box>
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
        searchItems={data ? data.map(item => item.contract.name || "") : []}
        inputValue={searchValue}
        handleCLearAllFilters={() => {
          setRewardsValues([]);
          setCampaignValues([]);
        }}
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
        <Box
          mt={4}
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
          gap={"25px"}
        >
          {data?.map((reward, index) => {
            return (
              <Reward
                onClick={() => processRewardItem(reward)}
                reward={reward}
                key={index}
              />
            );
          })}
        </Box>
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
      {selectedReward && (
        <RewardDescriptionPopup
          reward={selectedReward}
          setIsOpen={() => setSelectedReward(null)}
          isOpen={!!selectedReward}
        />
      )}
    </Box>
  );
};

export default Rewards;
