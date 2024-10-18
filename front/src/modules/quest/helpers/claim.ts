import { CHAINS } from "@/models";
import { createPublicClient, http } from "viem";
import { TREASURY_ABI } from "../components/createQuestSteps/RewardsStep/rewards.constants";

export const getClaimingStatus = async (
  questId: number,
  rewardId: number,
  userId: number,
  chainId: string,
) => {
  const network = CHAINS[chainId];
  if (!network?.wagmiChain || !network?.treasury) return false;

  const publicClient = createPublicClient({
    chain: network.chain,
    transport: http(network.wagmiChain.rpcUrls.default.http[0]),
  });

  try {
    const result = await publicClient.readContract({
      address: network.treasury,
      abi: TREASURY_ABI,
      functionName: "getClaimingStatus",
      args: [questId, rewardId, userId],
    });

    return result as boolean;
  } catch (error) {
    return false;
  }
};
