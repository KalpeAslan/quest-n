import { ethers } from 'ethers';
import { constants } from '../../config/constants';
import { InternalServerError, InternalServerErrorKeys } from '../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { erc20Abi } from '../../config/abiConstants';

export const getName = async (contractAddress: string, chainId: string) => {
  const network = constants.blockchain[chainId];

  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);

  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
    const result = await contract.name();

    return result as string;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching name');
  }
};

export const getSymbol = async (contractAddress: string, chainId: string) => {
  const network = constants.blockchain[chainId];

  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);

  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
    const result = await contract.symbol();

    return result as string;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching symbol');
  }
};

export const getDecimals = async (contractAddress: string, chainId: string) => {
  const network = constants.blockchain[chainId];

  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);

  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, erc20Abi, provider);
    const result = await contract.decimals();

    return Number(result);
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching decimals');
  }
};
