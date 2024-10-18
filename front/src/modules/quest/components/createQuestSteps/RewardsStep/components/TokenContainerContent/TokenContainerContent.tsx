import { Tabs } from "@/components/UI/tabs";
import { Wrapper } from "./tokenContainerContent.styles";
import { Dispatch, FC, SetStateAction, useMemo } from "react";
import { ERewardTabs, IContract, ITokenData } from "@/models";
import { Box } from "@mui/material";
import { ETokenTabs } from "../../rewardsTypes.types";
import { ImportToken } from "../ImportToken";
import { TokenNameContainer } from "../TokenNameContainer";
import { t } from "@lingui/macro";

interface Props {
  tokenData: ITokenData;
  tokenImported: boolean;
  tokenContracts: IContract[];
  selectedTab: ETokenTabs;
  setSelectedTab: Dispatch<SetStateAction<ETokenTabs>>;
  setTokenImported: Dispatch<SetStateAction<boolean>>;
  setContractId: (value: number) => void;
  getTokensContracts: () => Promise<void>;
  setZIndexState: Dispatch<SetStateAction<number>>;
  zIndexState: number;
  zIndex?: number;
  isLuckyDraw: boolean;
  onLuckyDrawAmountChange: (value: string) => void;
  verified: boolean;
  activeTab: ERewardTabs;
  isDraft: boolean;
}

const TokenContainerContent: FC<Props> = ({
  tokenData,
  tokenImported,
  tokenContracts,
  selectedTab,
  getTokensContracts,
  setSelectedTab,
  setTokenImported,
  setContractId,
  setZIndexState,
  zIndexState,
  zIndex,
  onLuckyDrawAmountChange,
  isLuckyDraw,
  verified,
  activeTab,
  isDraft,
}) => {
  const contractId = useMemo(
    () => tokenData.contractId || tokenContracts[0]?.id || null,
    [tokenContracts, tokenData.contractId],
  );

  return (
    <Wrapper>
      <Box mb="20px">
        <Tabs
          tabs={[
            {
              id: 1,
              title: t({
                id: "j5djoxdKX1SQp5X58Psvky-quest",
                message: "Select a Token",
              }),
              tab: ETokenTabs.TOKEN,
            },
            {
              id: 2,
              title: t({
                id: "q1bkYeG3NGFXntfcvd3A9n-quest",
                message: "Import Token",
              }),
              tab: ETokenTabs.IMPORT,
            },
          ]}
          activeTab={selectedTab}
          changeFn={(value: string) => setSelectedTab(value as ETokenTabs)}
          type="tertiary"
          buttonType="button"
          isDisabled={!isDraft}
        />
      </Box>

      {selectedTab === ETokenTabs.TOKEN && (
        <TokenNameContainer
          tokenContracts={tokenContracts}
          setZIndexState={setZIndexState}
          zIndexState={zIndexState}
          zIndex={zIndex}
          isLuckyDraw={isLuckyDraw}
          luckyDrawAmount={tokenData.luckyDrawAmount}
          onLuckyDrawAmountChange={onLuckyDrawAmountChange}
          contractId={contractId}
          setContractId={setContractId}
          verified={verified}
          activeTab={activeTab}
        />
      )}

      {selectedTab === ETokenTabs.IMPORT && (
        <ImportToken
          tokenContracts={tokenContracts}
          tokenImported={tokenImported}
          contractId={contractId}
          getTokensContracts={getTokensContracts}
          setTokenImported={setTokenImported}
          setContractId={setContractId}
        />
      )}
    </Wrapper>
  );
};

export default TokenContainerContent;
