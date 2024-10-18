import {
  RewardBadge,
  Wrapper,
} from "@/modules/quest/components/createQuestSteps/RewardsStep/rewardsStep.styles";
import { Box } from "@mui/material";
import { Trans, t } from "@lingui/macro";
import classNames from "classnames";
import { TokenContainer } from "@/modules/quest/components/createQuestSteps/RewardsStep/components/TokenContainer";
import { FC } from "react";
import Icon from "@components/UI/icon/Icon";
import { ERewardTabs, IContract, ICreateReward } from "@/models";
import { WhitelistContainer } from "../WhitelistContainer";

interface Props {
  isLuckyDraw: boolean;
  showDelete: boolean;
  reward: ICreateReward;
  nftCollections: IContract[];
  tokenContracts: IContract[];
  setActiveTab: (value: ERewardTabs) => void;
  onRewardDelete: () => Promise<void>;
  getNftCollections: () => Promise<void>;
  getTokensContracts: () => Promise<void>;
  onWhitelistNameChange: (value: string) => void;
  onWhitelistDescriptionChange: (value: string) => void;
  onWhitelistEndPlaceChange: (value: string) => void;
  onRewardFieldAmountChange: (
    rewardFieldIndex: number,
    amountValue: string,
  ) => void;
  onRewardFieldEndPlaceChange: (
    rewardFieldIndex: number,
    endPlaceValue: string,
  ) => void;
  onLuckyDrawAmountChange: (value: string) => void;
  removeRewardFieldByIndex: (rewardFieldIndex: number) => void;
  removeLastRewardField: () => void;
  addRewardField: () => void;
  setContractId: (value: number) => void;
  setNftImage: (value: File | null) => void;
  onNftNameChange: (value: string) => void;
  isDraft: boolean;
}

const RewardBlock: FC<Props> = ({
  isLuckyDraw,
  setActiveTab,
  reward,
  showDelete,
  onRewardDelete,
  nftCollections,
  tokenContracts,
  getNftCollections,
  getTokensContracts,
  onWhitelistNameChange,
  onWhitelistDescriptionChange,
  onWhitelistEndPlaceChange,
  onLuckyDrawAmountChange,
  onRewardFieldAmountChange,
  onRewardFieldEndPlaceChange,
  removeRewardFieldByIndex,
  removeLastRewardField,
  addRewardField,
  setContractId,
  setNftImage,
  onNftNameChange,
  isDraft,
}) => {
  const tabs = [
    {
      value: "token",
      label: t({ id: "1gmk5yCWR5naDxjPLFNAwg-quest", message: "Token" }),
    },
    {
      value: "nft",
      label: t({ id: "ov1VxTCotNTKrLuP6bxajo-quest", message: "NFT" }),
    },
    {
      value: "whitelist",
      label: t({ id: "dryEt6Pvw9fFKDzN4pw2Ww-quest", message: "Whitelist" }),
    },
  ];

  return (
    <Wrapper
      sx={{ maxWidth: "664px !important" }}
      mb={3.5}
      verified={
        (reward.verified && reward.activeTab !== ERewardTabs.WHITELIST) ||
        !isDraft
      }
      bgcolor={"var(--card, rgba(0, 0, 0, 0.33))"}
    >
      <Box className={"c-full-width c-flex-between"}>
        <p className={"c-font-20-24 c-font-bold"}>
          <Trans id="1YtKdz31LX4ku7X6MER7bT-quest">Reward</Trans>
        </p>
        {showDelete && (
          <Icon
            onClick={onRewardDelete}
            style={{ cursor: "pointer" }}
            name={"menu-close"}
            size={"24"}
          />
        )}
      </Box>

      <Box mt={2} mb={2} width="100%">
        <Box bgcolor="rgba(255, 255, 255, 0.1)" height="1px" width="100%" />
      </Box>

      <Box display={"flex"} overflow={"auto"} gap={1.5}>
        {tabs.map(tab => (
          <RewardBadge
            onClick={() => setActiveTab(tab.value as ERewardTabs)}
            key={tab.value}
            selected={reward.activeTab === tab.value}
          >
            <p
              className={classNames("c-font-16-20", {
                [reward.activeTab === tab.value
                  ? "c-font-color-3"
                  : "c-font-color"]: true,
              })}
            >
              {tab.label}
            </p>
          </RewardBadge>
        ))}
      </Box>

      <TokenContainer
        open={reward.activeTab === ERewardTabs.TOKEN}
        subTitle={t({
          id: "bkt19L49iAfJuGHXrsExdK-quest",
          message: "Token Reward Distribution",
        })}
        isLuckyDraw={isLuckyDraw}
        zIndex={5}
        nftCollections={nftCollections}
        tokenContracts={tokenContracts}
        reward={reward}
        getNftCollections={getNftCollections}
        getTokensContracts={getTokensContracts}
        onRewardFieldAmountChange={onRewardFieldAmountChange}
        onRewardFieldEndPlaceChange={onRewardFieldEndPlaceChange}
        onLuckyDrawAmountChange={onLuckyDrawAmountChange}
        removeRewardFieldByIndex={removeRewardFieldByIndex}
        removeLastRewardField={removeLastRewardField}
        addRewardField={addRewardField}
        setContractId={setContractId}
        setNftImage={setNftImage}
        onNftNameChange={onNftNameChange}
        isDraft={isDraft}
      />

      <TokenContainer
        open={reward.activeTab === ERewardTabs.NFT}
        subTitle={t({
          id: "tyUfk2Bf8F6YBAMH5RgkdV-quest",
          message: "NFT Reward Distribution",
        })}
        isLuckyDraw={isLuckyDraw}
        zIndex={4}
        isNft
        nftCollections={nftCollections}
        getNftCollections={getNftCollections}
        getTokensContracts={getTokensContracts}
        reward={reward}
        tokenContracts={tokenContracts}
        onRewardFieldAmountChange={onRewardFieldAmountChange}
        onRewardFieldEndPlaceChange={onRewardFieldEndPlaceChange}
        onLuckyDrawAmountChange={onLuckyDrawAmountChange}
        removeRewardFieldByIndex={removeRewardFieldByIndex}
        removeLastRewardField={removeLastRewardField}
        addRewardField={addRewardField}
        setContractId={setContractId}
        setNftImage={setNftImage}
        onNftNameChange={onNftNameChange}
        isDraft={isDraft}
      />

      <WhitelistContainer
        open={reward.activeTab === ERewardTabs.WHITELIST}
        isLuckyDraw={isLuckyDraw}
        whitelistData={reward.whitelist}
        onWhitelistNameChange={onWhitelistNameChange}
        onWhitelistDescriptionChange={onWhitelistDescriptionChange}
        onWhitelistEndPlaceChange={onWhitelistEndPlaceChange}
        isDraft={isDraft}
      />
    </Wrapper>
  );
};

export default RewardBlock;
