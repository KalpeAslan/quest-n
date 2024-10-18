import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import express from 'express';
import { subscribeEmail } from '../services/emailSubscription';
import { EmailSubscriptionDto } from '../../db/types/interfaces/EmailSubscriptionDto';
import { RequestLogger } from '../services/logger';

const logger = new RequestLogger();
export const email = express.Router();

email.post('/email', async (req, res, next) => {
  try {
    const emailSubsriptionDto = plainToClass(EmailSubscriptionDto, req.body, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });

    const validationErrors = await validate(emailSubsriptionDto, {
      validationError: { target: false, value: false },
    });

    if (validationErrors.length) {
      return next(validationErrors);
    }

    await subscribeEmail(emailSubsriptionDto);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});
