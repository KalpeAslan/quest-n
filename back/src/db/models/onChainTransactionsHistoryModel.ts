import { In, getRepository } from 'typeorm';
import { OnchainTransactionsHistory } from '../entity';
import { BaseRepositoryService } from './BaseRepository';

export class OnChainTransactionsHistoryModel extends BaseRepositoryService<OnchainTransactionsHistory> {
  constructor() {
    super(OnchainTransactionsHistory);
  }

  findOneByRewardIdAndInvestorId(rewardId: number, investorId: number) {
    return getRepository(OnchainTransactionsHistory).findOne({ investorId, loyaltyRewardId: rewardId });
  }

  getAllInvestorTransactionsByRewardIds(rewardIds: number[], investorId: number) {
    return getRepository(OnchainTransactionsHistory).find({ loyaltyRewardId: In(rewardIds), investorId });
  }

  updateTransactionHash(rewardId: number, investorId: number, transactionHash: string) {
    return getRepository(OnchainTransactionsHistory).update(
      { loyaltyRewardId: rewardId, investorId },
      { transactionHash },
    );
  }
}

export const onChainTransactionsHistoryModel = new OnChainTransactionsHistoryModel();
