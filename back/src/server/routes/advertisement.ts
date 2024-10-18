import express from 'express';

import { getAdvertisements, getAdvertisementById } from '../services/advertisement';
import { RequestLogger } from '../services/logger';
import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';

const logger = new RequestLogger();
export const advertisement = express.Router();

advertisement.get('/advertisements', async (req, res, next) => {
  try {
    const advertisements = await getAdvertisements();
    logger.info(req, { advertisements });
    res.send(advertisements);
  } catch (err) {
    next(err);
  }
});

advertisement.get('/advertisements/:advertisementId', async (req, res, next) => {
  try {
    const { advertisementId } = req.params;

    if (!advertisementId) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no advertisementId');
    const advertisement = await getAdvertisementById(advertisementId);
    logger.info(req, { response: { advertisement } });
    res.send(advertisement);
  } catch (err) {
    next(err);
  }
});
