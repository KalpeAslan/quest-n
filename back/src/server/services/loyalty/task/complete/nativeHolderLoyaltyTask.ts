import { LoyaltyTask } from '../../../../../db/entity';
import { blockchainService } from '../../../blockchain/blockchain';
import { NativeHolderTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { RequestLogger } from '../../../../services/logger';
const logger = new RequestLogger();

export const isNativeHolderLoyaltyTask = async (wallet: string, loyaltyTask: LoyaltyTask) => {
  const loyaltyTaskBody = loyaltyTask.body as NativeHolderTaskBody;
  const nativeTokenBalance = await blockchainService.getNativeTokenBalance(wallet, loyaltyTaskBody.chainId);

  if (nativeTokenBalance < loyaltyTaskBody.minValue) {
    logger.info(
      { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
      {
        additionalData: `Native token balance: ${nativeTokenBalance}. Native token balance is less than required minimum`,
      },
    );
    return {
      status: false,
    };
  }

  return {
    status: true,
    nativeTokenBalance,
  };
};
