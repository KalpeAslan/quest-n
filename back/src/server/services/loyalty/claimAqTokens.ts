import { taskProgressModel, tokensStorageModel } from '../../../db/models';
import { loyaltyProjectModel } from '../../../db/models';
import { updateReferralProfile } from '../referralProfile';
import { updateTokensStorage } from '../tokenStorage';
import { tokensStorageHistoryModel } from '../../../db/models';
import { TokensStorageHistoryTypes } from '../../../db/types/interfaces/interface-index';

import { QuestType } from '../../../db/types/interfaces/loyalty';
import { luckyDrawProgressModel } from '../../../db/models/luckyDrawProgress.model';
import { LoyaltyProject, LoyaltyReward } from '../../../db/entity';
import { claimGuaranteedRewards } from './guaranteed.service';
import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';

export const claimAQTokens = async (loyaltyProjectsLinkTitle: string, investorId: number) => {
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitleShort(loyaltyProjectsLinkTitle);

  const rewards = await loyaltyRewardModel.getAllByProjectId(loyaltyProject.id);
  const aqRewards = rewards.filter((reward) => reward.contract.type === 'aq');

  if (loyaltyProject.projectType === QuestType.LuckyDraw) {
    const tokenStorage = await tokensStorageModel.getByInvestorId(investorId);
    const alreadyClaimed = await isClaimed(tokenStorage.id, loyaltyProject.id);
    if (!alreadyClaimed) {
      await claimLuckyDrawRewards(loyaltyProject, investorId, aqRewards);
    }
    return true;
  } else if (loyaltyProject.projectType === QuestType.Guaranteed) {
    const tokenStorage = await tokensStorageModel.getByInvestorId(investorId);
    const alreadyClaimed = await isClaimed(tokenStorage.id, loyaltyProject.id);
    if (!alreadyClaimed) {
      await claimGuaranteedRewards(loyaltyProject, investorId, aqRewards);
    }
    return true;
  } else {
    await claimScoreBoard(loyaltyProject, aqRewards, investorId);

    return true;
  }
};

const claimScoreBoard = async (loyaltyProject: LoyaltyProject, aqRewards: LoyaltyReward[], investorId) => {
  const tokenStorage = await tokensStorageModel.getByInvestorId(investorId);
  const alreadyClaimed = await isClaimed(tokenStorage.id, loyaltyProject.id);

  const investorProgress = await taskProgressModel.getInvestorScoreboardInfo(loyaltyProject.id, investorId);
  if (!alreadyClaimed && aqRewards.length > 0) {
    for (const reward of aqRewards) {
      if (reward.startPlace <= investorProgress.place && reward.endPlace >= investorProgress.place) {
        await updateReferralProfile(investorId, reward.amount)
          .then(() => updateTokensStorage(investorId, reward.amount))
          .then((tokenStorage) =>
            tokensStorageHistoryModel.updateTokensHistory({
              tokenAmount: reward.amount,
              tokenStorageId: tokenStorage.id,
              type: TokensStorageHistoryTypes.loyaltyProject,
              loyaltyProjectId: loyaltyProject.id,
            }),
          );
        return true;
      }
    }
  }
  return true;
};

const claimLuckyDrawRewards = async (
  loyaltyProject: LoyaltyProject,
  investorId: number,
  aqRewards: LoyaltyReward[],
) => {
  const luckyDrawProgress = await luckyDrawProgressModel.getByInvestorIdAndLoyaltyProjectId(
    investorId,
    loyaltyProject.id,
  );
  if (!luckyDrawProgress) {
    return false;
  }

  await Promise.all(
    aqRewards.map(async (reward) => {
      await updateReferralProfile(investorId, reward.amount)
        .then(() => updateTokensStorage(investorId, reward.amount))
        .then((tokenStorage) =>
          tokensStorageHistoryModel.updateTokensHistory({
            tokenAmount: reward.amount,
            tokenStorageId: tokenStorage.id,
            type: TokensStorageHistoryTypes.loyaltyProject,
            loyaltyProjectId: loyaltyProject.id,
          }),
        );
    }),
  );
  return true;
};

export const isClaimed = async (tokenStorageId: number, loyaltyProjectId: number) => {
  const storage = await tokensStorageHistoryModel.getByLoyaltyProjectId(tokenStorageId, loyaltyProjectId);
  return storage.length > 0;
};
