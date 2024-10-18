import {
  LoyaltyProjectFilterOptions,
  LoyaltyProjectRewards,
  LoyaltyProjectStatuses,
  LoyaltyProjectCampaign,
  ProfileLoyaltyProjectFilterOptions,
} from '../../db/types/interfaces/loyalty';

interface IGetFilterOptionsQuery {
  campaign?: string;
  reward?: string;
  status?: string;
  partner?: string;
  visible?: string;
  featured?: string;
  trending?: string;
  paginate?: string;
  full?: string;
  search?: string;
  page?: string;
}

interface IGetProfileFilterOptionsQuery {
  campaign?: string;
  reward?: string;
  status?: string;
  partner?: string;
  visible?: string;
  featured?: string;
  trending?: string;
  paginate?: string;
  full?: string;
  search?: string;
  page?: string;
  projectType?: string;
}

export const getProfileFilterOptions = (query: IGetProfileFilterOptionsQuery): ProfileLoyaltyProjectFilterOptions => {
  const filterOptions: ProfileLoyaltyProjectFilterOptions = {
    campaign: [],
    reward: [],
    status: query.status
      ? ((query.status as string).split(',') as LoyaltyProjectStatuses[]).map((value) => `'${value}'`).join(',')
      : `'expired','participating','win'`,
    partner: null,
    visible: !query.visible || query.visible === 'true',
    featured: query.featured === 'true',
    trending: query.trending === 'true',
    paginate: !query.paginate || query.paginate === 'true',
    full: query.full === 'true',
    page: 1,
    search: query.search || '',
    rewardTypes: query.reward
      ? query.reward
          .split(',')
          .map((value) => `'${value}'`)
          .join(',')
      : `'nft','token','whitelist','aq'`,
    questTypes: query.projectType
      ? query.projectType
          .split(',')
          .map((value) => `'${value}'`)
          .join(',')
      : `'scoreboard','guaranteed','luckyDraw'`,
  };

  const stringPage = query.page;
  filterOptions.page = isNaN(Number(stringPage)) || Number(stringPage) < 1 ? 1 : Number(stringPage);

  if (query.partner) filterOptions.partner = query.partner;

  if (query.campaign)
    filterOptions.campaign = addOptions<LoyaltyProjectCampaign>(query.campaign, LoyaltyProjectCampaign);

  if (query.reward) filterOptions.reward = addOptions<LoyaltyProjectRewards>(query.reward, LoyaltyProjectRewards);

  return filterOptions;
};

export const getFilterOptions = (query: IGetFilterOptionsQuery): LoyaltyProjectFilterOptions => {
  const filterOptions: LoyaltyProjectFilterOptions = {
    campaign: [],
    reward: [],
    status: [],
    partner: null,
    visible: !query.visible || query.visible === 'true',
    featured: query.featured === 'true',
    trending: query.trending === 'true',
    paginate: !query.paginate || query.paginate === 'true',
    full: query.full === 'true',
    page: 1,
    search: query.search || '',
  };

  const stringPage = query.page;
  filterOptions.page = isNaN(Number(stringPage)) || Number(stringPage) < 1 ? 1 : Number(stringPage);

  if (query.partner) filterOptions.partner = query.partner;

  if (query.campaign)
    filterOptions.campaign = addOptions<LoyaltyProjectCampaign>(query.campaign, LoyaltyProjectCampaign);

  if (query.reward) filterOptions.reward = addOptions<LoyaltyProjectRewards>(query.reward, LoyaltyProjectRewards);

  if (query.status) filterOptions.status = addOptions<LoyaltyProjectStatuses>(query.status, LoyaltyProjectStatuses);

  return filterOptions;
};

const addOptions = <T>(query: string, enumValues: Record<string, string>): T[] => {
  const options: T[] = [];
  const trendingOptions = query.split(',');
  trendingOptions.forEach((option) => {
    if (Object.values<string>(enumValues).includes(option)) {
      options.push(option as unknown as T);
    }
  });
  return options;
};
