import Web3 from 'web3';
import { LoyaltyReward } from '../../../db/entity';
import { contractModel } from '../../../db/models';
import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';
import { CreateTokenRewardDto } from '../../../db/types/interfaces/loyalty/reward';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { getErc20Hash, getAdditionHash, getRewardVerified } from '../blockchain/reward/alphaTreasury';
import { checkLoyaltyProjectOwnership } from '../loyalty/loyaltyProject';
import { getConfig } from '../../config';
import { exponentToNumber } from '../../helpers/common.utils';

const web3 = new Web3();

const { CONTRACT_PRIVATE_KEY } = getConfig();

export const createTokenRewards = async (investorId: number, data: CreateTokenRewardDto) => {
  const contract = await contractModel.getById(data.contractId);
  if ((contract?.investorId && contract?.investorId !== investorId) || !contract || !contract.address)
    throw new NotFoundError(NotFoundErrorKeys.NotFound, "Contract doesn't exist");
  await checkLoyaltyProjectOwnership({ investorId, loyaltyProjectId: data.loyaltyProjectId });

  let totalAmount = 0;
  const rewardIds: number[] = [];

  for (const rewardItem of data.rewards) {
    if (rewardItem.id && !rewardItem.verified) {
      const [verified] = await getRewardVerified(contract.chainId, [rewardItem.id]);

      if (verified) {
        await loyaltyRewardModel.updateById(rewardItem.id, { verified: true });
        continue;
      }

      await loyaltyRewardModel.deleteById(rewardItem.id);
    }

    totalAmount += (rewardItem.endPlace - rewardItem.startPlace + 1) * rewardItem.amount;

    const loyaltyReward = new LoyaltyReward();
    loyaltyReward.amount = rewardItem.amount;
    loyaltyReward.contractId = data.contractId;
    loyaltyReward.loyaltyProjectId = data.loyaltyProjectId;
    loyaltyReward.endPlace = rewardItem.endPlace;
    loyaltyReward.startPlace = rewardItem.startPlace;
    loyaltyReward.isClaimable = true;
    loyaltyReward.verified = false;
    loyaltyReward.description = '';

    const newLoyaltyReward = await loyaltyRewardModel.create({
      ...loyaltyReward,
      investorId,
    });

    rewardIds.push(newLoyaltyReward.id);
  }

  return {
    questId_: data.loyaltyProjectId,
    amount_: totalAmount,
    token_: contract.address,
    rewardIds_: rewardIds,
  };
};
