import express from 'express';

import { RequestLogger } from '../services/logger';
import { contractModel } from '../../db/models';
import { getCreatorCollections } from '../services/blockchain/reward/alphaDeployer';
import { constants } from '../config/constants';
import { createNftContract, insertTokenContract } from '../services/contracts';
import { fileUpload } from '../middlewares/fileUpload';
import { bodyValidator } from '../helpers';
import { CreateContractDto, CreateTokenContractDto } from '../../db/types/interfaces/contractDto';
import { TokenType } from '../../db/types/interfaces/loyalty';
import { dtoValidationMiddleware } from '../middlewares/dtoValidating';
import { authMiddleware } from '../middlewares/authValidating';
const logger = new RequestLogger();

export const contract = express.Router();

contract.get('/contracts', async (req, res, next) => {
  try {
    const standards = req.query.standard ? req.query.standard.toString().split(',') : ['erc20', 'erc721', 'erc1155'];
    const contracts = await contractModel.getAllWithStandards(standards, req['investorId']);
    logger.info(req, { contracts });
    res.send(contracts);
  } catch (err) {
    next(err);
  }
});

contract.get('/contracts/verify', async (req, res, next) => {
  try {
    const result = {};
    for (const chainId of Object.keys(constants.blockchain)) {
      const alphaDeployer = constants.blockchain[chainId].alphaDeployerContract;
      if (!alphaDeployer) {
        continue;
      }

      const creatorCollections = await getCreatorCollections(alphaDeployer, chainId, req['investorId']);

      for (const creatorCollection of creatorCollections) {
        await contractModel.updateParams(creatorCollection[0], { address: creatorCollection[1], isVerified: true });
      }
      result[chainId] = creatorCollections;
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});

contract.post(
  '/contracts/token',
  authMiddleware,
  dtoValidationMiddleware(CreateTokenContractDto),
  async (req, res, next) => {
    try {
      const result = await insertTokenContract(req['investorId'], req.body);
      res.send(result);
    } catch (error) {
      next(error);
    }
  },
);

contract.post('/contracts/nft', fileUpload('file').single('logo'), authMiddleware, async (req, res, next) => {
  const data: CreateContractDto = JSON.parse(req.body.data);
  const image = req.file;

  data.type = TokenType.Nft;
  const validatedDtoData = await bodyValidator(CreateContractDto, data);
  try {
    const result = await createNftContract(req['investorId'], image, validatedDtoData);
    res.send(result);
  } catch (error) {
    next(error);
  }
});
