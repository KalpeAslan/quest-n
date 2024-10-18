import axios from 'axios';
import { getConfig } from '../config';
import {
  BadRequestError,
  BadRequestErrorKeys,
  ForbiddenError,
  ForbiddenErrorKeys,
  NotFoundError,
  NotFoundErrorKeys,
} from '../errors';
import { loyaltyProjectModel } from '../../db/models';
import { LoyaltyTaskType, QuestStatus, QuestType } from '../../db/types/interfaces/loyalty';
import { getQuestParticipantsByLinkTitle } from '../../db/queries/internalAdmin';
import { getManager } from 'typeorm';
import { decryptData } from '../../db/helpers/crypto';
import { loyaltyProject } from '../routes/loyalty/loyaltyProjects';
import { loyaltyTaskModel } from '../../db/models/loyaltyTaskModel';
import { loyaltyRewardModel } from '../../db/models/loyaltyRewardModel';

const { FIREBASE_API_KEY } = getConfig();

export const validateToken = async (token: string) => {
  try {
    const { data } = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      { idToken: token },
    );

    return Boolean(data?.users?.[0] && !data.users[0].disabled);
  } catch (error) {
    return false;
  }
};

export const getQuest = async (token: string, linkTitle: string) => {
  if (!token || !(await validateToken(token as string))) {
    throw new ForbiddenError(ForbiddenErrorKeys.NotCorrectCredentials);
  }

  const quest = await loyaltyProjectModel.getByLinkTitle(linkTitle);

  if (!quest) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound);
  }

  return quest;
};

export const updateQuest = async (
  token: string,
  linkTitle: string,
  {
    visible,
    featured,
    title,
    description,
    projectType,
    questStatus,
    startAt,
    endAt,
  }: {
    visible: boolean;
    featured: boolean;
    title: string;
    description: string;
    projectType: QuestType;
    questStatus: QuestStatus;
    startAt: Date;
    endAt: Date;
  },
) => {
  if (!token || !(await validateToken(token as string))) {
    throw new ForbiddenError(ForbiddenErrorKeys.NotCorrectCredentials);
  }

  const quest = await loyaltyProjectModel.getByLinkTitle(linkTitle);

  if (startAt && endAt && new Date(startAt) > new Date(endAt)) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, `startAt can not be grater than endAt`);
  }

  if (!quest) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound);
  }

  const questEndDate = new Date(endAt);

  const claimingStartAt = new Date(questEndDate);
  claimingStartAt.setDate(questEndDate.getDate() + 3);

  const claimingEndAt = new Date(questEndDate);
  claimingEndAt.setDate(questEndDate.getDate() + 30);

  if (projectType == QuestType.LuckyDraw) {
    const totalPoints = await loyaltyTaskModel.getTotalPointsByLoyaltyLinkTitle(quest.id);
    quest.threshold = totalPoints;
  }

  if (projectType == QuestType.Guaranteed) {
    const { startPlace, endPlace } = await loyaltyRewardModel.getPlacesByLoyaltyProject(quest.id);
    quest.eligibleUsersCount = endPlace - startPlace + 1;
  }

  return await loyaltyProjectModel.update({
    ...quest,
    visible,
    featured,
    title,
    description,
    projectType,
    questStatus,
    startAt,
    endAt,
    claimingStartAt: startAt && endAt ? claimingStartAt : quest.claimingStartAt,
    claimingEndAt: startAt && endAt ? claimingEndAt : quest.claimingEndAt,
  });
};

export const getQuestParticipants = async (token: string, linkTitle: string) => {
  if (!token || !(await validateToken(token as string))) {
    throw new ForbiddenError(ForbiddenErrorKeys.NotCorrectCredentials);
  }

  const quest = await loyaltyProjectModel.getByLinkTitle(linkTitle);
  if (!quest) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound);
  }

  const manager = getManager();
  const queryResult = await manager.query(getQuestParticipantsByLinkTitle, [quest.id]);

  const result: any = [];
  for (const elem of queryResult) {
    const { suggestionTasks, imageTasks, emailTasks, ...currElem } = elem;

    for (let index = 0; index < suggestionTasks.length; index++) {
      const { json, ...rest } = suggestionTasks[index];
      currElem[suggestionTasks[index].title] = {
        ...rest,
        ...json,
        type: LoyaltyTaskType.Suggestion,
      };
    }

    for (let index = 0; index < imageTasks.length; index++) {
      const { json, ...rest } = imageTasks[index];
      currElem[imageTasks[index].title] = {
        ...rest,
        ...json,
        type: LoyaltyTaskType.ImageUpload,
      };
    }

    for (let index = 0; index < emailTasks.length; index++) {
      const { json, ...rest } = emailTasks[index];
      currElem[emailTasks[index].title] = {
        ...json,
        ...rest,
        type: LoyaltyTaskType.Email,
      };
    }

    currElem.address = elem.address ? decryptData(elem.address) : elem.address;
    result.push(currElem);
  }

  return result;
};
