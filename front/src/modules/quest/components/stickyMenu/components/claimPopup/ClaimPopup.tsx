import { Modal } from "@/components/UI/modal";
import { Wrapper } from "./claimPopup.styles";
import { Box } from "@mui/material";
import { Button } from "@/components/UI/button";
import { Icon } from "@/components/UI/icon";
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CHAINS,
  ETokenStandard,
  ETokenType,
  ILoyaltyProjectFullReward,
  INft,
} from "@/models";
import { MarkdownAndHTML } from "@/components/MarkdownAndHTML/MarkdownAndHTML";
import Image from "next/image";
import { appConfig } from "@/app.config";
import { adminRewardService } from "@/api/services/admin/rewards";
import { loyaltyService } from "@/api";
import {
  useAccount,
  useConnect,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";
import { fromHex } from "viem";
import { INftClaimResponse, ITokenClaimResponse } from "@/modules/quest/models";
import { TREASURY_ABI } from "../../../createQuestSteps/RewardsStep/rewards.constants";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { ConnectWalletPopup } from "@/components/ConnectWalletPopup";
import { accountApiEndpoints } from "@/modules/account/store/account.api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { LoggerService } from "@/services";
import { exponentToNumber } from "@/modules/quest/helpers/rewards";
import { Trans, t } from "@lingui/macro";

interface Props {
  questLinkTitle: string;
  rewards: ILoyaltyProjectFullReward[];
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  claimingTransactions: Record<number, string>;
  setClaimingTransactionHash: (rewardId: number, txHash: string) => void;
  claimStatuses: Record<number, boolean>;
  setClaimStatus: (rewardId: number, value: boolean) => void;
}

const ClaimPopup: FC<Props> = ({
  questLinkTitle,
  isOpen,
  setIsOpen,
  rewards,
  claimingTransactions,
  setClaimingTransactionHash,
  claimStatuses,
  setClaimStatus,
}) => {
  const [currentRewardIndex, setCurrentRewardIndex] = useState<number>(0);
  const [nftMetadata, setNftMetadata] = useState<INft | null>(null);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState<boolean>(false);
  const [chainToConnect, setChainToConnect] = useState<`0x${string}` | null>(
    null,
  );

  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { isLoading: isConnectLoading } = useConnect();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { isLoading: isNetworkLoading } = useSwitchNetwork();

  const { wallet } = useTypedSelector(getAccountInfo);

  const dispatch = useAppDispatch();

  const currentReward = useMemo(
    () => rewards[currentRewardIndex],
    [rewards, currentRewardIndex],
  );

  const currentTransaction = useMemo(() => {
    const txHash = claimingTransactions[currentReward.id];

    if (!txHash) return null;

    const scanLink = CHAINS[currentReward.contract.chainId]?.scanLink;

    return `${scanLink}tx/${txHash}`;
  }, [claimingTransactions, currentReward.contract.chainId, currentReward.id]);

  const isToken = useMemo(
    () => currentReward.contract.type === ETokenType.Token,
    [currentReward.contract.type],
  );

  const isNft = useMemo(
    () => currentReward.contract.type === ETokenType.Nft,
    [currentReward.contract.type],
  );

  const isWhitelist = useMemo(
    () => currentReward.contract.type === ETokenType.Whitelist,
    [currentReward.contract.type],
  );

  const needConnect = useMemo(
    () =>
      !isConnected ||
      !wallet ||
      address.toLocaleLowerCase() !== wallet.toLocaleLowerCase(),
    [address, isConnected, wallet],
  );

  const needSwitchChain = useMemo(
    () =>
      !currentReward?.contract?.chainId ||
      chain?.id !== fromHex(currentReward.contract.chainId, "number"),
    [chain?.id, currentReward?.contract?.chainId],
  );

  const buttonName = useMemo(() => {
    if (currentReward?.contract?.type === ETokenType.Aq) {
      return "Claim";
    }

    if (needConnect) {
      return "Connect wallet";
    }

    if (needSwitchChain) {
      return "Switch network";
    }
    return "Claim";
  }, [currentReward?.contract?.type, needConnect, needSwitchChain]);

  const claimReward = useCallback(async () => {
    if (
      !currentReward?.contract?.chainId ||
      ![ETokenType.Nft, ETokenType.Token].includes(currentReward.contract.type)
    )
      return;

    const { chainId } = currentReward.contract;

    if (needConnect || needSwitchChain) {
      setIsWalletPopupOpen(true);
      setChainToConnect(chainId);
      return;
    }

    if (!walletClient || !publicClient || !CHAINS[chainId]?.treasury) return;

    setClaimLoading(true);

    try {
      const {
        data: { data: claimData },
      } = await loyaltyService.postClaim({
        linkTitle: questLinkTitle,
        rewardId: currentReward.id,
      });

      const { questId_, rewardId_, userId_, token_, treasurySignature_ } =
        claimData;

      if (currentReward.contract.type === ETokenType.Nft) {
        const { tokenIds_ } = claimData as INftClaimResponse;

        if (currentReward.contract.standard === ETokenStandard.ERC721) {
          const { request } = await publicClient.simulateContract({
            abi: TREASURY_ABI,
            address: CHAINS[chainId].treasury,
            functionName: "claimERC721Reward",
            chain: chain,
            args: [
              questId_,
              rewardId_,
              userId_,
              token_,
              tokenIds_,
              treasurySignature_,
            ],
            account: walletClient.data.account.address,
          });

          const txHash = await walletClient.data.writeContract(request);

          await new Promise(resolve => {
            const interval = setInterval(async () => {
              const verifyResult = await publicClient.readContract({
                address: CHAINS[chainId].treasury,
                abi: TREASURY_ABI,
                functionName: "getClaimingStatus",
                args: [questId_, rewardId_, userId_],
                account: walletClient.data.account.address,
              });

              if (!verifyResult) return;

              clearInterval(interval);
              resolve(verifyResult);
            }, 1000);
          });

          await loyaltyService.confirmClaiming(questLinkTitle, {
            rewardId: rewardId_,
            transactionHash: txHash,
          });

          setClaimingTransactionHash(rewardId_, txHash);
          setClaimStatus(rewardId_, true);

          return;
        }
      }
      const { amount_ } = claimData as ITokenClaimResponse;

      const amountWithDecimals = exponentToNumber(
        amount_ * 10 ** (currentReward.contract?.decimals || 0),
      );

      const { request } = await publicClient.simulateContract({
        abi: TREASURY_ABI,
        address: CHAINS[chainId].treasury,
        functionName: "claimERC20Reward",
        chain: chain,
        args: [
          questId_,
          rewardId_,
          userId_,
          token_,
          amountWithDecimals,
          treasurySignature_,
        ],
        account: walletClient.data.account.address,
      });

      const txHash = await walletClient.data.writeContract(request);

      await new Promise(resolve => {
        const interval = setInterval(async () => {
          const verifyResult = await publicClient.readContract({
            address: CHAINS[chainId].treasury,
            abi: TREASURY_ABI,
            functionName: "getClaimingStatus",
            args: [questId_, rewardId_, userId_],
            account: walletClient.data.account.address,
          });

          if (!verifyResult) return;

          clearInterval(interval);
          resolve(verifyResult);
        }, 1000);
      });

      await loyaltyService.confirmClaiming(questLinkTitle, {
        rewardId: rewardId_,
        transactionHash: txHash,
      });

      setClaimingTransactionHash(rewardId_, txHash);
      setClaimStatus(rewardId_, true);
    } catch (error) {
      console.log(error);
    } finally {
      setClaimLoading(false);
    }
  }, [
    chain,
    currentReward.contract,
    currentReward.id,
    needConnect,
    needSwitchChain,
    publicClient,
    questLinkTitle,
    setClaimStatus,
    setClaimingTransactionHash,
    walletClient,
  ]);

  const claimAq = useCallback(async () => {
    try {
      setClaimLoading(true);

      const data = {
        linkTitle: questLinkTitle,
      };

      await loyaltyService.postClaimAq(data);
      await dispatch(
        accountApiEndpoints.getUserProfile.initiate(null, {
          forceRefetch: true,
        }),
      );
      setClaimStatus(currentReward.id, true);
    } catch (error: any) {
      LoggerService.error("Failed during claim", error);
    } finally {
      setClaimLoading(false);
    }
  }, [currentReward.id, dispatch, questLinkTitle, setClaimStatus]);

  const getNftMetadata = useCallback(async () => {
    if (!isNft) return;

    const { data } = await adminRewardService.getNftMetadata(
      currentReward.contractId,
      currentReward.tokenIds[0],
    );

    setNftMetadata(data);
  }, [currentReward.contractId, currentReward.tokenIds, isNft]);

  const goNext = useCallback(
    () =>
      setCurrentRewardIndex(prev => {
        if (prev + 1 >= rewards.length) {
          return prev;
        }
        return prev + 1;
      }),
    [rewards.length],
  );

  const goPrev = useCallback(
    () =>
      setCurrentRewardIndex(prev => {
        if (prev - 1 < 0) {
          return prev;
        }
        return prev - 1;
      }),
    [],
  );

  useEffect(() => {
    getNftMetadata();
  }, [getNftMetadata]);

  return (
    <>
      {isOpen && (
        <Modal isOpen={true} handleClose={() => setIsOpen(false)}>
          <Wrapper>
            <Box className="header c-fw-500 c-font-color">
              <Trans id="dDRBGGrHdTmnBc139VVrrF-quest">Claim Your Reward</Trans>
              <Button
                className="c-font-color closeBtn"
                style="icon"
                type="button"
                onClick={() => setIsOpen(false)}
                disableTouchStart
              >
                <Icon name="menu-close" size="24" />
              </Button>
            </Box>

            <Box className="content">
              {isNft && nftMetadata?.image && (
                <Box className="nftImageContainer">
                  <Image
                    src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${nftMetadata.image}`}
                    width={214}
                    height={214}
                    alt={nftMetadata.name}
                    className="nftImage"
                  />
                </Box>
              )}
              {isWhitelist && (
                <>
                  <Box className="c-font-color c-font-20-24 c-fw-500" mb="15px">
                    <Trans id="gZDsUh7qHbGNMUHpXi6GzC-quest">
                      Here is a guide for you to get the White List
                    </Trans>
                  </Box>

                  <Box className="c-font-color c-font-16-22" mb="30px">
                    <MarkdownAndHTML description={currentReward.description} />
                  </Box>
                </>
              )}

              {!isWhitelist && (
                <Box className="titleContainer">
                  <Box className="title">
                    {CHAINS[currentReward.contract.chainId]?.icon && isNft && (
                      <Icon
                        name={CHAINS[currentReward.contract.chainId].icon}
                        size="25"
                        className="chainIcon"
                      />
                    )}
                    {currentReward.contract.logo && isToken && (
                      <Image
                        src={`${appConfig.NEXT_PUBLIC_S3_BUCKET}/${currentReward.contract.logo}`}
                        width={17}
                        height={17}
                        alt="Token logo"
                        className="chainIcon"
                      />
                    )}

                    <Box className="c-font-color c-font-20-24 c-fw-500">
                      Claim Your{" "}
                      {isNft
                        ? t({
                            id: "wfhAX4nbfdt3JrVj878bNC-quest",
                            message: "NFT",
                          })
                        : `${currentReward.amount} ${currentReward.contract.symbol}`}
                    </Box>
                  </Box>

                  {currentTransaction || claimStatuses[currentReward.id] ? (
                    <Box className="transaction">
                      <Box className="c-font-color c-font-16-22" mb="10px">
                        <Trans id="u1at7b9T2R7T6PRKDtsXtf-quest">
                          Reward claimed successfully! 🎉
                        </Trans>
                      </Box>

                      {currentTransaction && (
                        <Box
                          component="a"
                          href={currentTransaction}
                          target="_blank"
                          rel="noreferrer"
                          className="c-font-color-3 c-font-16-22 c-fw-500"
                          sx={{ textDecoration: "underline" }}
                        >
                          <Trans id="fGghRE5k7aCG3nNAgu9y6Z-quest">
                            Transaction link
                          </Trans>
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Button
                      style="primary"
                      className="claimButton"
                      onClick={
                        currentReward?.contract?.type === ETokenType.Aq
                          ? claimAq
                          : claimReward
                      }
                      loading={
                        claimLoading || isConnectLoading || isNetworkLoading
                      }
                    >
                      {buttonName}
                    </Button>
                  )}
                </Box>
              )}

              <Box className="arrowsContainer">
                <Box className="arrowContainer">
                  {currentRewardIndex !== 0 && (
                    <>
                      <Button
                        style="secondary"
                        className="arrowButton left"
                        onClick={goPrev}
                        disabled={currentRewardIndex === 0}
                      >
                        <Icon
                          name="arrow-straight"
                          size="16"
                          className="arrowIcon"
                        />
                      </Button>

                      <Box className="c-font-color c-font-15-16 c-fw-500">
                        <Trans id="w1NYtvZCcM91ixHs7rh1kP-quest">
                          Previous
                          <Box component="span" className="desktop">
                            {" "}
                            reward
                          </Box>
                        </Trans>
                      </Box>
                    </>
                  )}
                </Box>

                <Box className="arrowContainer">
                  {currentRewardIndex !== rewards.length - 1 && (
                    <>
                      <Box className="c-font-color c-font-15-16 c-fw-500">
                        <Trans id="4eN1c9QN3zedvYjnC7YdmA-quest">
                          Next
                          <Box component="span" className="desktop">
                            {" "}
                            reward
                          </Box>
                        </Trans>
                      </Box>

                      <Button
                        style="secondary"
                        className="arrowButton right"
                        onClick={goNext}
                        disabled={currentRewardIndex === rewards.length - 1}
                      >
                        <Icon
                          name="arrow-straight"
                          size="16"
                          className="arrowIcon"
                        />
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Wrapper>
        </Modal>
      )}

      <ConnectWalletPopup
        isOpen={isWalletPopupOpen && (needConnect || needSwitchChain)}
        handleClose={() => setIsWalletPopupOpen(false)}
        chainToConnect={chainToConnect}
        needConnect={needConnect}
        needSwitchChain={needSwitchChain}
        actionName={t({
          id: "qwSPr1XxNzoEM6mDNoqety-quest",
          message: "claim reward",
        })}
      />
    </>
  );
};

export default ClaimPopup;
