import { alphaDeployerAbi } from '../../../config/abiConstants';

import { constants } from '../../../config/constants';
import { NotFoundError, NotFoundErrorKeys } from '../../../errors/NotFoundError';
import { InternalServerError, InternalServerErrorKeys } from '../../../errors';
import { ethers } from 'ethers';

export const getHashFromDeployer = async (contractAddress: string, chainId: string, hashBody) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const userId: any = hashBody.userId;
    const collectionId: any = hashBody.collectionId;
    const name = hashBody.name;
    const symbol = hashBody.symbol;
    const baseUri = hashBody.baseUri;
    const transferable = hashBody.transferable;

    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, alphaDeployerAbi, provider);
    const result = await contract.getMessageHash(userId, collectionId, name, symbol, baseUri, transferable);
    return result;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getHashFromDeployer');
  }
};

export const getCreatorCollections = async (contractAddress: string, chainId: string, investorId: any) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  try {
    const provider = new ethers.JsonRpcProvider(network.rpcUrl);
    const contract = new ethers.Contract(contractAddress, alphaDeployerAbi, provider);
    const creatorCollections: any = [];
    const result = await contract.getCreatorCollections(investorId);
    for (const elem of result) {
      creatorCollections.push([Number(elem[0]), elem[1]]);
    }
    return creatorCollections;
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getCreatorCollections');
  }
};
