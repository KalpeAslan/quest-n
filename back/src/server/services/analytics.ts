import axios from 'axios';
import { loyaltyProjectModel } from '../../db/models';
import { getConfig } from '../config';
import { taskProgressModel } from '../../db/models/taskProgressModel';
import { BadRequestError, BadRequestErrorKeys, NotFoundError, NotFoundErrorKeys } from '../errors';
import { getManager } from 'typeorm';
import {
  getLuckyDrawWinnersByQuestId,
  getParticipantsByQuestId,
  getScoreboardWinnersByQuestId,
} from '../../db/queries/getAllQuestsByInvestor';
import { getClaimingStatus } from './blockchain/reward/alphaTreasury';
import { encrypt } from '../../db/helpers';
import { QuestType } from '../../db/types/interfaces/loyalty';
import { getPartnerProjectByLinkTitleAndInvestorId } from './loyalty/partnerProject';
import { LoyaltyProject } from '../../db/entity';
const config = getConfig();

export const getQuestAnalytics = async ({ questLinkTitle, investorId }) => {
  const quest = await loyaltyProjectModel.getByLinkTitle(questLinkTitle);

  const accessToQuest = await getAccessToQuestAnalytics(quest, investorId);

  if (!accessToQuest)
    throw new BadRequestError(BadRequestErrorKeys.NotValidParameter, `You don't have access to this quest`);
  const countryVisits = await axios.get(
    `${config.ANALYTICS_DOMAIN}/api/events/countries?page_path=/quest/${questLinkTitle}`,
  );
  const questVisits = await axios.get(
    `${config.ANALYTICS_DOMAIN}/api/events/visits?page_path=/quest/${questLinkTitle}`,
  );

  const participants = await taskProgressModel.getParticipants(quest.id);

  return {
    linkTitle: quest.linkTitle,
    title: quest.title,
    visits: questVisits.data.visits ? questVisits.data.visits : 0,
    participants,
    geography: countryVisits.data,
    questType: quest.projectType,
  };
};

export const getTasksCompletionAnalytics = async ({
  loyaltyProjectLinkTitle,
}: {
  loyaltyProjectLinkTitle: string;
}): Promise<{
  tasksCompletion: {
    id: number;
    title: string;
    completionCount: number;
    percentage: number;
  }[];
  tasksCountCompletion: {
    tasksCount: number;
    completionCount: number;
    percentage: number;
  }[];
}> => {
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitle(loyaltyProjectLinkTitle);

  if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound);

  const participants = await taskProgressModel.getParticipants(loyaltyProject.id);

  const tasksCompletion = await taskProgressModel.getTasksCompletion(loyaltyProject.id);

  const tasksCountCompletion = await taskProgressModel.getTasksCountCompletion(loyaltyProject.id);

  return {
    tasksCompletion: tasksCompletion.map((item) => ({
      ...item,
      percentage: Number(((item.completionCount * 100) / participants).toFixed()),
    })),
    tasksCountCompletion: tasksCountCompletion.map((item) => ({
      ...item,
      percentage: Number(((item.completionCount * 100) / participants).toFixed(1)),
    })),
  };
};

export const getTasksCompletionByDates = async ({
  loyaltyProjectLinkTitle,
  start,
  end,
}: {
  loyaltyProjectLinkTitle: string;
  start?: string;
  end?: string;
}) => {
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitle(loyaltyProjectLinkTitle);

  if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound);

  const startDate = start && !isNaN(Number(start)) ? new Date(Number(start)) : new Date(loyaltyProject.startAt);

  const endDate = end && !isNaN(Number(end)) ? new Date(Number(end)) : new Date(loyaltyProject.endAt);

  return taskProgressModel.getTasksCompletionByDates(loyaltyProject.id, startDate, endDate);
};

export const getQuestWinnersAnalytics = async ({ questLinkTitle, username }) => {
  const manager = getManager();
  const quest = await loyaltyProjectModel.getByLinkTitle(questLinkTitle);

  const result =
    quest.projectType == 'luckyDraw'
      ? await manager.query(getLuckyDrawWinnersByQuestId(quest.id))
      : await manager.query(getScoreboardWinnersByQuestId(quest.id));

  const winners = await Promise.all(
    result.map(async (user) => {
      const rewardsHash = {};
      for (const reward of user.rewards) {
        for (const contract of user.ct) {
          if (reward.contractId == contract.id) {
            rewardsHash[reward.id] = contract;
          }
        }
      }

      let isClaimed = true;
      for (const reward of user.rewards) {
        try {
          isClaimed = !!(await getClaimingStatus(
            rewardsHash[reward.id].chainId,
            reward.loyaltyProjectId || 0,
            reward.id,
            reward.investorId,
          ));
        } catch (error) {
          isClaimed = false;
        }

        if (!isClaimed) {
          break;
        }
      }

      return {
        ...user,
        emailUserEmail: encrypt.from(user.emailUserEmail),
        walletAddress: encrypt.from(user.walletAddress),
        isClaimed,
      };
    }),
  );

  const filteredWinners = winners.filter(
    (item) =>
      item.emailUserEmail == username ||
      item.googleUserEmail == username ||
      item.walletAddress == username ||
      item.twitterUsername == username ||
      item.discordUsername == username ||
      item.phone == username ||
      item.telegramUsername == username ||
      item.username == username,
  );

  return filteredWinners;
};

export const getQuestEligibleUsersAnalytics = async ({ questLinkTitle, username }) => {
  const manager = getManager();
  const quest = await loyaltyProjectModel.getByLinkTitle(questLinkTitle);
  const result = await manager.query(getParticipantsByQuestId(quest.id));

  const eligibleUsers: any = [];
  for (const elem of result) {
    if (
      (!quest || !quest.threshold ? 0 : quest.threshold) <= elem.earnedPoints &&
      (quest.projectType == QuestType.Guaranteed || quest.projectType == QuestType.LuckyDraw)
    ) {
      eligibleUsers.push({
        ...elem,
        emailUserEmail: encrypt.from(elem.emailUserEmail),
        googleUserEmail: encrypt.from(elem.googleUserEmail),
        walletAddress: encrypt.from(elem.walletAddress),
        isClaimed: false,
      });
    } else if (quest.projectType == QuestType.Scoreboard) {
      eligibleUsers.push({
        ...elem,
        emailUserEmail: encrypt.from(elem.emailUserEmail),
        googleUserEmail: encrypt.from(elem.googleUserEmail),
        walletAddress: encrypt.from(elem.walletAddress),
        isClaimed: false,
      });
    }
  }

  const filteredEligibleUsers = eligibleUsers.filter(
    (item) =>
      item.emailUserEmail == username ||
      item.googleUserEmail == username ||
      item.walletAddress == username ||
      item.twitterUsername == username ||
      item.discordUsername == username ||
      item.phone == username ||
      item.telegramUsername == username ||
      item.username == username,
  );

  return filteredEligibleUsers;
};

const getAccessToQuestAnalytics = async (quest: LoyaltyProject, investorId: number) => {
  let access = false;
  await Promise.all(
    quest.partnerProjects.map(async (partnerProject) => {
      if (partnerProject) {
        if (access) return;
        try {
          access = await getPartnerProjectByLinkTitleAndInvestorId(partnerProject.linkTitle, investorId);
        } catch (e) {
          access = false;
        }
      }
    }),
  );
  return access;
};
