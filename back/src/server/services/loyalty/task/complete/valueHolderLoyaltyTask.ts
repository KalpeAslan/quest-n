import { LoyaltyTask } from '../../../../../db/entity';
import { blockchainService } from '../../../blockchain/blockchain';
import { ValueHolderTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { RequestLogger } from '../../../logger';
const logger = new RequestLogger();

export const isValueHolderLoyaltyTask = async (wallet: string, loyaltyTask: LoyaltyTask) => {
  const loyaltyTaskBody = loyaltyTask.body as ValueHolderTaskBody;
  const usdValue = await blockchainService.getValuesInUsd(wallet, loyaltyTaskBody.chainId);

  if (usdValue < loyaltyTaskBody.minUSDValue) {
    logger.info(
      { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
      {
        additionalData: `USD value: ${usdValue}. USD value is less than required minimum`,
      },
    );
    return {
      status: false,
    };
  }

  return {
    status: true,
    json: { usdValue, wallet },
  };
};
