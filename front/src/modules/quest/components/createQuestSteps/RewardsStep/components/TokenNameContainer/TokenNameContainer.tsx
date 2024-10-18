import { Box } from "@mui/material";
import { Wrapper } from "./tokenNameContainer.styles";
import { Selector } from "@/components/UI/selector";
import { Input } from "@/components/UI/input";
import { Trans, t } from "@lingui/macro";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CHAIN_OPTIONS_FOR_ONCHAIN, ERewardTabs, IContract } from "@/models";
import { Tooltip } from "@/components/UI/tooltip";
import { useDebouncedEffect } from "@/hooks";

interface Props {
  setZIndexState: Dispatch<SetStateAction<number>>;
  zIndexState: number;
  tokenContracts: IContract[];
  contractId: number;
  setContractId: (value: number) => void;
  zIndex?: number;
  isLuckyDraw: boolean;
  luckyDrawAmount: number;
  onLuckyDrawAmountChange: (value: string) => void;
  verified: boolean;
  activeTab: ERewardTabs;
}

const TokenNameContainer: FC<Props> = ({
  setZIndexState,
  tokenContracts,
  contractId,
  setContractId,
  zIndexState,
  zIndex,
  isLuckyDraw,
  luckyDrawAmount,
  onLuckyDrawAmountChange,
  verified,
  activeTab,
}) => {
  const [chainId, setChainId] = useState(CHAIN_OPTIONS_FOR_ONCHAIN[0].value);

  const tokenOptions: { value: number; title: string }[] = useMemo(
    () =>
      tokenContracts.reduce((acc, item) => {
        if (item.chainId === chainId)
          return [
            ...acc,
            {
              value: item.id,
              title: item.symbol,
              icon: item.investorId ? "import" : undefined,
              iconColor: "#87F696",
              iconSize: "20",
              divided: Boolean(item.investorId),
            },
          ];
        else return acc;
      }, []),
    [chainId, tokenContracts],
  );

  useEffect(() => {
    const chainIdToSet = tokenContracts.find(
      item => item.id === contractId,
    )?.chainId;
    if (
      activeTab === ERewardTabs.TOKEN &&
      contractId &&
      CHAIN_OPTIONS_FOR_ONCHAIN.find(item => item.value === chainIdToSet)
    ) {
      setChainId(
        tokenContracts.find(item => item.id === contractId)?.chainId ||
          CHAIN_OPTIONS_FOR_ONCHAIN[0].value,
      );
    }
  }, [activeTab, tokenContracts]);

  useDebouncedEffect(
    () => {
      if (activeTab === ERewardTabs.TOKEN && tokenOptions[0]?.value) {
        if (
          !contractId ||
          !tokenOptions.map(item => item.value).includes(contractId)
        ) {
          setContractId(tokenOptions[0]?.value);
        }
      }
    },
    { ignoreInitialCall: true, timeout: 200 },
    [
      activeTab,
      contractId,
      setContractId,
      tokenContracts,
      tokenOptions,
      verified,
    ],
  );

  return (
    <Wrapper>
      <Box className="selectorsContainer">
        <Box className="selectorWrapper token">
          <Box component="p" mb="6px">
            <Trans id="6ec4dW7CZU8NorgZ9cqVpE-quest">Token type</Trans>
          </Box>

          <Selector
            className="selector"
            onSelect={data => setContractId(data as number)}
            options={tokenOptions}
            dividedTitle={t({
              id: "qgmsc4BbLwyGGSdxnNf4wQ-quest",
              message: "Imported Tokens",
            })}
            onClick={open => {
              setZIndexState(open ? zIndex + 10 : 5);
            }}
            value={contractId}
            zIndex={zIndexState + 2}
          />
        </Box>

        <Box className="selectorWrapper chain">
          <Box display="flex" alignItems="center" mb="6px">
            <Box
              component="h3"
              mr="5px"
              className="c-font-color c-fw-500 c-font-16-22"
            >
              <Trans id="6QPUePQdxFJv7wR4fszk3n-quest">Blockchain</Trans>
            </Box>

            <Tooltip value="Blockchain tooltip" placement="top" followCursor>
              <Box className="tooltip c-font-10-20 c-fw-400">?</Box>
            </Tooltip>
          </Box>

          <Selector
            className="selector"
            onSelect={data => setChainId(data as string)}
            options={CHAIN_OPTIONS_FOR_ONCHAIN}
            onClick={open => {
              setZIndexState(open ? zIndex + 10 : 5);
            }}
            value={chainId}
            zIndex={zIndexState}
          />
        </Box>
      </Box>

      {isLuckyDraw && (
        <>
          <Box className="divider" />

          <Box>
            <Box component="p" mb="6px">
              <Trans id="iiS4dG4tTf39Fc2yY6WtNw-quest">Amount</Trans>
            </Box>
            <Box maxWidth="320px" className="inputWrapper p2">
              <Input
                className="c-full-width"
                value={String(luckyDrawAmount)}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  onLuckyDrawAmountChange(e.target.value);
                }}
                clearbtn={false}
              />
            </Box>
          </Box>
        </>
      )}
    </Wrapper>
  );
};

export default TokenNameContainer;
