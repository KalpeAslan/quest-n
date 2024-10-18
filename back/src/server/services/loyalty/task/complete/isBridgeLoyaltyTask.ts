import { Interface, getAddress, AbiCoder } from 'ethers';
import { blockchainService } from '../../../blockchain/blockchain';
import { LoyaltyTask } from '../../../../../db/entity';
import { BridgeTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';

export const isBridgeLoyaltyTask = async (wallet: string, loyaltyTask: LoyaltyTask) => {
  const { bridgeAddress, chainId, methodAbi, tokenAddress, threshold = 0 } = loyaltyTask.body as BridgeTaskBody;

  const transaction = await blockchainService.getTransactionsOfContractByMethodABI(
    bridgeAddress,
    methodAbi[0].name,
    chainId,
  );
  const contract = new Interface(methodAbi);
  const tx = transaction.find((tx) => {
    const parsed = contract.parseTransaction({ data: tx.input });
    const decodedValue = AbiCoder.defaultAbiCoder().decode(['bytes32'], parsed?.args[1]);
    const extractedAddress = '0x' + decodedValue[0].slice(26);
    const decodedTokenAddress = AbiCoder.defaultAbiCoder().decode(['bytes32'], parsed?.args[3]);
    const extractedTokenAddress = '0x' + decodedTokenAddress[0].slice(26);
    const amountMin = Number(parsed?.args[6]) / Math.pow(10, 6);

    const isAddressesCorrect =
      getAddress(extractedAddress).toLowerCase() === wallet.toLowerCase() &&
      getAddress(extractedTokenAddress).toLowerCase() === tokenAddress.toLowerCase();

    const computeIsAmountMinCorrect = () => {
      return threshold <= amountMin;
    };

    return isAddressesCorrect && computeIsAmountMinCorrect();
  });

  if (!tx) {
    return {
      status: false,
    };
  }

  return {
    status: !!tx,
    json: {
      wallet: wallet as string,
      amount: transaction ? 1 : 0,
      transaction: tx?.hash,
    },
  };
};
