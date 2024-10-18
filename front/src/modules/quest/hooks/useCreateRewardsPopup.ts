import { adminRewardService } from "@/api/services/admin/rewards";
import {
  CHAINS,
  ERewardTabs,
  IContract,
  ICreateReward,
  TCreateRewards,
} from "@/models";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fromHex } from "viem";
import {
  useAccount,
  useConnect,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";
import {
  ERC20_ABI,
  TREASURY_ABI,
} from "../components/createQuestSteps/RewardsStep/rewards.constants";
import { useTypedSelector } from "@/hooks/useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { ILoyaltyProject, QuestStatus } from "@modules/quest/models";
import { adminQuestService, loyaltyService } from "@api";
import {
  clearTabs,
  exponentToNumber,
  getCreateNftRewardData,
  getCreateTokenRewardData,
  getCreateWhitelistRewardData,
  getDefaultContract,
} from "../helpers/rewards";

interface Props {
  rewards: TCreateRewards;
  nftCollections: IContract[];
  tokenContracts: IContract[];
  questId: number;
  questTitle: string;
  handleClose: () => void;
  setIsSuccessOpen: Dispatch<SetStateAction<boolean>>;
  isLuckyDraw: boolean;
  luckyDrawUsersAmount: number;
  setVerified: (rewardId: number, verified: boolean) => void;
  setRewardIds: (
    data: {
      id: number;
      rewardIds: number[];
    }[],
  ) => void;
  setWhitelistRewardIds: (
    data: {
      id: number;
      rewardId: number;
    }[],
  ) => void;
  isOpen: boolean;
  setCurrentQuest: (value: SetStateAction<ILoyaltyProject>) => void;
}

export const useCreateRewardsPopup = ({
  rewards,
  tokenContracts,
  nftCollections,
  questId,
  handleClose,
  setIsSuccessOpen,
  isLuckyDraw,
  luckyDrawUsersAmount,
  setVerified,
  setRewardIds,
  setWhitelistRewardIds,
  isOpen,
  questTitle,
  setCurrentQuest,
}: Props) => {
  const [rewardsVerified, setRewardsVerified] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [verifiedRewards, setVerifiedRewards] = useState<number[]>([]);
  const [createdRewards, setCreatedRewards] = useState<
    { id: number; rewardIds: number[] }[]
  >([]);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
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

  const rewardsAsArray = useMemo(
    () =>
      Object.values(rewards).filter(
        item => !item.verified || item.activeTab === ERewardTabs.WHITELIST,
      ),
    [rewards],
  );

  const tokenRewards = useMemo(
    () => rewardsAsArray.filter(item => item.activeTab === ERewardTabs.TOKEN),
    [rewardsAsArray],
  );

  const nftRewards = useMemo(
    () => rewardsAsArray.filter(item => item.activeTab === ERewardTabs.NFT),
    [rewardsAsArray],
  );

  useEffect(() => {
    setRewardsVerified(false);
  }, [isOpen]);

  const whitelistRewards = useMemo(
    () =>
      rewardsAsArray.filter(item => item.activeTab === ERewardTabs.WHITELIST),
    [rewardsAsArray],
  );

  const hasTokens = useMemo(
    () => Boolean(tokenRewards.length),
    [tokenRewards.length],
  );

  const hasNfts = useMemo(() => Boolean(nftRewards.length), [nftRewards]);

  const hasWhitelists = useMemo(
    () => Boolean(whitelistRewards.length),
    [whitelistRewards.length],
  );

  const steps: ERewardTabs[] = useMemo(() => {
    const result = [];

    if (hasTokens) result.push(ERewardTabs.TOKEN);
    if (hasNfts) result.push(ERewardTabs.NFT);
    if (hasWhitelists) result.push(ERewardTabs.WHITELIST);

    return result;
  }, [hasNfts, hasTokens, hasWhitelists]);

  const [currentStep, setCurrentStep] = useState<ERewardTabs>(steps[0]);

  useEffect(() => {
    setCurrentStep(steps[0]);
  }, [steps]);

  const getCurrentReward = useCallback(
    (rewardId: number) => {
      return rewards[rewardId];
    },
    [rewards],
  );

  const getContract = useCallback(
    (reward: ICreateReward) =>
      getDefaultContract({ reward, tokenContracts, nftCollections }),
    [nftCollections, tokenContracts],
  );

  const needConnect = useMemo(
    () =>
      !isConnected ||
      !wallet ||
      address.toLocaleLowerCase() !== wallet.toLocaleLowerCase(),
    [address, isConnected, wallet],
  );

  const getNeedSwitchChain = useCallback(
    (chainId: `0x${string}`) =>
      !chainId || chain?.id !== fromHex(chainId, "number"),
    [chain?.id],
  );

  const getTotalRewardAmount = useCallback(
    (rewardId: number) => {
      const currentReward = rewards[rewardId];

      if (!currentReward) return 0;

      const rewardData =
        currentReward.activeTab === ERewardTabs.TOKEN
          ? currentReward.token
          : currentReward.nft;

      return isLuckyDraw
        ? luckyDrawUsersAmount * rewardData.luckyDrawAmount
        : rewardData.rewards.reduce((acc, item, index) => {
            const prevItem = rewardData.rewards[index - 1];

            const amount =
              (item.endPlace - (prevItem?.endPlace || 0)) * item.amount;

            return acc + amount;
          }, 0);
    },
    [isLuckyDraw, luckyDrawUsersAmount, rewards],
  );

  const whitelistNames = useMemo(
    () => whitelistRewards.map(item => item.whitelist.name),
    [whitelistRewards],
  );

  useEffect(() => {
    if (
      currentStep === ERewardTabs.TOKEN &&
      tokenRewards.every(item => verifiedRewards.includes(item.id))
    ) {
      if (hasNfts) {
        setCurrentStep(ERewardTabs.NFT);
      } else if (hasWhitelists) {
        setCurrentStep(ERewardTabs.WHITELIST);
      } else {
        setRewardsVerified(true);
      }
    }
    if (
      nftRewards.every(item => verifiedRewards.includes(item.id)) &&
      currentStep === ERewardTabs.NFT
    ) {
      if (hasWhitelists) {
        setCurrentStep(ERewardTabs.WHITELIST);
      } else {
        setRewardsVerified(true);
      }
    }
  }, [
    currentStep,
    hasNfts,
    hasWhitelists,
    nftRewards,
    tokenRewards,
    verifiedRewards,
  ]);

  const confirmTokenReward = useCallback(
    async (rewardId: number) => {
      const currentReward = getCurrentReward(rewardId);

      if (!currentReward) return;

      await clearTabs(currentReward);

      const contract = getContract(currentReward);

      if (!contract) return;

      const needSwitchChain = getNeedSwitchChain(contract.chainId);

      if (needConnect || needSwitchChain) {
        setIsWalletPopupOpen(true);
        setChainToConnect(contract.chainId);
        return;
      }

      if (!walletClient || !publicClient || !CHAINS[contract.chainId]?.treasury)
        return;

      setConfirmLoading(true);

      const data = getCreateTokenRewardData({
        reward: currentReward,
        isLuckyDraw,
        luckyDrawUsersAmount,
        contractId: contract.id,
        questId,
      });

      try {
        const res = await adminRewardService.createTokenRewards(data);

        const {
          questId_,
          token_,
          amount_: quantity_,
          rewardIds_,
          signature_,
        } = res.data;

        setCreatedRewards(prev => {
          const newItem = { id: currentReward.id, rewardIds: rewardIds_ };

          return [...prev, newItem];
        });

        setRewardIds([{ id: currentReward.id, rewardIds: rewardIds_ }]);

        const amountWithDecimals = exponentToNumber(
          quantity_ * 10 ** (contract?.decimals || 0),
        );

        const verifyResult = await publicClient.readContract({
          address: contract.address,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [
            walletClient.data.account.address,
            CHAINS[contract.chainId].treasury,
          ],
          account: walletClient.data.account.address,
        });

        const wasRewardsApproved =
          Number(verifyResult) >= Number(amountWithDecimals);

        if (!wasRewardsApproved) {
          const { request: approveRequest } =
            await publicClient.simulateContract({
              abi: ERC20_ABI,
              address: contract.address,
              functionName: "approve",
              chain,
              args: [CHAINS[contract.chainId].treasury, amountWithDecimals],
              account: walletClient.data.account.address,
            });

          const txHash = await walletClient.data.writeContract(approveRequest);

          await new Promise(resolve => {
            const interval = setInterval(async () => {
              try {
                const transaction = await publicClient.getTransactionReceipt({
                  hash: txHash,
                });
                if (!transaction) return;
                clearInterval(interval);
                resolve(transaction);
              } catch (error) {
                console.log(error);
              }
            }, 1000);
          });
        }

        const { request: addRewardRequest } =
          await publicClient.simulateContract({
            abi: TREASURY_ABI,
            address: CHAINS[contract.chainId].treasury,
            functionName: "addERC20Reward",
            chain,
            args: [
              questId_,
              token_,
              amountWithDecimals,
              rewardIds_,
              signature_,
            ],
            account: walletClient.data.account.address,
          });

        await walletClient.data.writeContract(addRewardRequest);

        await new Promise(resolve => {
          const interval = setInterval(async () => {
            const verifyResult = await adminRewardService.verifyRewards(
              questId,
            );

            const chainRewards = verifyResult.data[contract.chainId];

            const wasRewardsVerified = rewardIds_.every(item => {
              const verifiedItem = chainRewards.find(
                chainRewardItem => chainRewardItem.rewardId === item,
              );

              return verifiedItem?.isVerified;
            });

            if (!wasRewardsVerified) return;

            clearInterval(interval);
            resolve(verifyResult.data);
          }, 1000);
        });

        setVerifiedRewards(prev => {
          const newState = [...prev];
          newState.push(rewardId);

          return newState;
        });
      } catch (error) {
        console.log(error);
      } finally {
        setConfirmLoading(false);
      }
    },
    [
      getCurrentReward,
      getContract,
      getNeedSwitchChain,
      needConnect,
      walletClient,
      publicClient,
      isLuckyDraw,
      luckyDrawUsersAmount,
      questId,
      setRewardIds,
      chain,
    ],
  );

  const confirmNftReward = useCallback(
    async (rewardId: number) => {
      const currentReward = getCurrentReward(rewardId);

      if (!currentReward) return;

      await clearTabs(currentReward);

      const contract = getContract(currentReward);

      if (!contract) return;

      const needSwitchChain = getNeedSwitchChain(contract.chainId);

      if (needConnect || needSwitchChain) {
        setIsWalletPopupOpen(true);
        setChainToConnect(contract.chainId);
        return;
      }

      if (!walletClient || !publicClient || !CHAINS[contract.chainId]?.treasury)
        return;

      setConfirmLoading(true);

      const data = getCreateNftRewardData({
        reward: currentReward,
        isLuckyDraw,
        luckyDrawUsersAmount,
        contractId: contract.id,
        questId,
      });

      try {
        const res = await adminRewardService.createNftReward(
          typeof currentReward.nft.image === "string"
            ? { ...data, image: currentReward.nft.image }
            : data,
          currentReward.nft.image as File,
        );

        const {
          questId_,
          token_,
          amount_: quantity_,
          rewardIds_,
          nonce_,
          collectionSignature_,
          treasurySignature_,
        } = res.data;

        setCreatedRewards(prev => {
          const newItem = { id: currentReward.id, rewardIds: rewardIds_ };

          return [...prev, newItem];
        });

        setRewardIds([{ id: currentReward.id, rewardIds: rewardIds_ }]);

        const { request } = await publicClient.simulateContract({
          abi: TREASURY_ABI,
          address: CHAINS[contract.chainId].treasury,
          functionName: "mintERC721Reward",
          chain: chain,
          args: [
            questId_,
            token_,
            quantity_,
            rewardIds_,
            nonce_,
            collectionSignature_,
            treasurySignature_,
          ],
          account: walletClient.data.account.address,
        });

        await walletClient.data.writeContract(request);

        await new Promise(resolve => {
          const interval = setInterval(async () => {
            const verifyResult = await adminRewardService.verifyRewards(
              questId,
            );

            const chainRewards = verifyResult.data[contract.chainId];

            const wasRewardsVerified = rewardIds_.every(item => {
              const verifiedItem = chainRewards.find(
                chainRewardItem => chainRewardItem.rewardId === item,
              );

              return verifiedItem?.isVerified;
            });

            if (!wasRewardsVerified) return;

            clearInterval(interval);
            resolve(verifyResult.data);
          }, 1000);
        });

        setVerifiedRewards(prev => {
          const newState = [...prev];
          newState.push(rewardId);

          return newState;
        });
      } catch (error) {
        console.log(error);
      } finally {
        setConfirmLoading(false);
      }
    },
    [
      getCurrentReward,
      getContract,
      getNeedSwitchChain,
      needConnect,
      walletClient,
      publicClient,
      isLuckyDraw,
      luckyDrawUsersAmount,
      questId,
      setRewardIds,
      chain,
    ],
  );

  const confirmWhitelistRewards = useCallback(async () => {
    try {
      setConfirmLoading(true);

      const data = getCreateWhitelistRewardData({
        rewards: rewardsAsArray,
        questId,
      });

      for (const id of data.ids) {
        await clearTabs(rewards[id]);
      }

      const { data: whitelistsData } =
        await adminRewardService.createWhitelistRewards(data.data);

      setWhitelistRewardIds(
        data.ids.map((item, index) => ({
          id: item,
          rewardId: whitelistsData[index]?.id,
        })),
      );

      for (const item of rewardsAsArray) {
        if (item.activeTab !== ERewardTabs.WHITELIST) continue;
        setVerified(item.id, true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setConfirmLoading(false);
    }
  }, [questId, rewards, rewardsAsArray, setVerified, setWhitelistRewardIds]);

  const onClose = useCallback(
    (cb: (quest: ILoyaltyProject) => void) => {
      verifiedRewards.forEach(item => setVerified(item, true));
      setRewardIds(createdRewards);

      loyaltyService
        .getLoyaltyProjectData(questTitle)
        .then(res => res.data)
        .then(cb);

      handleClose();
    },
    [
      createdRewards,
      handleClose,
      questTitle,
      setRewardIds,
      setVerified,
      verifiedRewards,
    ],
  );

  const completeConfirmation = useCallback(
    async (cb: (quest: ILoyaltyProject) => void) => {
      if (hasWhitelists) {
        await confirmWhitelistRewards();
      }

      try {
        const { data: newCurrentQuest } = await adminQuestService.updateQuest(
          {
            questStatus: QuestStatus.Active,
          },
          questTitle,
        );
        setCurrentQuest(newCurrentQuest);
      } catch (error) {
        console.log("save quest error", error);
      }

      onClose(cb);
      setIsSuccessOpen(true);
    },
    [
      hasWhitelists,
      onClose,
      setIsSuccessOpen,
      confirmWhitelistRewards,
      questTitle,
      setCurrentQuest,
    ],
  );

  const onConfirmClick = useMemo(() => {
    if (currentStep === ERewardTabs.TOKEN) return confirmTokenReward;
    if (currentStep === ERewardTabs.NFT) return confirmNftReward;
    return () => {};
  }, [confirmNftReward, confirmTokenReward, currentStep]);

  const currentStepIndex = useMemo(
    () => steps.indexOf(currentStep),
    [currentStep, steps],
  );

  const getButtonName = useCallback(
    (chainId: `0x${string}`) => {
      if (needConnect) {
        return "Connect wallet";
      }

      const needSwitchChain = getNeedSwitchChain(chainId);

      if (needSwitchChain) {
        return "Switch network";
      }
      return "Confirm Reward";
    },
    [getNeedSwitchChain, needConnect],
  );

  return {
    currentStep,
    onConfirmClick,
    rewardsVerified,
    confirmLoading,
    isNetworkLoading,
    isConnectLoading,
    whitelistNames,
    steps,
    currentStepIndex,
    completeConfirmation,
    onClose,
    chainToConnect,
    isWalletPopupOpen,
    setIsWalletPopupOpen,
    needConnect,
    getNeedSwitchChain,
    tokenRewards,
    nftRewards,
    getContract,
    getTotalRewardAmount,
    getButtonName,
    verifiedRewards,
  };
};
