import { LoyaltyTask } from '../../../../../db/entity';
import { blockchainService } from '../../../blockchain/blockchain';
import { TokenTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { RequestLogger } from '../../../logger';
const logger = new RequestLogger();

export const isTokenLoyaltyTask = async (wallet: string, loyaltyTask: LoyaltyTask, isNft?: boolean) => {
  const loyaltyTaskBody = loyaltyTask.body as TokenTaskBody;
  const tokenBalance = await blockchainService.getERC20TokenBalance(
    loyaltyTaskBody.address,
    wallet,
    loyaltyTaskBody.chainId,
  );

  const json = {
    tokenBalance,
    wallet,
  };

  if (tokenBalance < loyaltyTaskBody.minTokenAmount) {
    logger.info(
      { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
      {
        additionalData: `ERC20 tokenBalance: ${tokenBalance}. Token balance is less than required minimum`,
      },
    );
    return { status: false, json };
  }

  return { status: true, json };
};
