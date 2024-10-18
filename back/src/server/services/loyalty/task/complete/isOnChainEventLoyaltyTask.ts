import { LoyaltyTask } from '../../../../../db/entity';
import { Networks } from '../../../../../db/types/interfaces/blockchain.types';
import { blockchainService } from '../../../blockchain/blockchain';
import { OnChainEventLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { Interface, ethers } from 'ethers';
import { constants } from '../../../../config/constants';
import { OnChainTaskProgressBody } from '../../../../../db/types/interfaces/taskProgress/onChainTask.type';

export const isOnChainEventLoyaltyTask = async (
  wallet: string,
  loyaltyTask: LoyaltyTask,
): Promise<{ status: boolean; json?: OnChainTaskProgressBody }> => {
  const body = loyaltyTask.body as OnChainEventLoyaltyTaskBody;
  const chainId = (loyaltyTask.body as OnChainEventLoyaltyTaskBody).chainId as Networks;
  const contractAbi = (loyaltyTask.body as OnChainEventLoyaltyTaskBody).abi;
  const eventName = (loyaltyTask.body as OnChainEventLoyaltyTaskBody).eventName;

  const network = constants.blockchain[chainId];
  const provider = new ethers.JsonRpcProvider(network.rpcUrl);

  const transactions = await blockchainService.getTransactions(wallet, chainId);
  const contractInterface = new Interface(contractAbi);

  const completedTransactionHashes: string[] = [];
  for (const transaction of transactions) {
    const receipt: any = await provider.getTransactionReceipt(transaction.hash);
    for (const log of receipt.logs) {
      const parsed = contractInterface.parseLog({ data: log.data, topics: log.topics });

      if (parsed && parsed.name.toLocaleLowerCase() == eventName.toLocaleLowerCase()) {
        const eventIndex: Record<string, number> = (parsed?.fragment.inputs || []).reduce(
          (index, eventParams, count) => {
            index[eventParams.name] = count;
            return index;
          },
          {},
        );

        let allConditionsFulfilled = true;
        for (const condition of (loyaltyTask.body as OnChainEventLoyaltyTaskBody).conditions) {
          if (!parsed.args[eventIndex[condition.fieldName]]) {
            allConditionsFulfilled = false;
          }

          if (
            Number(parsed.args[eventIndex[condition.fieldName]]) < condition.gt ||
            Number(parsed.args[eventIndex[condition.fieldName]]) > condition.lt
          ) {
            allConditionsFulfilled = false;
            break;
          }
        }
        completedTransactionHashes.push(transaction.hash);

        if (body.eventsQuantity && completedTransactionHashes.length < body.eventsQuantity) {
          allConditionsFulfilled = false;
        } else {
          allConditionsFulfilled = true;
        }

        if (allConditionsFulfilled) {
          return {
            status: true,
            json: {
              wallet,
              transactions: completedTransactionHashes,
            },
          };
        }
      }
    }
  }

  return {
    status: false,
  };
};
