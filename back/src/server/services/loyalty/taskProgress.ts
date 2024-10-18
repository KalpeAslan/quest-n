import { LoyaltyTask, TaskProgress } from '../../../db/entity';
import { taskProgressModel } from '../../../db/models';
import { LoyaltyTaskType } from '../../../db/types/interfaces/loyalty';
import {
  DailyStatus,
  DailyTaskBody,
  DailyTaskProgressBody,
  InviteTaskBody,
  QuizLoyaltyTaskBody,
} from '../../../db/types/interfaces/loyalty/tasks';
import { QuizProgressBody } from '../../../db/types/interfaces/taskProgress/quiz.types';
import { getTasksBody } from './task';
import { loyaltyTaskModel } from '../../../db/models/loyaltyTaskModel';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';

export const isTaskAlreadyInDone = async ({
  investorId,
  loyaltyTask,
  requestBody,
}: {
  investorId: number;
  loyaltyTask: LoyaltyTask;
  requestBody?: any;
}): Promise<boolean> => {
  switch (loyaltyTask.type) {
    case LoyaltyTaskType.Quiz:
      return quizChecker(investorId, loyaltyTask.id, requestBody);
    case LoyaltyTaskType.Daily:
      return dailyTaskChecker(investorId, loyaltyTask.id, requestBody);
    case LoyaltyTaskType.CustomWebhook:
    case LoyaltyTaskType.Invite:
      return false;
    default:
      return defaultChecker(investorId, loyaltyTask.id);
  }
};

const quizChecker = async (investorId: number, loyaltyTaskId: number, requestBody: any) => {
  const taskProgress = await taskProgressModel.getOneByConditionsWithRelations({ investorId, loyaltyTaskId });

  if (!taskProgress) return false;

  if ((taskProgress.json as QuizProgressBody[]).find((answer) => answer.id === requestBody.id)) {
    return true;
  } else return false;
};

const dailyTaskChecker = async (investorId: number, loyaltyTaskId: number, requestBody: any) => {
  const taskProgress = await taskProgressModel.getOneByConditionsWithRelations({ investorId, loyaltyTaskId });

  if (!taskProgress) return false;

  if (
    (taskProgress.json as DailyTaskProgressBody[]).find(
      (subTask) => subTask.status === DailyStatus.Confirmed && subTask.id === requestBody.id,
    )
  ) {
    return true;
  } else return false;
};

const defaultChecker = async (investorId: number, loyaltyTaskId: number) => {
  const completedTask = await taskProgressModel.getOneByConditionsWithRelations({
    investorId,
    loyaltyTaskId,
  });

  return Boolean(completedTask) || false;
};

export const createTaskProgress = async (
  investorId: number,
  loyaltyTask: LoyaltyTask,
  json: any,
  requestBody,
  language,
) => {
  let taskProgress: TaskProgress;
  if (loyaltyTask.type === LoyaltyTaskType.Daily) {
    taskProgress = await taskProgressModel.updateOrCreateDailyTaskProgress(investorId, loyaltyTask, requestBody);
  } else if (loyaltyTask.type === LoyaltyTaskType.Quiz) {
    taskProgress = await taskProgressModel.updateOrCreateQuizTaskProgress(investorId, loyaltyTask, requestBody);
    if ((taskProgress?.json as QuizProgressBody[]).length > (loyaltyTask.body as QuizLoyaltyTaskBody).maxAnswers) {
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        'You have reached max attempts for this task',
      );
    }
  } else {
    taskProgress = new TaskProgress();
    taskProgress.loyaltyTaskId = loyaltyTask.id;
    taskProgress.investorId = investorId;
    taskProgress.loyaltyProjectId = loyaltyTask.loyaltyProjectId;
    taskProgress.earnedPoints = loyaltyTask.points;
    taskProgress.json = json;
    taskProgress.completedAt = new Date();
    await taskProgressModel.save([taskProgress]);
  }

  // eslint-disable-next-line prefer-const
  let { isValid, body } = await validateQuizTask(taskProgress, loyaltyTask, requestBody);
  if (isValid && body) {
    body = await getTasksBody(loyaltyTask, investorId, taskProgress, language);
    if (body && body['webhookDetails']) {
      delete body['webhookDetails'];
    }
  }

  return taskProgress;
};

export const validateQuizTask = async (taskProgress: TaskProgress, loyaltyTask: LoyaltyTask, requestBody: any) => {
  if (loyaltyTask.type === LoyaltyTaskType.Quiz) {
    const taskBody = loyaltyTask.body as QuizLoyaltyTaskBody;
    let body: any = {
      answer: requestBody.answer,
    };
    const isValid = taskBody.answers.map((a) => a.toLowerCase()).includes(requestBody.answer.toLowerCase());
    if (!isValid) {
      const attemptsLeftNumber = taskBody.maxAnswers
        ? taskBody.maxAnswers - (taskProgress.json as QuizProgressBody[]).length
        : 0;
      body = {
        ...body,
        completed: false,
        attemptsLeftNumber,
      };
    }

    return {
      isValid,
      body,
    };
  }

  return {
    isValid: true,
  };
};

export const addInvitePointsForInviter = async (
  investorId: number,
  loyaltyTask: LoyaltyTask,
  requestBody?: any,
): Promise<any> => {
  const inviterTaskProgress = await taskProgressModel.getInviterTaskProgress(
    investorId,
    Number(loyaltyTask.loyaltyProjectId),
  );

  if (!inviterTaskProgress) {
    return false;
  }

  if (loyaltyTask.type !== LoyaltyTaskType.Daily && loyaltyTask.type !== LoyaltyTaskType.Quiz) {
    inviterTaskProgress.earnedPoints += parseFloat(
      ((+loyaltyTask.points / 100) * +(inviterTaskProgress.loyaltyTask.body as InviteTaskBody).scorePercentage).toFixed(
        2,
      ),
    );
  } else if (loyaltyTask.type === LoyaltyTaskType.Daily) {
    const subTask = (loyaltyTask.body as DailyTaskBody).subTasks.find(
      (subTask) =>
        new Date(subTask.startAt).getTime() <= new Date().getTime() &&
        new Date().getTime() <= new Date(subTask.endAt).getTime(),
    );

    const taskProgress = await taskProgressModel.getByInvestorAndTaskId(investorId, loyaltyTask.id);

    if (!subTask) {
      return true;
    } else if (subTask && !taskProgress) {
      // we need this if block because on first daily task complete task progress is not created yet
      inviterTaskProgress.earnedPoints += parseFloat(
        ((+subTask.points / 100) * +(inviterTaskProgress.loyaltyTask.body as InviteTaskBody).scorePercentage).toFixed(
          2,
        ),
      );
    } else if (subTask && taskProgress) {
      for (const dailyTaskProgress of taskProgress.json as DailyTaskProgressBody[]) {
        if (dailyTaskProgress.id === subTask.id) {
          return true;
        }
      }

      inviterTaskProgress.earnedPoints += parseFloat(
        ((+subTask.points / 100) * +(inviterTaskProgress.loyaltyTask.body as InviteTaskBody).scorePercentage).toFixed(
          2,
        ),
      );
    }
  } else if (loyaltyTask.type === LoyaltyTaskType.Quiz) {
    const status = (loyaltyTask.body as QuizLoyaltyTaskBody).answers
      .map((a) => a.toLowerCase())
      .includes(requestBody.answer.toLowerCase());

    if (!status) {
      return true;
    }

    inviterTaskProgress.earnedPoints += parseFloat(
      ((+loyaltyTask.points / 100) * +(inviterTaskProgress.loyaltyTask.body as InviteTaskBody).scorePercentage).toFixed(
        2,
      ),
    );
  }

  inviterTaskProgress.completedAt = new Date();
  taskProgressModel.save([inviterTaskProgress]);

  return true;
};

export const isFirstCompletedTaskInQuest = async (investorId: number, loyaltyPorjectId: number): Promise<boolean> => {
  const allTaskProgress = await taskProgressModel.getCountByInvestorAndProjectId(investorId, loyaltyPorjectId);
  return allTaskProgress === 1;
};

export const isCompletedAllTasksInQuest = async (investorId: number, loyaltyPorjectId: number): Promise<boolean> => {
  const allTaskProgress = await taskProgressModel.getCountByInvestorAndProjectId(investorId, loyaltyPorjectId);
  const allTasksCount = await loyaltyTaskModel.getCount(loyaltyPorjectId);
  return allTaskProgress === allTasksCount;
};
