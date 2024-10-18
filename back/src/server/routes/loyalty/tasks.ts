import { Router } from 'express';

import { completeLoyaltyTask, getSubTaskOfQuestTask } from '../../services/loyalty/task';
import { authMiddleware } from '../../middlewares/authValidating';
import { parseAuthToken } from '../../helpers';
import { getConfig } from '../../config';
import { getOnboardingTasks } from '../../services/loyalty/task/onboardingTasks';

const { APP_SECRET } = getConfig();
import { RequestLogger } from '../../services/logger';
import { fileUpload } from '../../middlewares/fileUpload';
import { loyaltyTaskModel } from '../../../db/models/loyaltyTaskModel';
import { CheckTaskDto } from '../../../db/types/interfaces/checkTask/checkTask.dto';
import { checkTask } from '../../services/checkTask/checkTask.service';
import { CompletedTaskResponse } from '../../../db/types/interfaces/loyalty/tasks';

const logger = new RequestLogger();

export const loyaltyTasks = Router();

loyaltyTasks.get('/loyalty-tasks/onboarding', async (req, res, next) => {
  try {
    const { investorId } = parseAuthToken(req.headers.authorization, APP_SECRET) as { investorId: number | undefined };
    const language = req.header('language');
    const result = await getOnboardingTasks(investorId, language);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

loyaltyTasks.post(
  '/loyalty-tasks/:loyaltyTaskId/completed',
  authMiddleware,
  fileUpload('image').single('imgSrc'),
  async (req, res, next) => {
    try {
      const language = req.header('language');
      const recaptchaToken: string | null = req.body.reCaptchaToken || null;
      const reCaptchaVersion = req.body.reCaptchaVersion || 'v2';

      delete req.body.reCaptchaToken;
      delete req.body.reCaptchaVersion;

      const body = req.file || req.body;

      const success: CompletedTaskResponse = await completeLoyaltyTask(
        req['investorId'] as number,
        Number(req.params.loyaltyTaskId),
        body,
        language,
        recaptchaToken,
        reCaptchaVersion,
      );
      delete success['loyaltyTask'];

      logger.info(req, { success });
      res.send({ success });
    } catch (error) {
      next(error);
    }
  },
);

loyaltyTasks.post('/loyalty-tasks/:loyaltyTaskId/checkTask', async (req, res, next) => {
  try {
    const task = await loyaltyTaskModel.getByLoyaltyTaskId(+req.params.loyaltyTaskId);
    const body = req.body as CheckTaskDto;
    const result = await checkTask(task, body);

    logger.info(req, { status: 200, result });
    res.send({ status: 200, result });
  } catch (error) {
    next(error);
  }
});

loyaltyTasks.get('/loyalty-tasks/:loyaltyTaskId/subTasks/:subTaskId', async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const loyaltyTaskId = Number(req.params.loyaltyTaskId);
    const subTaskId = Number(req.params.subTaskId);

    const subTask = await getSubTaskOfQuestTask(loyaltyTaskId, subTaskId, investorId);
    logger.info(req, { subTask });
    res.send(subTask);
  } catch (error) {
    next(error);
  }
});
