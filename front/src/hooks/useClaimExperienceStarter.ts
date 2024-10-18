import { experienceService } from "@/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useConnect,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
  useWalletClient,
} from "wagmi";
import { useTypedSelector } from "./useTypedSelector";
import { getAccountInfo } from "@/modules/account/store/account.selector";
import { fromHex } from "viem";
import { EXPERIENCE_ABI } from "@/modules/quest/components/createQuestSteps/RewardsStep/rewards.constants";

const useClaimExperienceStarter = () => {
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [chainToConnect, setChainToConnect] = useState<`0x${string}` | null>(
    null,
  );
  const [isShowClaimModal, setIsShowClaimModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { isLoading: isConnectLoading } = useConnect();
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { isLoading: isNetworkLoading } = useSwitchNetwork();

  const { wallet } = useTypedSelector(getAccountInfo);

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

  const getIsClaimed = useCallback(async () => {
    try {
      const { data } = await experienceService.verify();
      setIsClaimed(data.isProfileMinted);
    } catch (error) {
      console.log("error");
    }
  }, []);

  const claim = useCallback(async () => {
    if (isClaimed) return;
    try {
      if (needConnect) {
        setIsWalletPopupOpen(true);
      }

      setLoading(true);
      const { data } = await experienceService.mint();
      const { chainId, contractAddress, investorId, signature } = data;

      const needSwitchChain = getNeedSwitchChain(chainId);

      if (needConnect || needSwitchChain) {
        setIsWalletPopupOpen(true);
        setChainToConnect(chainId);
        return;
      }

      if (!walletClient || !publicClient) return;

      const { request } = await publicClient.simulateContract({
        abi: EXPERIENCE_ABI,
        address: contractAddress,
        functionName: "mintProfile",
        chain,
        args: [investorId, signature],
        account: walletClient.data.account.address,
      });

      await walletClient.data.writeContract(request);

      await new Promise(resolve => {
        const interval = setInterval(async () => {
          const {
            data: { isProfileMinted },
          } = await experienceService.verify();

          if (!isProfileMinted) return;

          setIsClaimed(true);
          setIsShowClaimModal(true);
          clearInterval(interval);
          resolve(isProfileMinted);
        }, 1000);
      });
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  }, [
    chain,
    getNeedSwitchChain,
    isClaimed,
    needConnect,
    publicClient,
    walletClient,
  ]);

  useEffect(() => {
    getIsClaimed();
  }, [getIsClaimed]);

  return {
    isClaimed,
    claim,
    isWalletPopupOpen,
    needConnect,
    getNeedSwitchChain,
    chainToConnect,
    setIsWalletPopupOpen,
    loading,
    isConnectLoading,
    isNetworkLoading,
    isShowClaimModal,
    setIsShowClaimModal,
  };
};

export default useClaimExperienceStarter;
