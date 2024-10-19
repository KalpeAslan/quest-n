import { Router } from 'express';
import { twitterApiService } from '../services/apis/twitterApiService';
import { RequestLogger } from '../services/logger';
import { BadRequestError, BadRequestErrorKeys } from '../errors';

const logger = new RequestLogger();

export const twitter = Router();

twitter.get('/twitter/check-username', async (req, res, next) => {
  try {
    if (!req.query.username) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Invalid username');

    const userId = req.query.username;

    if (!userId) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Invalid username');

    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});
