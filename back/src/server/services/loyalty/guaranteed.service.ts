import { LoyaltyProject, LoyaltyReward } from '../../../db/entity';
import { tokensStorageHistoryModel } from '../../../db/models';
import { updateReferralProfile } from '../referralProfile';
import { updateTokensStorage } from '../tokenStorage';
import { TokensStorageHistoryTypes } from '../../../db/types/interfaces/interface-index';

export const claimGuaranteedRewards = async (
  loyaltyProject: LoyaltyProject,
  investorId: number,
  aqRewards: LoyaltyReward[],
) => {
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
