import { ethers } from 'ethers';
import { constants } from '../../../config/constants';
import { NotFoundError, NotFoundErrorKeys } from '../../../errors/NotFoundError';
import { InternalServerError, InternalServerErrorKeys } from '../../../errors';
import { alphaTreasuryAbi } from '../../../config/abiConstants';
import { RequestLogger } from '../../logger';

const logger = new RequestLogger();

export const getErc20Hash = async (tokenAddress: string, chainId: string, amount: number | string) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);

  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const messageHash = await contract.getERC20Hash(tokenAddress, `${amount}`);
    return messageHash;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getErc20Hash');
  }
};

export const getErc721Hash = async (tokenAddress: string, chainId: string, tokenIds: number[]): Promise<string> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);

  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const messageHash = await contract.getERC721Hash(tokenAddress, tokenIds);
    return messageHash;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getErc721Hash');
  }
};

export const getERC1155Hash = async (
  tokenAddress: string,
  chainId: string,
  tokenIds: number[],
  tokenAmounts: number[],
): Promise<string> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);

  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const messageHash = await contract.getERC1155Hash(tokenAddress, tokenIds, tokenAmounts);
    return messageHash;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getERC1155Hash');
  }
};

export const getAdditionHash = async (chainId: string, questId: number, rewardHash: string, rewardIds: number[]) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const messageHash = await contract.getAdditionHash(questId, rewardIds, rewardHash);
    return messageHash;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getAdditionHash');
  }
};

export const getClaimHash = async (
  chainId: string,
  sender: string,
  questId: number,
  rewardId: number,
  investorId: number,
  rewardHash: string,
): Promise<string> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    logger.error('claimHash data', { sender, questId, rewardId, investorId, rewardHash });
    const messageHash = await contract.getClaimHash(sender, questId, rewardId, investorId, rewardHash);
    return messageHash;
  } catch (error) {
    logger.error('claimHash error', error);

    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getClaimHash');
  }
};

export const getRewardVerified = async (chainId: string, rewardIds: number[]): Promise<boolean[]> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const rewardStatuses = await contract.getRewardStatuses(rewardIds);
    return rewardStatuses;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getRewardVerified');
  }
};

export const getQuestErc20Rewards = async (tokenAddress: string, chainId: string, questId: number): Promise<number> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const tokensAmount = await contract.getQuestERC20Rewards(questId, tokenAddress);
    return tokensAmount;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getQuestERC20Rewards');
  }
};

export const getQuestErc721Rewards = async (
  tokenAddress: string,
  chainId: string,
  questId: number,
): Promise<bigint[]> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const tokenIds = await contract.getQuestERC721Rewards(questId, tokenAddress);
    return tokenIds;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getQuestERC721Rewards');
  }
};

export const getQuestERC1155Rewards = async (
  tokenAddress: string,
  chainId: string,
  questId: number,
): Promise<bigint[]> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const tokenIds = await contract.getQuestERC1155Rewards(questId, tokenAddress);
    return tokenIds;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getQuestERC1155Rewards');
  }
};

export const getClaimingStatus = async (
  chainId: string,
  questId: number,
  rewardId: number,
  userId: number,
): Promise<boolean> => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(network.treasuryContract, alphaTreasuryAbi, provider);
    const claimingStatus = await contract.getClaimingStatus(questId, rewardId, userId);
    return claimingStatus;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getClaimingStatus');
  }
};
