import express from 'express';
import { RequestLogger } from '../services/logger';
import {
  createUserModalSettingsByTypeAndInvestorId,
  getProfileExperience,
  getQuestsByInvestor,
  getRewardsByInvestor,
  getUserModalSettingsByTypeAndInvestorId,
} from '../services/profiles';
import { authMiddleware } from '../middlewares/authValidating';
import { getProfileFilterOptions } from '../helpers/routerHelpers';
import { getExperienceHistory } from '../services/experience';
import { ReadUserModalSetting, UserModalSettingsTypes } from '../../db/types/interfaces/UserModalSettings.types';

const logger = new RequestLogger();

export const profile = express.Router();

profile.get('/profiles/rewards', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const filterOptions = await getProfileFilterOptions(req.query);
    const rewards = await getRewardsByInvestor(investorId, filterOptions, req.query.isClaimed as string | undefined);
    logger.info(req, { response: { rewards } });
    res.send(rewards);
  } catch (err) {
    next(err);
  }
});

profile.get('/profiles/quests', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const filterOptions = await getProfileFilterOptions(req.query);
    const quests = await getQuestsByInvestor(investorId, filterOptions);
    logger.info(req, { response: { quests } });
    res.send(quests);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

profile.get('/profiles/experience/history', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;

    const data = await getExperienceHistory({
      investorId,
      page: Number(req.query.page) || undefined,
      perPage: Number(req.query.per_page) || undefined,
    });

    logger.info(req, { response: { data } });
    res.send(data);
  } catch (err) {
    next(err);
  }
});

profile.get('/profiles/experiences', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;

    const result = await getProfileExperience(investorId);
    res.send(result);
  } catch (err) {
    next(err);
  }
});

profile.get('/profiles/userModalSetting', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const type = req.query['type'] as UserModalSettingsTypes;

    const modal = await getUserModalSettingsByTypeAndInvestorId(type, investorId);
    logger.info(req, { response: { modal } });

    res.send(modal);
  } catch (e) {
    next(e);
  }
});

profile.post('/profiles/userModalSetting', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'] as number;
    const body = req.body as ReadUserModalSetting;

    const createdModal = await createUserModalSettingsByTypeAndInvestorId(body.type, investorId);
    logger.info(req, { response: { createdModal } });

    res.send(createdModal);
  } catch (e) {
    next(e);
  }
});
