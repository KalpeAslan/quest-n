import { FindConditions, ObjectLiteral, getManager, getRepository } from 'typeorm';
import { LoyaltyProject } from '../../db/entity';
import {
  createBaseRequest,
  createCountQuery,
  filterBySearchTitle,
  filterCampaign,
  filterFeatured,
  filterPartner,
  filterReward,
  filterStatus,
  filterTrending,
  filterVisible,
  getResult,
  paginate,
  sort,
} from '../helpers/loyaltyProjectFilters';
import {
  GetLoyaltyProject,
  LoyaltyProjectFilterOptions,
  LoyaltyProjectStatuses,
  LoyaltyTaskStatus,
  LoyaltyTaskType,
  QuestStatus,
  QuestType,
} from '../types/interfaces/loyalty';
import { getLoyaltyProjectLocalizedQuery, getLoyaltyProjectQuery } from '../queries/loyaltyProjectQueries';
import { generateGetQuests } from '../queries/getAllQuestsByInvestor';

class LoyaltyProjectModel {
  getNotCompleted() {
    return (
      getRepository(LoyaltyProject)
        .createQueryBuilder('loyaltyProject')
        // .where('loyaltyProject.claimingEndAt <= now()')
        // .andWhere('COALESCE(loyaltyProject.body -> "scoreboardRewards" ->> "minTokensAmount", 0) > 0')
        .where('loyaltyProject.endAt <= now()')
        .andWhere('loyaltyProject.questStatus != :completed', { completed: QuestStatus.Completed })
        .getMany()
    );
  }

  getById(id: number) {
    return getRepository(LoyaltyProject)
      .createQueryBuilder('loyaltyProject')
      .leftJoinAndSelect('loyaltyProject.loyaltyTasks', 'loyaltyTasks')
      .leftJoinAndSelect('loyaltyProject.partnerProjects', 'partnerProjects')
      .where(`loyaltyProject.id = ${id}`)
      .getOne();
  }

  getByLinkTitle(linkTitle: string) {
    const query = getRepository(LoyaltyProject)
      .createQueryBuilder('loyaltyProject')
      .leftJoinAndSelect('loyaltyProject.loyaltyTasks', 'loyaltyTasks')
      .leftJoinAndSelect('loyaltyProject.partnerProjects', 'partnerProjects');

    return query.where('loyaltyProject.linkTitle = :linkTitle', { linkTitle }).getOneOrFail();
  }

  async getByLinkTitleFull({
    linkTitle,
    investorId,
    language,
    isOwner,
  }: {
    linkTitle: string;
    investorId?: number;
    language?: string;
    isOwner: boolean;
  }) {
    const params =
      !language || language === 'en'
        ? [
            linkTitle,
            investorId || null,
            LoyaltyTaskStatus.Active,
            LoyaltyTaskStatus.Expired,
            LoyaltyTaskType.Quiz,
            LoyaltyTaskType.Suggestion,
            LoyaltyTaskType.Email,
            LoyaltyTaskType.ReferralLink,
            LoyaltyTaskType.MentionTwitter,
            LoyaltyTaskType.ReTweetQuoteTwitter,
            LoyaltyTaskType.Partner,
            LoyaltyTaskType.Token,
            LoyaltyTaskType.NFT,
            LoyaltyTaskType.BlockchainUser,
            LoyaltyTaskType.ValueHolder,
            LoyaltyTaskType.NativeHolder,
            LoyaltyTaskType.Daily,
            LoyaltyTaskType.ImageUpload,
            LoyaltyTaskType.Invite,
            LoyaltyTaskStatus.Done,
            LoyaltyTaskStatus.AdditionalProgram,
            QuestType.Scoreboard,
            LoyaltyProjectStatuses.Soon,
            LoyaltyProjectStatuses.Expired,
            LoyaltyProjectStatuses.Participating,
            LoyaltyProjectStatuses.Active,
            LoyaltyTaskType.CustomWebhook,
            LoyaltyTaskType.LikeTweetTwitter,
            LoyaltyTaskType.CommentTweetTwitter,
            LoyaltyTaskType.GitCoin,
          ]
        : [
            linkTitle,
            investorId || null,
            LoyaltyTaskStatus.Active,
            LoyaltyTaskStatus.Expired,
            LoyaltyTaskType.Quiz,
            LoyaltyTaskType.Suggestion,
            LoyaltyTaskType.Email,
            LoyaltyTaskType.ReferralLink,
            LoyaltyTaskType.MentionTwitter,
            LoyaltyTaskType.ReTweetQuoteTwitter,
            LoyaltyTaskType.Partner,
            LoyaltyTaskType.Token,
            LoyaltyTaskType.NFT,
            LoyaltyTaskType.BlockchainUser,
            LoyaltyTaskType.ValueHolder,
            LoyaltyTaskType.NativeHolder,
            LoyaltyTaskType.Daily,
            LoyaltyTaskType.ImageUpload,
            LoyaltyTaskType.Invite,
            LoyaltyTaskStatus.Done,
            LoyaltyTaskStatus.AdditionalProgram,
            QuestType.Scoreboard,
            LoyaltyProjectStatuses.Soon,
            LoyaltyProjectStatuses.Expired,
            LoyaltyProjectStatuses.Participating,
            LoyaltyProjectStatuses.Active,
            LoyaltyTaskType.CustomWebhook,
            LoyaltyTaskType.LikeTweetTwitter,
            LoyaltyTaskType.CommentTweetTwitter,
            LoyaltyTaskType.GitCoin,
          ];

    const query =
      !language || language === 'en'
        ? getLoyaltyProjectQuery({ isOwner })
        : getLoyaltyProjectLocalizedQuery({ isOwner, language });

    const manager = getManager();
    const [loyaltyProject] = await manager.query(query, params);

    return loyaltyProject as GetLoyaltyProject;
  }

  getByLinkTitleShort(linkTitle: string) {
    return getRepository(LoyaltyProject)
      .createQueryBuilder('loyaltyProject')
      .where('loyaltyProject.linkTitle = :linkTitle', { linkTitle })
      .getOneOrFail();
  }

  getBySortOrder(sortOrder: number) {
    return getRepository(LoyaltyProject)
      .createQueryBuilder('loyaltyProject')
      .where('loyaltyProject.sortOrder = :sortOrder', { sortOrder })
      .getOne();
  }

  async incrementSortOrderForLoyaltyProjects(startValue: number, endValue: number) {
    for (let currSortOrder = endValue - 1; currSortOrder >= startValue; currSortOrder--) {
      await getRepository(LoyaltyProject).query(
        `
        UPDATE loyalty_project
        SET "sortOrder" = "sortOrder" + 1
        WHERE loyalty_project."sortOrder" = ${currSortOrder};
        `,
      );
    }
  }

  getAll() {
    return getRepository(LoyaltyProject)
      .createQueryBuilder('loyaltyProject')
      .leftJoinAndSelect('loyaltyProject.partnerProjects', 'partnerProjects')
      .orderBy('loyaltyProject.startAt', 'DESC')
      .getMany();
  }

  async getAllFiltered({
    filterOptions,
    trendingProjectIds,
    investorId,
  }: {
    filterOptions: LoyaltyProjectFilterOptions;
    trendingProjectIds: number[];
    investorId?: number;
  }) {
    const baseQuery = createBaseRequest();

    const countQuery = createCountQuery();

    const filteredBySearchTitle = filterBySearchTitle();

    const filteredByVisible = filterVisible({ query: filteredBySearchTitle, visible: filterOptions.visible });

    const filteredByFeatured = filterFeatured({ query: filteredByVisible, featured: filterOptions.featured });

    const filteredByPartner = filterPartner({ query: filteredByFeatured, partner: filterOptions.partner });

    const filteredByTrending = filterTrending({
      query: filteredByPartner,
      trendingProjectIds,
      trending: filterOptions.trending,
    });

    const filteredByCampaign = filterCampaign({
      query: filteredByTrending,
      trendingProjectIds,
      campaign: filterOptions.campaign,
    });

    const filteredByReward = filterReward({ query: filteredByCampaign, reward: filterOptions.reward });

    const filteredByStatus = filterStatus({
      query: filteredByReward,
      status: filterOptions.status,
    });

    const sorted = sort({ query: filteredByStatus });

    const paginated = paginate({ query: sorted, paginate: filterOptions.paginate });

    const result = await getResult({
      baseQuery: baseQuery,
      filterBaseQuery: paginated,
      countQuery: countQuery,
      filterCountQuery: filteredByStatus,
      investorId,
      searchTitle: filterOptions.search || '',
      page: filterOptions.page,
      reward: filterOptions.reward,
      paginate: filterOptions.paginate,
    });

    return { result: result.projects, total: result.total };
  }

  getAllFull() {
    return getRepository(LoyaltyProject)
      .createQueryBuilder('loyaltyProject')
      .leftJoinAndSelect('loyaltyProject.loyaltyTasks', 'loyaltyTasks')
      .leftJoinAndSelect('loyaltyProject.partnerProjects', 'partnerProjects')
      .orderBy('loyaltyProject.startAt', 'DESC')
      .getMany();
  }

  create(loyaltyProject: LoyaltyProject) {
    return getRepository(LoyaltyProject).save(loyaltyProject);
  }

  update(loyaltyProject: LoyaltyProject) {
    return getRepository(LoyaltyProject).save(loyaltyProject);
  }

  delete(id: number) {
    return getRepository(LoyaltyProject).delete({
      id,
    });
  }

  getProjectsByType(projectType: QuestType) {
    return getRepository(LoyaltyProject).find({
      where: {
        projectType,
      },
    });
  }

  setCompleted(loyaltyProjectId: number) {
    return getRepository(LoyaltyProject).update(
      {
        id: loyaltyProjectId,
      },
      {
        questStatus: QuestStatus.Completed,
      },
    );
  }

  getByConditionsWithRelations(
    conditions?: string | ObjectLiteral | FindConditions<LoyaltyProject> | FindConditions<LoyaltyProject>[],
    relations?: string[],
  ) {
    return getRepository(LoyaltyProject).find({
      where: conditions,
      relations,
      order: {
        id: 'ASC',
      },
    });
  }

  async getByParams(
    criteria: string | ObjectLiteral | FindConditions<LoyaltyProject> | FindConditions<LoyaltyProject>[],
  ) {
    return await getRepository(LoyaltyProject).find({
      where: criteria,
    });
  }

  async getInvestorQuests({
    investorId,
    rewardTypes,
    search,
    visible,
    questType,
  }: {
    investorId: number;
    rewardTypes: string;
    search: string;
    visible: boolean;
    questType: string;
  }) {
    const manager = getManager();
    return await manager.query(
      generateGetQuests(rewardTypes, `'expired','participating','win'`, search, visible, questType),
      [investorId],
    );
  }
}

export const loyaltyProjectModel = new LoyaltyProjectModel();
