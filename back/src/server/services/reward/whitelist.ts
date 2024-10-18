import { contractModel } from '../../../db/models';
import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';
import { TokenType } from '../../../db/types/interfaces/loyalty';
import { CreateWhitelistRewardDto } from '../../../db/types/interfaces/loyalty/reward';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { checkLoyaltyProjectOwnership } from '../loyalty/loyaltyProject';

export const createWhitelistReward = async (investorId: number, data: CreateWhitelistRewardDto) => {
  const loyaltyProject = checkLoyaltyProjectOwnership({ investorId, loyaltyProjectId: data.loyaltyProjectId });

  if (!loyaltyProject) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);

  if (data.id) {
    const oldReward = await loyaltyRewardModel.getById(data.id, ['contract']);

    if (oldReward?.contract?.investorId !== investorId)
      throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);

    const contract = await contractModel.update({ ...oldReward.contract, name: data.name });

    return loyaltyRewardModel.update({
      ...oldReward,
      description: data.description,
      startPlace: data.startPlace,
      endPlace: data.endPlace,
      contract,
    });
  }

  const contract = await contractModel.create({
    name: data.name,
    symbol: data.name,
    isVerified: true,
    type: TokenType.Whitelist,
    investorId,
  });

  return loyaltyRewardModel.create({
    amount: 1,
    startPlace: data.startPlace,
    endPlace: data.endPlace,
    description: data.description,
    loyaltyProjectId: data.loyaltyProjectId,
    contractId: contract.id,
    verified: true,
    investorId,
  });
};
