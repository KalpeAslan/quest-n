import { LoyaltyTask } from '../../../../../db/entity';
import { blockchainService } from '../../../blockchain/blockchain';
import { BlockchainUserTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { RequestLogger } from '../../../logger';
const logger = new RequestLogger();

export const isBlockchainUserLoyaltyTask = async (wallet: string, loyaltyTask: LoyaltyTask) => {
  const loyaltyTaskBody = loyaltyTask.body as BlockchainUserTaskBody;
  const transactionCount = await blockchainService.getTransactionCount(wallet, loyaltyTaskBody.chainId);

  if (transactionCount < loyaltyTaskBody.minTransactions) {
    logger.info(
      { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
      {
        additionalData: `Transaction count: ${transactionCount}. Transaction count is less than required minimum`,
      },
    );
    return {
      status: false,
    };
  }

  return {
    status: true,
    json: { wallet, transactionCount },
  };
};
