import { In, getRepository } from 'typeorm';
import { investorModel, taskProgressModel } from '../../../../db/models';
import { loyaltyTaskModel } from '../../../../db/models/loyaltyTaskModel';

import { LoyaltyProject, LoyaltyTask, TaskProgress } from '../../../../db/entity';
import { isTaskCompleted } from './complete';
import { getStatusOfSubTask, loyaltyTaskBodyMapper } from './loyaltyTaskBody';
import { getLocalization } from '../../localization';
import {
  addInvitePointsForInviter,
  createTaskProgress,
  isCompletedAllTasksInQuest,
  isFirstCompletedTaskInQuest,
  isTaskAlreadyInDone,
  validateQuizTask,
} from '../taskProgress';
import {
  CompletedTaskResponse,
  DailyTaskBody,
  QuizLoyaltyTaskBody,
} from '../../../../db/types/interfaces/loyalty/tasks';
import { DailyTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/dailyTask.types';
import { NotFoundError, NotFoundErrorKeys } from '../../../errors/NotFoundError';
import { getConfig } from '../../../config';
import { Logger } from '../../logger';
import {
  BadRequestError,
  BadRequestErrorKeys,
  ConflictError,
  ConflictErrorKeys,
  UnauthorizedError,
  UnauthorizedErrorKeys,
} from '../../../errors';
import { verifyReCaptcha } from '../../recaptcha';
import { LoyaltyTaskType, QuestType } from '../../../../db/types/interfaces/loyalty';
import { NotificationsServerService } from '../../notifications.service';
import { addExperience } from '../../experience';
import { QuizProgressBody } from '../../../../db/types/interfaces/taskProgress/quiz.types';
const logger = new Logger();

const { DISABLE_CAPTCHA } = getConfig();

export const completeLoyaltyTask = async (
  investorId: number,
  loyaltyTaskId: number,
  requestBody,
  language,
  recaptchaToken?: string | null,
  recaptchaVersion = 'v2',
) => {
  const result = {
    status: false,
    body: {},
  } as CompletedTaskResponse;

  const investor = await investorModel.getByInvestorId(investorId);
  if (!investor) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `user doesn't exist`);
  }

  const loyaltyTask = await loyaltyTaskModel.getById(loyaltyTaskId);
  if (!loyaltyTask) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `quest task doesn't exist`);
  }

  result.loyaltyTask = loyaltyTask;
  if (
    loyaltyTask.type !== LoyaltyTaskType.SignUp &&
    !DISABLE_CAPTCHA &&
    typeof recaptchaToken !== 'undefined' &&
    (!recaptchaToken || !(await verifyReCaptcha(recaptchaToken, recaptchaVersion)))
  ) {
    throw new BadRequestError(BadRequestErrorKeys.ReCaptchaTokenInvalid);
  }

  const taskActive = await isTaskActive(loyaltyTask);
  if (!taskActive) {
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `loyaltyTask ${loyaltyTask.id} or quest is not active`,
    );
  }

  const taskAlreadyInDone = await isTaskAlreadyInDone({
    investorId: investor.id,
    loyaltyTask,
    requestBody,
  });
  if (taskAlreadyInDone) {
    throw new ConflictError(ConflictErrorKeys.ConflictError, `loyaltyTask ${loyaltyTaskId} is already done`);
  }

  let isRequiredTasksCompleted = true;
  if (!loyaltyTask.required) {
    isRequiredTasksCompleted = await isAllRequiredTasksCompleted(investor.id, loyaltyTask.loyaltyProjectId);
  }

  let completed: { status: boolean; json?: Record<string, any> } = { status: false };
  if (isRequiredTasksCompleted) {
    completed = await isTaskCompleted(investor.id, loyaltyTask, requestBody, language);
  }

  if (completed.status && isRequiredTasksCompleted) {
    const taskProgress = await createTaskProgress(investorId, loyaltyTask, completed.json, requestBody, language);
    await addInvitePointsForInviter(investorId, loyaltyTask, requestBody);
    result.body = await getTasksBody(loyaltyTask, investor.id, taskProgress, language);
    result.status = completed.status;
  }

  if (!completed.status && loyaltyTask.type === LoyaltyTaskType.Quiz) {
    const taskProgress = await taskProgressModel.updateOrCreateQuizTaskProgress(investorId, loyaltyTask, requestBody);
    if ((taskProgress?.json as QuizProgressBody[]).length > (loyaltyTask.body as QuizLoyaltyTaskBody).maxAnswers) {
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        'You have reached max attempts for this task',
      );
    }

    const { isValid, body } = await validateQuizTask(taskProgress, loyaltyTask, requestBody);

    if (!isValid && body) {
      result.body = body;
    } else {
      result.body = await getTasksBody(loyaltyTask, investor.id, taskProgress, language);
      result.status = completed.status;
    }
  }

  if (completed.status) {
    if (loyaltyTask.experienceTaskId) {
      await addExperience(
        investor.id,
        {
          experienceId: loyaltyTask.experienceTaskId,
          experienceType: 'customTaskExperience',
        },
        loyaltyTask.loyaltyProjectId,
      );
    }

    const isCompletedAllTasks = await isCompletedAllTasksInQuest(investor.id, loyaltyTask.loyaltyProjectId);
    if (isCompletedAllTasks) {
      await addExperience(
        investor.id,
        {
          experienceType: 'completeAllTasks',
        },
        loyaltyTask.loyaltyProjectId,
      );

      if (loyaltyTask.loyaltyProject.projectType === QuestType.Guaranteed) {
        await NotificationsServerService.notifyGuaranteedWinners(loyaltyTask.loyaltyProject, [investor.id]);
        await addExperience(investorId, {
          experienceType: 'winGuaranteedQuest',
        });
      }
    } else {
      const isFirstTaskInQuest = await isFirstCompletedTaskInQuest(investor.id, loyaltyTask.loyaltyProjectId);
      if (isFirstTaskInQuest) {
        await addExperience(
          investor.id,
          {
            experienceType: 'completeFirstTask',
          },
          loyaltyTask.loyaltyProjectId,
        );
      }
    }
  }
  return result;
};

export const getTasksBody = async (
  loyaltyTask: LoyaltyTask,
  investorId: number | undefined,
  taskProgress: TaskProgress | undefined,
  language?: string,
) => {
  if (language != 'en' && language != undefined) {
    if (loyaltyTask.body.description != null) {
      if (loyaltyTask.body.description) {
        const localizedData = await getLocalization(loyaltyTask.localizationId, language, 'description');
        if (localizedData) loyaltyTask.body.description = localizedData;
      }
    }
    if ('isOnboardingTask' in loyaltyTask.body) {
      if ('videoId' in loyaltyTask.body && loyaltyTask.body.videoId) {
        const localizedField = await getLocalization(loyaltyTask.localizationId, language, 'videoId');
        if (localizedField) loyaltyTask.body.videoId = localizedField;
      }
      if ('buttonText' in loyaltyTask.body && loyaltyTask.body.buttonText) {
        const localizedField = await getLocalization(loyaltyTask.localizationId, language, 'buttonText');
        if (localizedField) loyaltyTask.body.buttonText = localizedField;
      }
      if ('onboardingTitle' in loyaltyTask.body && loyaltyTask.body.onboardingTitle) {
        const localizedField = await getLocalization(loyaltyTask.localizationId, language, 'onboardingTitle');
        if (localizedField) loyaltyTask.body.onboardingTitle = localizedField;
      }
      if ('onboardingDescription' in loyaltyTask.body && loyaltyTask.body.onboardingDescription) {
        const localizedField = await getLocalization(loyaltyTask.localizationId, language, 'onboardingDescription');
        if (localizedField) loyaltyTask.body.onboardingDescription = localizedField;
      }
    }
  }
  return loyaltyTaskBodyMapper(loyaltyTask, investorId, taskProgress);
};

export const getSubTaskOfQuestTask = async (loyaltyTaskId: number, subTaskId: number, investorId?: number) => {
  const loyaltyTask = await loyaltyTaskModel.getByLoyaltyTaskId(loyaltyTaskId);

  if (!loyaltyTask) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `quest task doesn't exist`);
  }

  if (!investorId) {
    throw new UnauthorizedError(UnauthorizedErrorKeys.WrongToken, `Wrong token or token is not provided`);
  }

  const taskBody = loyaltyTask.body as DailyTaskBody;

  if (!taskBody.subTasks) throw new NotFoundError(NotFoundErrorKeys.NotFound, `loyaltyTask subTasks doesn't exist`);

  let selectedSubTask: any = taskBody.subTasks.find((item) => item.id === subTaskId);
  selectedSubTask = {
    ...selectedSubTask,
    status: getStatusOfSubTask(selectedSubTask),
  };

  const taskProgress = await taskProgressModel.getByInvestorAndTaskId(investorId, loyaltyTask.id);

  if (!taskProgress) return selectedSubTask;

  const completedSubTask = (taskProgress?.json as DailyTaskProgressBody[]).find((item) => item.id === subTaskId);

  if (completedSubTask) {
    selectedSubTask = {
      ...selectedSubTask,
      ...completedSubTask,
    };
  }

  return selectedSubTask;
};

export const isAllRequiredTasksCompleted = async (investorId: number, loyaltyProjectId: number): Promise<boolean> => {
  const loyaltyTasks = await loyaltyTaskModel.getByLoyaltyProjectId(loyaltyProjectId);

  if (!loyaltyTasks) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `quest tasks doesn't exist`);
  }
  const requiredTasks = loyaltyTasks.filter((task) => task.required);

  const taskProgresses = await taskProgressModel.getByConditionsWithRelations({
    investorId: investorId,
    loyaltyTaskId: In(requiredTasks.map((task) => task.id)),
  });

  await taskProgressModel.getByInvestorAndProjectId(investorId, loyaltyProjectId);

  return taskProgresses.length === requiredTasks.length;
};

export const isTaskActive = async (loyaltyTask: LoyaltyTask) => {
  const dateNow = new Date();

  const loyaltyProject = await getRepository(LoyaltyProject).findOneOrFail({
    where: { id: loyaltyTask.loyaltyProjectId },
  });
  const isProjectActive = new Date(loyaltyProject.startAt) < dateNow && dateNow < new Date(loyaltyProject.endAt);

  if (!isProjectActive) return false;

  loyaltyTask.startAt = loyaltyTask.startAt || loyaltyProject.startAt;
  loyaltyTask.endAt = loyaltyTask.endAt || loyaltyProject.endAt;

  return new Date(loyaltyTask.startAt) < dateNow && dateNow < new Date(loyaltyTask.endAt);
};
