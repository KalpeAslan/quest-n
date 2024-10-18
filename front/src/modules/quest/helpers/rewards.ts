import { adminRewardService } from "@/api/services/admin/rewards";
import {
  ERewardTabs,
  IContract,
  ICreateNftRewardDto,
  ICreateReward,
  ICreateRewardPlacement,
  ICreateTokenRewardDto,
  ICreateWhitelistRewardDto,
  TCreateRewards,
} from "@/models";

export const copyReward = (reward: ICreateReward) => {
  const newReward: ICreateReward = JSON.parse(JSON.stringify(reward));
  newReward.nft.image = reward.nft.image;

  return newReward;
};

export const copyRewards = (rewards: TCreateRewards) => {
  const newRewards: TCreateRewards = JSON.parse(JSON.stringify(rewards));

  for (const key of Object.keys(newRewards)) {
    const oldReward = rewards[key] as ICreateReward;
    const newReward = newRewards[key] as ICreateReward;
    newReward.nft.image = oldReward.nft.image;
  }

  return newRewards;
};

export const getCreateTokenRewardData = ({
  reward,
  isLuckyDraw,
  luckyDrawUsersAmount,
  contractId,
  questId,
  isDraft,
}: {
  reward: ICreateReward;
  isLuckyDraw: boolean;
  luckyDrawUsersAmount: number;
  contractId: number;
  questId: number;
  isDraft?: boolean;
}) => {
  const rewardsPlacement: ICreateRewardPlacement[] = (
    isLuckyDraw
      ? [
          {
            id: reward.token.luckyDrawRewardId,
            amount: reward.token.luckyDrawAmount,
            startPlace: 1,
            endPlace: luckyDrawUsersAmount,
          },
        ]
      : reward.token.rewards.reduce((acc, item, index, arr) => {
          const startPlace = (arr[index - 1]?.endPlace || 0) + 1;

          const newItem: ICreateRewardPlacement = {
            id: item.id,
            amount: item.amount,
            startPlace,
            endPlace: item.endPlace,
          };

          return [...acc, newItem];
        }, [] as ICreateRewardPlacement[])
  ).filter(item => (isDraft ? !item.id : true));

  const data: ICreateTokenRewardDto = {
    contractId: reward.token.contractId || contractId,
    loyaltyProjectId: questId,
    rewards: rewardsPlacement,
  };

  return data;
};

export const getCreateNftRewardData = ({
  reward,
  isLuckyDraw,
  luckyDrawUsersAmount,
  contractId,
  questId,
  isDraft,
}: {
  reward: ICreateReward;
  isLuckyDraw: boolean;
  luckyDrawUsersAmount: number;
  contractId: number;
  questId: number;
  isDraft?: boolean;
}) => {
  const rewardsPlacement: ICreateRewardPlacement[] = (
    isLuckyDraw
      ? [
          {
            id: reward.nft.luckyDrawRewardId,
            amount: reward.nft.luckyDrawAmount,
            startPlace: 1,
            endPlace: luckyDrawUsersAmount,
          },
        ]
      : reward.nft.rewards.reduce((acc, item, index, arr) => {
          const startPlace = (arr[index - 1]?.endPlace || 0) + 1;

          const newItem: ICreateRewardPlacement = {
            id: item.id,
            amount: item.amount,
            startPlace,
            endPlace: item.endPlace,
          };

          return [...acc, newItem];
        }, [] as ICreateRewardPlacement[])
  ).filter(item => (isDraft ? !item.id : true));

  const data: ICreateNftRewardDto = {
    name: reward.nft.name,
    contractId: reward.nft.contractId || contractId,
    loyaltyProjectId: questId,
    rewards: rewardsPlacement,
  };

  return data;
};

export const getCreateWhitelistRewardData = ({
  rewards,
  questId,
}: {
  rewards: ICreateReward[];
  questId: number;
}) => {
  const data = rewards.reduce(
    (acc, item) => {
      if (item.activeTab !== ERewardTabs.WHITELIST) return acc;
      return {
        data: [
          ...acc.data,
          {
            id: item.whitelist.rewardId,
            name: item.whitelist.name,
            description: item.whitelist.description,
            loyaltyProjectId: questId,
            startPlace: 1,
            endPlace: item.whitelist.endPlace,
          },
        ],
        ids: [...acc.ids, item.id],
      };
    },
    { data: [], ids: [] } as {
      data: ICreateWhitelistRewardDto[];
      ids: number[];
    },
  );

  return data;
};

export const getDefaultContract = ({
  reward,
  tokenContracts,
  nftCollections,
}: {
  reward: ICreateReward;
  tokenContracts: IContract[];
  nftCollections: IContract[];
}) => {
  if (reward.activeTab === ERewardTabs.WHITELIST) return null;

  const contracts =
    reward.activeTab === ERewardTabs.TOKEN ? tokenContracts : nftCollections;

  const rewardData =
    reward.activeTab === ERewardTabs.TOKEN ? reward.token : reward.nft;

  return (
    contracts.find(item => item.id === rewardData.contractId) || contracts[0]
  );
};

export const clearTabs = async (reward: ICreateReward) => {
  if (reward.activeTab !== ERewardTabs.TOKEN) {
    for (const item of reward.token.rewards) {
      if (item.id) {
        await adminRewardService.deleteReward(item.id);
      }
    }
  }

  if (reward.activeTab !== ERewardTabs.NFT) {
    for (const item of reward.nft.rewards) {
      if (item.id) {
        await adminRewardService.deleteReward(item.id);
      }
    }
  }

  if (reward.activeTab !== ERewardTabs.WHITELIST && reward.whitelist.rewardId) {
    await adminRewardService.deleteReward(reward.whitelist.rewardId);
  }
};

export const exponentToNumber = (x: number | string) => {
  if (Math.abs(Number(x)) < 1.0) {
    const e = parseInt(x.toString().split("e-")[1]);
    if (e) {
      x = Number(x) * Math.pow(10, e - 1);

      x = "0." + new Array(e).join("0") + x.toString().substring(2);
    }
  } else {
    let e = parseInt(x.toString().split("+")[1]);
    if (e > 20) {
      e -= 20;
      x = Number(x) / Math.pow(10, e);
      x = Number(x) + new Array(e + 1).join("0");
    }
  }
  return x;
};
