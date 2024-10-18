import { ERewardTabs, IContract, INftData } from "@/models";
import { DeployCollection } from "../DeployCollection";
import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import { CreateNftBlock } from "../CreateNftBlock";

interface Props {
  nftCollections: IContract[];
  getNftCollections: () => Promise<void>;
  isCreateNftFlow: boolean;
  setIsCreateNftFlow: Dispatch<SetStateAction<boolean>>;
  nftData: INftData;
  isLuckyDraw: boolean;
  activeTab: ERewardTabs;
  onLuckyDrawAmountChange: (value: string) => void;
  setContractId: (value: number) => void;
  setNftImage: (value: File | null) => void;
  onNftNameChange: (value: string) => void;
}

const NftContainerContent: FC<Props> = ({
  nftCollections,
  getNftCollections,
  isCreateNftFlow,
  setIsCreateNftFlow,
  nftData,
  isLuckyDraw,
  activeTab,
  onLuckyDrawAmountChange,
  setContractId,
  setNftImage,
  onNftNameChange,
}) => {
  const contractId = useMemo(
    () => nftData.contractId || nftCollections[0]?.id || null,
    [nftCollections, nftData.contractId],
  );

  useEffect(() => {
    if (nftCollections.length) setIsCreateNftFlow(true);
  }, [nftCollections, setIsCreateNftFlow]);

  return (
    <>
      {!isCreateNftFlow && (
        <DeployCollection
          nftCollections={nftCollections}
          getNftCollections={getNftCollections}
          setChosenCollection={setContractId}
          setIsCreateNftFlow={setIsCreateNftFlow}
        />
      )}

      {isCreateNftFlow && (
        <CreateNftBlock
          nftCollections={nftCollections}
          setIsCreateNftFlow={setIsCreateNftFlow}
          isLuckyDraw={isLuckyDraw}
          luckyDrawAmount={nftData.luckyDrawAmount}
          onLuckyDrawAmountChange={onLuckyDrawAmountChange}
          nameError={nftData.nameError}
          contractId={contractId}
          setContractId={setContractId}
          image={nftData.image}
          setImage={setNftImage}
          name={nftData.name}
          onNameChange={onNftNameChange}
          activeTab={activeTab}
        />
      )}
    </>
  );
};

export default NftContainerContent;
