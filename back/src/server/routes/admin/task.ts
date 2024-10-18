import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authValidating';
import { CreateLoyaltyTaskDto, UpdateLoyaltyTaskDto } from '../../../db/types/interfaces/loyalty/LoyaltyTaskDto';
import { checkLoyaltyTaskExists, createLoyaltyTask, updateLoyaltyTask } from '../../services/loyalty/task/loyaltyTask';
import { checkLoyaltyProjectOwnership, getFullByLinkTitle } from '../../services/loyalty/loyaltyProject';
import { RequestLogger } from '../../services/logger';
import { loyaltyTaskModel } from '../../../db/models/loyaltyTaskModel';
import { loyaltyProjectModel } from '../../../db/models';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
const logger = new RequestLogger();

export const task = Router();

task.put('/admin/task/:id', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const data = req.body as UpdateLoyaltyTaskDto;

    const loyaltyTaskId = req.params.id;

    const loyaltyTask = await checkLoyaltyTaskExists(Number(loyaltyTaskId));

    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectId: loyaltyTask.loyaltyProjectId,
    });

    await updateLoyaltyTask(Number(loyaltyTaskId), data, +investorId);

    const newLoyaltyProject = await getFullByLinkTitle(loyaltyProject.linkTitle);
    logger.info(req, { response: newLoyaltyProject });
    res.send(newLoyaltyProject);
  } catch (error) {
    next(error);
  }
});

task.delete('/admin/task/:id', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const loyaltyTaskId = req.params.id;

    const loyaltyTask = await checkLoyaltyTaskExists(Number(loyaltyTaskId));

    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectId: loyaltyTask.loyaltyProjectId,
    });

    await loyaltyTaskModel.delete(Number(loyaltyTaskId));

    const newLoyaltyProject = await getFullByLinkTitle(loyaltyProject.linkTitle);
    logger.info(req, { response: newLoyaltyProject });
    res.send(newLoyaltyProject);
  } catch (error) {
    next(error);
  }
});

task.post('/admin/quest/:questId/task', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const data = req.body as CreateLoyaltyTaskDto;

    const loyaltyQuestId = req.params.questId;
    const loyaltyProject = await loyaltyProjectModel.getById(Number(loyaltyQuestId));

    if (!loyaltyProject) {
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `loyaltyProject with ${loyaltyQuestId} is not found`);
    }
    const loyaltyTask = await createLoyaltyTask(loyaltyProject.linkTitle, data, +investorId);

    logger.info(req, { response: loyaltyTask });
    res.send(loyaltyTask);
  } catch (error) {
    next(error);
  }
});

task.put('/admin/quest/:questId/task/:id', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const loyaltyTaskId = req.params.id;
    const loyaltyProjectId = req.params.questId;
    const data = req.body as UpdateLoyaltyTaskDto;

    await checkLoyaltyTaskExists(Number(loyaltyTaskId));
    await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectId: Number(loyaltyProjectId),
    });

    const loyaltyTask = await updateLoyaltyTask(Number(loyaltyTaskId), data, +investorId);
    logger.info(req, { response: loyaltyTask });
    res.send(loyaltyTask);
  } catch (error) {
    next(error);
  }
});

task.delete('/admin/quest/:questId/task/:taskId', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const loyaltyProjectId = req.params.questId;
    const loyaltyTaskId = req.params.taskId;
    const loyaltyTask = await checkLoyaltyTaskExists(Number(loyaltyTaskId));

    await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectId: Number(loyaltyProjectId),
    });

    const response = await loyaltyTaskModel.delete(Number(loyaltyTaskId));

    logger.info(req, { response });
    res.send(response);
  } catch (error) {
    next(error);
  }
});
