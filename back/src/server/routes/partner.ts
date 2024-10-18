import express from 'express';
import { getPartners } from '../services/partner';
import { RequestLogger } from '../services/logger';

const logger = new RequestLogger();

export const partners = express.Router();

partners.get('/partners', async (req, res, next) => {
  try {
    const partners = await getPartners();
    logger.info(req, { response: { partners } });
    res.send(partners);
  } catch (err) {
    next(err);
  }
});
