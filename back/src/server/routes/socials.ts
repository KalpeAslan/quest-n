import express from 'express';

import { SocialTypesEnum } from '../../db/types/interfaces/socials';
import { confirmSocials, disconnectSocials, socialsBodyValidator, connectSocials } from '../services/auth';
import { authMiddleware } from '../middlewares/authValidating';
import { RequestLogger } from '../services/logger';
import { addExperience, subtractExperiencePoints } from '../services/experience';
import { subtractInviteTaskPoints } from '../services/loyalty/task/loyaltyTask';
import { verifyTelegram } from '../services/auth/telegram';
const logger = new RequestLogger();

export const socials = express.Router();

socials.get('/socials/:socialsType/connect', authMiddleware, async (req, res, next) => {
  try {
    const loginObject = await connectSocials(req.params.socialsType as SocialTypesEnum, req['investorId']);
    res.send(loginObject);
  } catch (error) {
    next(error);
  }
});

socials.post('/socials/:socialsType/confirm', async (req, res, next) => {
  try {
    const oauthDto = await socialsBodyValidator(req.params.socialsType as SocialTypesEnum, req.body);

    const apiKey = req.query['bot_access_token'];

    const results = await confirmSocials(
      req.params.socialsType as SocialTypesEnum,
      oauthDto,
      req['investorId'] as number | undefined,
      apiKey as string | undefined,
    );

    logger.info(req, { response: { results } });

    if (results && results.id && results.username && req.params.socialsType == SocialTypesEnum.Telegram) {
      await addExperience(req['investorId'] as number, { experienceType: 'connectTelegram' });
    } else if (results && results.id && results.username && req.params.socialsType == SocialTypesEnum.Discord) {
      await addExperience(req['investorId'] as number, { experienceType: 'connectDiscord' });
    }

    res.send(results);
  } catch (error) {
    next(error);
  }
});

socials.get('/socials/telegram/verify', authMiddleware, async (req, res, next) => {
  try {
    const result = await verifyTelegram(req['investorId']);

    res.send(result);
  } catch (error) {
    next(error);
  }
});

socials.post('/socials/:socialsType/disconnect', authMiddleware, async (req, res, next) => {
  try {
    if (req.params.socialsType == SocialTypesEnum.Discord) {
      await subtractExperiencePoints(req['investorId'] as number, 'discord');
      await subtractInviteTaskPoints(req['investorId'] as number, 'discord');
    } else if (req.params.socialsType == SocialTypesEnum.Telegram) {
      await subtractExperiencePoints(req['investorId'] as number, 'telegram');
      await subtractInviteTaskPoints(req['investorId'] as number, 'telegram');
    }

    const results = await disconnectSocials(req.params.socialsType as SocialTypesEnum, req['investorId'] as number);
    logger.info(req, { response: { results } });

    res.send(results);
  } catch (error) {
    next(error);
  }
});
