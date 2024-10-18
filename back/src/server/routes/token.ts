import { Router } from 'express';
import { contractModel } from '../../db/models';
import { RequestLogger } from '../services/logger';
import { authMiddleware } from '../middlewares/authValidating';

const logger = new RequestLogger();
export const token = Router();

token.get('/token', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const result = await contractModel.getAllWithInvestorId(+investorId);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});
