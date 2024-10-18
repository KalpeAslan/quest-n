import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';
import { TokenType } from '../../../db/types/interfaces/loyalty';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { getRewardVerified } from '../blockchain/reward/alphaTreasury';

export const updateVerified = async (questId: number) => {
  const rewards = await loyaltyRewardModel.getAllByProjectId(questId);
  if (!rewards.length) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Quest rewards not found');

  const groupedRewards: Record<string, number[]> = {};

  for (const reward of rewards) {
    if (!reward.contract.chainId) continue;

    if (!groupedRewards[reward.contract.chainId]) {
      groupedRewards[reward.contract.chainId] = [reward.id];
    } else {
      groupedRewards[reward.contract.chainId].push(reward.id);
    }
  }

  const result: Record<string, { rewardId: number; isVerified: boolean }[]> = {};
  for (const chainId of Object.keys(groupedRewards)) {
    result[chainId] = [];

    const verifiedRewards = await getRewardVerified(chainId, groupedRewards[chainId]);
    for (let i = 0; i < groupedRewards[chainId].length; i++) {
      const isVerified = verifiedRewards[i];
      const rewardId = groupedRewards[chainId][i];

      await loyaltyRewardModel.updateById(rewardId, { verified: isVerified });

      result[chainId].push({
        rewardId,
        isVerified,
      });
    }
  }

  return result;
};

export const deleteReward = async (investorId: number, rewardId: number) => {
  const reward = await loyaltyRewardModel.getById(rewardId, ['contract']);

  if (
    !reward ||
    (!reward.contract.chainId && reward.contract.type !== TokenType.Whitelist) ||
    reward.investorId !== investorId
  ) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Quest reward not found');
  }

  let verified = false;

  if (reward.contract.chainId) {
    [verified] = await getRewardVerified(reward.contract.chainId, [rewardId]);

    if (verified && !reward.verified) {
      await loyaltyRewardModel.updateById(rewardId, { verified: true });
    }
  }

  if ((reward.verified || verified) && reward.contract.type !== TokenType.Whitelist) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Reward is already verified, unable to delete');
  }

  await loyaltyRewardModel.deleteById(rewardId);
};
