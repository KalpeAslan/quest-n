import { LoyaltyProjectsScoreboardResponse, QuestType } from '../../../db/types/interfaces/loyalty';
import { IPaginationQuery } from '../../../db/types/interfaces/common/common.types';
import { loyaltyProjectModel, taskProgressModel } from '../../../db/models';
import { BadRequestError, BadRequestErrorKeys, NotFoundError, NotFoundErrorKeys } from '../../errors';
import { luckyDrawProgressModel } from '../../../db/models/luckyDrawProgress.model';

export const getLoyaltyProjectsScoreboard = async (
  linkTitle: string,
  investorId: number | undefined,
  page: number,
  pageSize: number,
): Promise<LoyaltyProjectsScoreboardResponse> => {
  const response: LoyaltyProjectsScoreboardResponse = await getLoyaltyProjectsScoreboardByProject(
    linkTitle,
    investorId,
    {
      usePagination: true,
      page,
      pageSize,
    },
  );

  return response;
};

export const getLoyaltyProjectsScoreboardByProject = async (
  linkTitle: string,
  investorId: number | undefined,
  { usePagination, pageSize, page }: IPaginationQuery,
): Promise<LoyaltyProjectsScoreboardResponse> => {
  const scoreboardData = await taskProgressModel.getScoreboard(
    linkTitle,
    investorId,
    page as number,
    pageSize as number,
    usePagination,
  );

  const response: LoyaltyProjectsScoreboardResponse = {
    scoreboard: scoreboardData?.scoreboard || [],
    page: page as number,
    pageSize: pageSize as number,
    total: scoreboardData?.total || 0,
    luckyDrawWinnersCount: scoreboardData?.luckyDrawWinnersCount || 0,
    eligibleUsersCount: scoreboardData?.eligibleUsersCount || 0,
  };

  return response;
};

export const getWinnersOfProject = async (linkTitle: string) => {
  const quest = await loyaltyProjectModel.getByLinkTitle(linkTitle);

  if (!quest) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `Quest with linkTitle ${linkTitle} not found`);
  }

  switch (quest.projectType) {
    case QuestType.LuckyDraw:
      return luckyDrawProgressModel.getLuckDrawWinners(quest.id);
    case QuestType.Scoreboard:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `Quest with linkTitle ${linkTitle} is not implemented for winners yet`,
      );
    case QuestType.Guaranteed:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `Quest with linkTitle ${linkTitle} is not implemented for winners yet`,
      );
  }
};
