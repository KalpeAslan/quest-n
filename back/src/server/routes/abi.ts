import express from 'express';
import { RequestLogger } from '../services/logger';
const logger = new RequestLogger();
import { blockchainService } from '../services/blockchain/blockchain';
import { Networks } from '../../db/types/interfaces/blockchain.types';
import { TokenType } from '../../db/types/interfaces/loyalty';

export const abiFunctions = express.Router();

abiFunctions.get('/abi-of-contract/:address', async (req, res, next) => {
  try {
    const address = req.params.address;
    const chainId = (req.query.chainId as unknown as Networks) || Networks.Ethereum;
    const abi = await blockchainService.getABIOfContract(address, chainId);
    logger.info(req, { response: { abi } });
    res.send({ abi });
  } catch (err) {
    next(err);
  }
});

abiFunctions.get('/abi-of-contract/token/:address', async (req, res, next) => {
  try {
    const address = req.params.address;
    const chainId = (req.query.chainId as unknown as Networks) || Networks.Ethereum;
    const tokenType = (req.query.tokenType as unknown as TokenType.Nft | TokenType.Token) || TokenType.Token;
    const tokenInfo = await blockchainService.getTokenInfo(address, chainId, tokenType);
    logger.info(req, { response: { name: tokenInfo.name, tokenType: tokenInfo.tokenType } });
    res.send({ name: tokenInfo.name });
  } catch (e) {
    next(e);
  }
});
