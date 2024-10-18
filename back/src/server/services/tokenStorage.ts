import { Investor } from '../../db/entity';
import { tokensStorageModel } from '../../db/models/tokensStorageModel';

export const updateTokensStorage = async (investorId: Investor['id'], tokenAmount: number) => {
  let tokenStorage = await tokensStorageModel.getByInvestorId(investorId);
  if (!tokenStorage) {
    tokenStorage = await tokensStorageModel.create(investorId);
  }

  tokenStorage.amount = Number((tokenStorage.amount + tokenAmount).toFixed(2));
  tokenStorage = await tokensStorageModel.update(tokenStorage);

  return tokenStorage;
};
