import express from 'express';
import { RequestLogger } from '../services/logger';
import { findAllAmbassadors, findOneAmbassador } from '../services/ambassador.service';
import { EAmbassadorMethods } from '../../db/types/interfaces/ambassador.types';

const logger = new RequestLogger();
export const ambassadorRouter = express.Router();

ambassadorRouter.get('/ambassadors', async (req, res, next) => {
  try {
    const { contact } = req.query;
    const ambassadors = await findAllAmbassadors(contact as string);
    logger.info(req, { response: { ambassadors } });
    return res.send({ ambassadors });
  } catch (e) {
    next(e);
  }
});

ambassadorRouter.get('/ambassadors/find', async (req, res, next) => {
  try {
    const { contact, method } = req.query;
    const ambassador = await findOneAmbassador(contact as string, method as EAmbassadorMethods);
    logger.info(req, { response: { ambassador } });
    res.send({ ambassador });
  } catch (e) {
    next(e);
  }
});
