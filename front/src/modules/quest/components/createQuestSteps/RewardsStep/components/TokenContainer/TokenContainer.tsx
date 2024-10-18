import { Box } from "@mui/material";
import { Wrapper } from "./tokenContainer.styles";
import { FC, useMemo, useState } from "react";
import { TokenInputs } from "../TokenInputs";
import { NftContainerContent } from "../NftContainerContent";
import { ERewardTabs, IContract, ICreateReward } from "@/models";
import { TokenContainerContent } from "../TokenContainerContent";
import { ETokenTabs } from "../../rewardsTypes.types";

interface Props {
  open: boolean;
  subTitle: string;
  isLuckyDraw: boolean;
  zIndex?: number;
  isNft?: boolean;
  nftCollections: IContract[];
  tokenContracts: IContract[];
  reward: ICreateReward;
  getNftCollections: () => Promise<void>;
  getTokensContracts: () => Promise<void>;
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

const TokenContainer: FC<Props> = ({
  open,
  subTitle,
  isLuckyDraw,
  zIndex,
  onLuckyDrawAmountChange,
  isNft,
  getNftCollections,
  getTokensContracts,
  nftCollections,
  tokenContracts,
  reward,
  onRewardFieldAmountChange,
  onRewardFieldEndPlaceChange,
  removeRewardFieldByIndex,
  addRewardField,
  removeLastRewardField,
  setContractId,
  setNftImage,
  onNftNameChange,
  isDraft,
}) => {
  const [selectedTokenTab, setSelectedTokenTab] = useState<ETokenTabs>(
    ETokenTabs.TOKEN,
  );
  const [tokenImported, setTokenImported] = useState<boolean>(false);
  const [zIndexState, setZIndexState] = useState<number>(zIndex || 5);
  const [isCreateNftFlow, setIsCreateNftFlow] = useState(false);

  const showTokenInputs = useMemo(
    () =>
      !isLuckyDraw &&
      (isCreateNftFlow ||
        (reward.activeTab === ERewardTabs.TOKEN &&
          (tokenImported || selectedTokenTab === ETokenTabs.TOKEN))),
    [
      isCreateNftFlow,
      isLuckyDraw,
      reward.activeTab,
      selectedTokenTab,
      tokenImported,
    ],
  );

  if (reward.activeTab === ERewardTabs.WHITELIST) return null;

  return (
    <Wrapper
      mb={2.5}
      borderRadius="10px"
      zIndex={zIndexState}
      position="relative"
      display={open ? "auto" : "none"}
    >
      <Box>
        <Box
          bgcolor="rgba(255, 255, 255, 0.1)"
          height="1px"
          width="100%"
          mt={2}
          mb={2}
        />

        {!isNft && (
          <TokenContainerContent
            tokenData={reward.token}
            tokenImported={tokenImported}
            tokenContracts={tokenContracts}
            selectedTab={selectedTokenTab}
            getTokensContracts={getTokensContracts}
            setSelectedTab={setSelectedTokenTab}
            setTokenImported={setTokenImported}
            setContractId={setContractId}
            setZIndexState={setZIndexState}
            zIndexState={zIndexState}
            zIndex={zIndex}
            isLuckyDraw={isLuckyDraw}
            onLuckyDrawAmountChange={onLuckyDrawAmountChange}
            verified={reward.verified}
            activeTab={reward.activeTab}
            isDraft={isDraft}
          />
        )}

        {isNft && (
          <NftContainerContent
            nftCollections={nftCollections}
            getNftCollections={getNftCollections}
            isCreateNftFlow={isCreateNftFlow}
            setIsCreateNftFlow={setIsCreateNftFlow}
            isLuckyDraw={isLuckyDraw}
            nftData={reward.nft}
            onLuckyDrawAmountChange={onLuckyDrawAmountChange}
            setContractId={setContractId}
            setNftImage={setNftImage}
            onNftNameChange={onNftNameChange}
            activeTab={reward.activeTab}
          />
        )}

        {showTokenInputs && (
          <>
            <Box
              bgcolor="rgba(255, 255, 255, 0.1)"
              height="1px"
              width="100%"
              mt={2}
              mb={2}
            />
            <Box component="p" className="c-font-20-24 c-fw-500" mb={1}>
              {subTitle}
            </Box>

            <TokenInputs
              rewards={reward[reward.activeTab].rewards}
              errors={reward[reward.activeTab].errors}
              onAmountChange={onRewardFieldAmountChange}
              onEndPlaceChange={onRewardFieldEndPlaceChange}
              removeByIndex={removeRewardFieldByIndex}
              addReward={addRewardField}
              removeLastReward={removeLastRewardField}
            />
          </>
        )}
      </Box>
    </Wrapper>
  );
};

export default TokenContainer;
