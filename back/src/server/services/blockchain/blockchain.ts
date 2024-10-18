import Moralis from 'moralis';
import { getConfig } from '../../config';
import { Logger } from '../logger';
import { LogErrors } from '../../helpers/logError.decorator';
import axios from 'axios';
import { IEtherscanTx, Networks, NFTTypes } from '../../../db/types/interfaces/blockchain.types';
import { constants } from '../../config/constants';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { TokenType } from '../../../db/types/interfaces/loyalty';
import { TransactionReceipt } from '@ethersproject/abstract-provider';
import { ethers } from 'ethers';
import { InternalServerError, InternalServerErrorKeys, RateLimitError, RateLimitErrorKeys } from '../../errors';
import { erc20Abi } from '../../config/abiConstants';

const log = new Logger();

interface IBaseBlockchainParams {
  wallet: string;
  chainId: Networks;
}

interface IGetTokenBalanceOfWallet extends IBaseBlockchainParams {
  tokenAddress: string;
  isNft?: boolean;
}

interface IGetTransactionsOfWalletByContractAddressAndFilter extends IBaseBlockchainParams {
  contractAddress: string;
}

interface IGetTokenInfo {
  name: string;
  tokenType?: NFTTypes | null;
}

export class BlockchainService {
  constructor(moralisApiKey?: string) {
    (async () => await this.initMoralis(moralisApiKey))();
  }

  @LogErrors(log)
  async getValuesInUsd(wallet, chainId): Promise<number> {
    const tokenAddresses = await this.getERC20TokensInWallet({ wallet, chainId });
    let totalValueInUSD = 0;
    for (const tokenAddress of tokenAddresses) {
      let tokenPrice;
      try {
        tokenPrice = await Moralis.EvmApi.token.getTokenPrice({
          chain: chainId,
          address: tokenAddress.token_address,
        });
        const tokenValueInUSD = this.fixNumber(tokenAddress.balance, tokenAddress.decimals) * tokenPrice.raw.usdPrice;
        totalValueInUSD += tokenValueInUSD;
      } catch (e) {
        log.error('Token Price not found');
      }
    }

    return totalValueInUSD;
  }

  @LogErrors(log)
  getCoinsOfWallet({ wallet, chainId }: IBaseBlockchainParams): Promise<number> {
    return Moralis.EvmApi.balance
      .getNativeBalance({
        chain: chainId,
        address: wallet,
      })
      .then((res) => this.fixNumber(res.raw.balance));
  }

  async getTransactionOfWalletByContractAddressAndFilter({
    wallet,
    contractAddress,
    chainId,
  }: IGetTransactionsOfWalletByContractAddressAndFilter) {
    const transactions: TransactionReceipt[] = await this.getTransactions(wallet, chainId)
      .then((res) => res.filter((item) => item.to.toLowerCase() === contractAddress.toLowerCase() && item.isError != 1))
      .then((res) =>
        Promise.all(
          res.map(async (item) => {
            try {
              return await this.getTransactionsReceipts(item.hash, chainId);
            } catch (e) {
              log.error(`Error when trying to get Transaction receipt ${e.message}`);
              return null;
            }
          }),
        ),
      )
      .then((res) =>
        res.filter((transaction) => transaction && transaction.to?.toLowerCase() === contractAddress.toLowerCase()),
      );

    return transactions;
  }

  private beforeUsedApiKey: string;
  private computeBlockchainConf(chainId: Networks) {
    if (chainId === Networks.Ethereum || chainId === Networks.Goerli) {
      const apiKey = !this.beforeUsedApiKey || this.beforeUsedApiKey === 'apiKeyV2' ? 'apiKey' : 'apiKeyV2';
      this.beforeUsedApiKey = apiKey;
      return {
        scanLink: constants.blockchain[chainId].scanLink,
        apiKey,
      };
    }
    return constants.blockchain[chainId];
  }
  async getTransactionsOfContractByMethodABI(
    contractAddress: string,
    functionName: string,
    chainId: Networks,
  ): Promise<IEtherscanTx[]> {
    const { scanLink, apiKey } = this.computeBlockchainConf(chainId);

    const response: any = await axios
      .get(`${scanLink}/api?module=account&action=txlist&address=${contractAddress}&sort=asc&apikey=${apiKey}`)
      .then((res) => res.data);

    return response.result.filter((tx: IEtherscanTx) => tx.functionName.includes(functionName));
  }

  getABIOfContract(contractAddress: string, chainId: Networks) {
    const network = constants.blockchain[chainId];
    if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);

    const { scanLink, apiKey } = network;
    const url = `${scanLink}/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
    return axios.get(url).then((res) => {
      if (res.data.result) {
        const parsed = JSON.parse(res.data.result);
        return parsed.filter((item) => item.type === 'event');
      }
      return res.data.result;
    });
  }

  async getTokenInfo(
    contractAddress: string,
    chainId: Networks,
    tokenType: TokenType.Token | TokenType.Nft,
  ): Promise<IGetTokenInfo> {
    try {
      const network = constants.blockchain[chainId];
      if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      const abi = ['function symbol() view returns (string)'];

      const contract = new ethers.Contract(contractAddress, abi, provider);
      const symbol = await contract.symbol();

      return {
        name: symbol,
      };
    } catch (error) {
      throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getTokenInfo');
    }
  }

  async getTransactionCount(walletAddress: string, chainId: string): Promise<number> {
    try {
      const network = constants.blockchain[chainId];
      if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
      const { rpcUrl } = network;

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const transactionCount = await provider.getTransactionCount(walletAddress);
      return Number(transactionCount);
    } catch (error) {
      throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getTransactionCount');
    }
  }

  getNativeTokenBalance = async (walletAddress: string, chainId: string): Promise<number> => {
    try {
      const network = constants.blockchain[chainId];
      if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
      const { rpcUrl } = network;

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const balanceWei = await provider.getBalance(walletAddress);
      return Number(balanceWei) / 10 ** 18;
    } catch (error) {
      throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getNativeTokenBalance');
    }
  };

  getERC20TokenBalance = async (
    tokenContractAddress: string,
    walletAddress: string,
    chainId: string,
  ): Promise<number> => {
    try {
      const network = constants.blockchain[chainId];
      if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
      const { rpcUrl } = network;

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(tokenContractAddress, erc20Abi, provider);
      const result = Number(await contract.balanceOf(walletAddress));
      const decimals = Number(await contract.decimals());
      return result / 10 ** decimals;
    } catch (error) {
      throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getERC20TokenBalance');
    }
  };

  getERC721TokenBalance = async (
    tokenContractAddress: string,
    walletAddress: string,
    chainId: string,
  ): Promise<number> => {
    try {
      const network = constants.blockchain[chainId];
      if (!network) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
      const { rpcUrl } = network;

      const provider = new ethers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(tokenContractAddress, erc20Abi, provider);
      return Number(await contract.balanceOf(walletAddress));
    } catch (error) {
      throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getERC721TokenBalance');
    }
  };

  //private methods
  @LogErrors(log)
  private async initMoralis(apiKey) {
    return await Moralis.start({
      apiKey,
    });
  }

  @LogErrors(log)
  private async getERC20TokensInWallet({ wallet, chainId }: IBaseBlockchainParams) {
    const options = {
      chain: chainId,
      address: wallet,
    };

    return await Moralis.EvmApi.token.getWalletTokenBalances(options).then((res) => res.raw);
  }

  private getTransactionsReceipts(txHash: string, chainId: string) {
    const network = constants.blockchain[chainId];
    if (!network || !network.rpcUrl)
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `Network with id ${chainId} not implemented`);
    try {
      const provider = new ethers.JsonRpcProvider(network.rpcUrl);
      return provider.getTransactionReceipt(txHash);
    } catch (error) {
      log.error(`BlockchainService => getTransactionsReceipts(${txHash}, ${chainId}) | ${error}`);
      throw new RateLimitError(RateLimitErrorKeys.RpcNodeLimitIsUsed, 'Rate limit is used, try again later');
    }
  }

  @LogErrors(log)
  private fixNumber(number: string | number, decimals = 18 as number): number {
    return +number / Math.pow(10, decimals);
  }

  getTransactions = async (walletAddress: string, chainId: string) => {
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
      if (error.message === 'No transactions found') throw new NotFoundError(NotFoundErrorKeys.NotFound, error.message);
      throw new InternalServerError(InternalServerErrorKeys.Default, error.message);
    }
  };
}

export const blockchainService = new BlockchainService(getConfig().MORALIS_WEB3_API_KEY);
