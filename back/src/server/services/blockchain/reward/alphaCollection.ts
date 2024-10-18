import { ethers } from 'ethers';
import { constants } from '../../../config/constants';
import { NotFoundError, NotFoundErrorKeys } from '../../../errors/NotFoundError';
import { InternalServerError, InternalServerErrorKeys } from '../../../errors';
import { alphaCollectionAbi } from '../../../config/abiConstants';

export const getTotalSupply = async (contractAddress: string, chainId: string) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, alphaCollectionAbi, provider);
    const result = await contract.totalSupply();

    return Number(result);
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getTotalSupply');
  }
};

export const getNonce = async (contractAddress: string, chainId: string) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, alphaCollectionAbi, provider);
    const result = await contract.nonce();

    return Number(result);
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching nonce');
  }
};

export const getMessageHash = async (
  contractAddress: string,
  chainId: string,
  to: string,
  totalAmount: number,
  sender: string,
  nonce: number,
) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, alphaCollectionAbi, provider);
    return await contract.getMessageHash(to, sender, `${totalAmount}`, nonce);
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getMessageHash');
  }
};
