import express from 'express';
import { RequestLogger } from '../services/logger';
import {
  getQuestAnalytics,
  getQuestEligibleUsersAnalytics,
  getQuestWinnersAnalytics,
  getTasksCompletionAnalytics,
  getTasksCompletionByDates,
} from '../services/analytics';
import { authMiddleware } from '../middlewares/authValidating';

const logger = new RequestLogger();

export const analytics = express.Router();

analytics.get('/analytics/:linkTitle/tasks', async (req, res, next) => {
  try {
    const result = await getTasksCompletionAnalytics({ loyaltyProjectLinkTitle: req.params.linkTitle });

    logger.info(req, { response: result });

    res.send(result);
  } catch (error) {
    next(error);
  }
});

analytics.get('/analytics/:linkTitle/tasks-completion', async (req, res, next) => {
  try {
    const result = await getTasksCompletionByDates({
      loyaltyProjectLinkTitle: req.params.linkTitle,
      start: (req.query.start as string) || undefined,
      end: (req.query.end as string) || undefined,
    });

    logger.info(req, { response: result });

    res.send(result);
  } catch (error) {
    next(error);
  }
});

analytics.get('/analytics/:linkTitle/winners', authMiddleware, async (req, res, next) => {
  try {
    const result = await getQuestWinnersAnalytics({
      questLinkTitle: req.params.linkTitle,
      username: req.query.username,
    });
    logger.info(req, { response: result });

    res.send(result);
  } catch (error) {
    next(error);
  }
});

analytics.get('/analytics/:linkTitle/eligibleUsers', authMiddleware, async (req, res, next) => {
  try {
    const result = await getQuestEligibleUsersAnalytics({
      questLinkTitle: req.params.linkTitle,
      username: req.query.username,
    });
    logger.info(req, { response: result });

    res.send(result);
  } catch (error) {
    next(error);
  }
});

analytics.get('/analytics/:linkTitle', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const result = await getQuestAnalytics({ questLinkTitle: req.params.linkTitle, investorId });

    logger.info(req, { response: result });

    res.send(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
