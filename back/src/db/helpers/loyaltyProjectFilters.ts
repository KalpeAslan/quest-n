import {
  LoyaltyProjectCampaign,
  LoyaltyProjectRewards,
  LoyaltyProjectStatuses,
  QuestShort,
  QuestType,
} from '../types/interfaces/loyalty';
import {
  FILTER_BY_ACTIVE,
  FILTER_BY_EXPIRED,
  FILTER_BY_FEATURED,
  filterByNewest,
  FILTER_BY_NFT,
  FILTER_BY_PARTICIPATING,
  FILTER_BY_SEARCH_TITLE,
  FILTER_BY_SOON,
  FILTER_BY_TOKEN,
  FILTER_BY_VISIBLE,
  FILTER_BY_WHITELIST,
  GET_LOYALTY_PROJECTS,
  PAGINATE,
  SORT_BY_CUSTOM_SORT_ORDER,
  filterByPartnerQuery,
  filterByTrendingQuery,
  GET_LOYALTY_PROJECTS_COUNT,
  COMPILE_REWARDS,
} from '../queries/loyaltyProjectQueries';
import { getManager } from 'typeorm';

export const createBaseRequest = () => `${COMPILE_REWARDS} ${GET_LOYALTY_PROJECTS}`;

export const createCountQuery = () => `${COMPILE_REWARDS} ${GET_LOYALTY_PROJECTS_COUNT}`;

export const filterBySearchTitle = () => `WHERE ${FILTER_BY_SEARCH_TITLE}`;

export const filterVisible = ({ query, visible }: { query: string; visible: boolean }) => {
  if (visible) {
    return `${query} AND ${FILTER_BY_VISIBLE}`;
  }
  return query;
};

export const filterFeatured = ({ query, featured }: { query: string; featured: boolean }) => {
  if (featured) {
    return `${query} AND ${FILTER_BY_FEATURED}`;
  }
  return query;
};

export const filterPartner = ({ query, partner }: { query: string; partner: string | null }) => {
  if (partner) {
    return `${query} AND ${filterByPartnerQuery(partner)}`;
  }
  return query;
};

export const filterTrending = ({
  query,
  trendingProjectIds,
  trending,
}: {
  query: string;
  trendingProjectIds: number[];
  trending: boolean;
}) => {
  if (trending && trendingProjectIds.length) {
    return `${query} AND ${filterByTrendingQuery(trendingProjectIds)}`;
  }
  return query;
};

export const filterCampaign = ({
  query,
  trendingProjectIds,
  campaign,
}: {
  query: string;
  trendingProjectIds: number[];
  campaign: LoyaltyProjectCampaign[];
}) => {
  const campaignQueries = {
    [LoyaltyProjectCampaign.Trending]: filterByTrendingQuery(trendingProjectIds),
    [LoyaltyProjectCampaign.Newest]: filterByNewest(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()),
  };

  if (campaign.length > 0) {
    return (
      campaign.reduce((acc, campaignOption, index) => {
        if (index === 0) {
          return `${acc} ${campaignQueries[campaignOption]}`;
        }
        return `${acc} OR ${campaignQueries[campaignOption]}`;
      }, `${query} AND (`) + ')'
    );
  }
  return query;
};

export const filterReward = ({ query, reward }: { query: string; reward: LoyaltyProjectRewards[] }) => {
  const rewardQueries = {
    [LoyaltyProjectRewards.Whitelist]: FILTER_BY_WHITELIST,
    [LoyaltyProjectRewards.NFT]: FILTER_BY_NFT,
    [LoyaltyProjectRewards.Token]: FILTER_BY_TOKEN,
  };

  if (reward.length > 0) {
    return (
      reward.reduce((acc, rewardOption, index) => {
        if (index === 0) {
          return `${acc} ${rewardQueries[rewardOption]}`;
        }
        return `${acc} OR ${rewardQueries[rewardOption]}`;
      }, `${query} AND (`) + ')'
    );
  }
  return query;
};

export const filterStatus = ({ query, status }: { query: string; status: LoyaltyProjectStatuses[] }) => {
  const statusQueries = {
    [LoyaltyProjectStatuses.Active]: FILTER_BY_ACTIVE,
    [LoyaltyProjectStatuses.Expired]: FILTER_BY_EXPIRED,
    [LoyaltyProjectStatuses.Participating]: FILTER_BY_PARTICIPATING,
    [LoyaltyProjectStatuses.Soon]: FILTER_BY_SOON,
  };

  if (status.length > 0) {
    return (
      status.reduce((acc, statusOption, index) => {
        if (index === 0) {
          return `${acc} ${statusQueries[statusOption]}`;
        }
        return `${acc} OR ${statusQueries[statusOption]}`;
      }, `${query} AND (`) + ')'
    );
  }

  return query;
};

export const sort = ({ query }: { query: string }) => `${query} ${SORT_BY_CUSTOM_SORT_ORDER}`;

export const paginate = ({ query, paginate }: { query: string; paginate?: boolean }) => {
  if (!paginate) return query;

  return `${query} ${PAGINATE}`;
};

export const getResult = async ({
  baseQuery,
  filterBaseQuery,
  countQuery,
  filterCountQuery,
  investorId,
  searchTitle,
  page,
  reward,
  paginate,
}: {
  baseQuery: string;
  filterBaseQuery: string;
  countQuery: string;
  filterCountQuery: string;
  investorId?: number;
  searchTitle: string;
  page: number;
  reward: LoyaltyProjectRewards[];
  paginate?: boolean;
}) => {
  const PER_PAGE = 9;
  const skip = (page - 1) * PER_PAGE;

  const baseParameters = paginate
    ? [
        LoyaltyProjectStatuses.Soon,
        LoyaltyProjectStatuses.Expired,
        LoyaltyProjectStatuses.Participating,
        LoyaltyProjectStatuses.Active,
        investorId || null,
        searchTitle || '',
        QuestType.Scoreboard,
        QuestType.LuckyDraw,
        PER_PAGE,
        skip,
      ]
    : [
        LoyaltyProjectStatuses.Soon,
        LoyaltyProjectStatuses.Expired,
        LoyaltyProjectStatuses.Participating,
        LoyaltyProjectStatuses.Active,
        investorId || null,
        searchTitle || '',
        QuestType.Scoreboard,
        QuestType.LuckyDraw,
      ];

  const countParameters = [
    LoyaltyProjectStatuses.Soon,
    LoyaltyProjectStatuses.Expired,
    LoyaltyProjectStatuses.Participating,
    LoyaltyProjectStatuses.Active,
    investorId || null,
    searchTitle || '',
    QuestType.Scoreboard,
    QuestType.LuckyDraw,
  ];

  const manager = getManager();

  const [projects, [{ total }]] = await Promise.all([
    manager.query(`${baseQuery} ${filterBaseQuery}`, baseParameters) as Promise<QuestShort[]>,
    manager.query(`${countQuery} ${filterCountQuery}`, countParameters) as Promise<[{ total: number }]>,
  ]);

  return {
    projects,
    total,
  };
};
