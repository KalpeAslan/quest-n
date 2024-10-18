import { Router } from 'express';
import { RequestLogger } from '../../services/logger';
import { getQuest, getQuestParticipants, updateQuest } from '../../services/internalAdmin';

const logger = new RequestLogger();

export const internalAdmin = Router();

internalAdmin.get('/admin/internal/quest/:linkTitle', async (req, res, next) => {
  try {
    const token = req.query.token;
    const linkTitle = req.params.linkTitle;

    const quest = await getQuest(token as string, linkTitle);

    logger.info(req, { response: quest });

    res.send(quest);
  } catch (error) {
    next(error);
  }
});

internalAdmin.put('/admin/internal/quest/:linkTitle', async (req, res, next) => {
  try {
    const token = req.query.token;
    const linkTitle = req.params.linkTitle;
    const data = req.body;

    const quest = await updateQuest(token as string, linkTitle, data);
    res.send(quest);
  } catch (error) {
    next(error);
  }
});

internalAdmin.get('/admin/internal/quest/:linkTitle/participants', async (req, res, next) => {
  try {
    const token = req.query.token;
    const linkTitle = req.params.linkTitle;

    const quest = await getQuestParticipants(token as string, linkTitle);
    res.send(quest);
  } catch (error) {
    next(error);
  }
});
