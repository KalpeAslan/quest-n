import axios from 'axios';
import Web3 from 'web3';
const web3 = new Web3();

import { constants } from '../config/constants';
import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';
import { InternalServerError, InternalServerErrorKeys } from '../errors';
import { ethers } from 'ethers';

export const getTransactions = async (walletAddress, chainId) => {
  const network = constants.blockchain[chainId];
  if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
  const { scanLink, apiKey } = network;
  const url = `${scanLink}/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === '1') {
      return response.data.result;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching transaction count');
  }
};

export const getNativeTokenPriceInUSD = async (chainId) => {
  const coinIds = {
    '0x1': 'ethereum',
    '0x89': 'polygon-pos',
    '0x38': 'binancecoin',
    '0xa86a': 'avalanche-2',
    '0xa4b1': 'arbitrum',
    '0xa': 'optimism',
    '0x141': 'kucoin-shares',
    '0x42': 'okexchain',
    '0x5': 'ethereum',
    '0x7f08': 'bitrise-token',
  };

  const coinId = coinIds[chainId];
  if (!coinId) throw new Error(`CoinId not found for chainId ${chainId}`);

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    return response.data[coinId].usd;
  } catch (error) {
    throw new Error('Error fetching token price in USD');
  }
};
