import { LoyaltyTask } from '../../../../../db/entity';
import { blockchainService } from '../../../blockchain/blockchain';
import { NFTTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { RequestLogger } from '../../../../services/logger';
const logger = new RequestLogger();

export const isNftLoyaltyTask = async (wallet: string, loyaltyTask: LoyaltyTask, isNft?: boolean) => {
  const loyaltyTaskBody = loyaltyTask.body as NFTTaskBody;
  const tokenBalance = await blockchainService.getERC721TokenBalance(
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
        additionalData: `ERC721 tokenBalance: ${tokenBalance}. Token balance is less than required minimum`,
      },
    );
    return { status: false, json };
  }

  return { status: true, json };
};
