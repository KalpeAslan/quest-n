import { Interface } from 'ethers';
import { blockchainService } from '../../../blockchain/blockchain';
import { LoyaltyTask } from '../../../../../db/entity';
import { DEXTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { RequestLogger } from '../../../logger';
const logger = new RequestLogger();

export const isDEXLoyaltyTaskLiquidityProvider = async (wallet: string, loyaltyTask: LoyaltyTask) => {
  const body = loyaltyTask.body as DEXTaskBody;

  const { contractAddress, methodAbi, chainId } = body;
  const transactions = await blockchainService.getTransactionOfWalletByContractAddressAndFilter({
    wallet,
    chainId: chainId,
    contractAddress: contractAddress,
  });
  const contractInterface = new Interface(methodAbi);

  if (!transactions || transactions.length === 0) {
    logger.info(
      { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
      { additionalData: `Transaction not found for wallet ${wallet} in task with ID ${loyaltyTask.id}` },
    );
    return {
      status: false,
    };
  }

  const completedTransactionHashes: string[] = [];

  transactions.forEach((transaction) => {
    const trx = transaction.logs.some((log) =>
      contractInterface.parseLog({ data: log.data, topics: log.topics.filter((log) => !!log) as string[] }),
    );
    if (trx) {
      completedTransactionHashes.push(transaction['hash']);
    }
  });

  if (!completedTransactionHashes.length) {
    logger.info(
      { originalUrl: `/api/loyalty-tasks/${loyaltyTask.id}/completed` },
      { additionalData: `Wallet ${wallet} is not a liquidity provider` },
    );
    return {
      status: false,
    };
  }

  let status = true;
  if (body.eventsQuantity && completedTransactionHashes.length < body.eventsQuantity) {
    status = false;
  } else {
    status = true;
  }

  console.log('completedTransactionHashes', completedTransactionHashes);
  const amount = completedTransactionHashes.length;
  return {
    status,
    json: {
      wallet,
      amount,
      transactions: completedTransactionHashes,
    },
  };
};
