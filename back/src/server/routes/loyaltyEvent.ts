import express from 'express';
import { getLoyaltyEvent } from '../services/loyaltyEvent';
import { RequestLogger } from '../services/logger';

const logger = new RequestLogger();

export const loyaltyEvent = express.Router();

loyaltyEvent.get('/loyalty-event', async (req, res, next) => {
  try {
    const events = await getLoyaltyEvent();
    logger.info(req, { response: { events } });
    res.send(events);
  } catch (err) {
    next(err);
  }
});
