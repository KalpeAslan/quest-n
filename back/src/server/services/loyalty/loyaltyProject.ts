import { Logger } from '../logger';
import { generateS3Path } from '../generateS3Path';

import { getLocalization } from '../localization';

import { loyaltyProjectModel, partnerProjectModel, tokensStorageModel } from '../../../db/models';
import { LoyaltyProject, LoyaltyReward, LoyaltyTask, TaskProgress } from '../../../db/entity';

import { getTasksBody } from './task';
import {
  GetLoyaltyProjectsResponse,
  LoyaltyProjectFilterOptions,
  LoyaltyProjectStatuses,
  LoyaltyTaskDashboard,
  LoyaltyTaskStatus,
  LoyaltyTaskType,
  PartnerProject,
  Rewards,
  RewardTable,
  StickyMenuInvestorInfo,
  QuestType,
  TokenType,
  PrizePool,
} from '../../../db/types/interfaces/loyalty';
import { trendingLoyaltyProjectsModel } from '../../../db/models/tradingLoyaltyProjectsModel';
import { taskProgressModel } from '../../../db/models';
import { DailyTaskBody, DailyTaskProgressBody, QuizLoyaltyTaskBody } from '../../../db/types/interfaces/loyalty/tasks';
import {
  CreateLoyaltyProjectDto,
  UpdateLoyaltyProjectDto,
} from '../../../db/types/interfaces/loyalty/LoyaltyProjectDto';
import { getConfig } from '../../config';
import { QuizProgressBody } from '../../../db/types/interfaces/taskProgress/quiz.types';
import { MoreThan } from 'typeorm';
import { loyaltyTaskModel } from '../../../db/models/loyaltyTaskModel';
import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';
import { luckyDrawProgressModel } from '../../../db/models/luckyDrawProgress.model';
import { fixNumber, isWhiteList } from '../../helpers/common.utils';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { getClaimingDates } from '../../../db/helpers/claimingDates';
import { TokenStandardDto } from '../../../db/types/interfaces/contractDto';
import { nftModel } from '../../../db/models/nftModel';
import { onChainTransactionsHistoryModel } from '../../../db/models/onChainTransactionsHistoryModel';
import { isClaimed } from './claimAqTokens';

const log = new Logger();

const dataToLoyaltyProject = async (data: CreateLoyaltyProjectDto, partnerProjectId?: number) => {
  const project = new LoyaltyProject();
  const config = getConfig();

  project.projectName = data.projectName;
  project.title = data.projectName;
  project.description = data.description;
  project.socialDescription = data.socialDescription;
  project.linkTitle = data.linkTitle;
  project.startAt = data.startAt;
  project.endAt = data.endAt;
  project.visible = false;
  project.featured = !!data.featured;
  project.preview_img = data.previewImage || config.DEFAULT_LOYALTY_PROJECT_PREVIEW_IMAGE;
  project.projectType = data.projectType ?? QuestType.Scoreboard;

  if (data.questStatus) {
    project.questStatus = data.questStatus;
  }

  const claimDates = getClaimingDates({
    claimingDates: { start: data.claimingStartAt, end: data.claimingEndAt },
    questEndAt: project.endAt,
  });

  project.claimingStartAt = claimDates.start;
  project.claimingEndAt = claimDates.end;

  if (partnerProjectId) {
    project.partnerProjects = await partnerProjectModel.getByIds([partnerProjectId]);
  }

  return project;
};

export const createLoyaltyProject = async (data: CreateLoyaltyProjectDto, partnerProjectId: number) => {
  log.info(`createLoyaltyProject: ${{ data, partnerProjectId }}`);

  const loyaltyProject = await dataToLoyaltyProject(data, partnerProjectId);
  const savedProject = await loyaltyProjectModel.create(loyaltyProject);

  const rewards = await loyaltyRewardModel.getAllByProjectId(loyaltyProject.id);
  const fullRewards: Array<LoyaltyReward & { tokenType?: TokenType }> = [];

  for (let i = 0; i < rewards.length; i++) {
    const reward: LoyaltyReward & { tokenType?: TokenType } = rewards[i];
    reward.tokenType = reward.contract.type;
    fullRewards.push(reward);
  }

  return {
    ...(await getBaseProjectInfo(await loyaltyProjectModel.getByLinkTitle(savedProject.linkTitle))),
    description: savedProject.description,
    loyaltyTasks: savedProject.loyaltyTasks,
    fullRewards,
  };
};

export const updateLoyaltyProject = async (data: UpdateLoyaltyProjectDto, linkTitle: string) => {
  log.info(`updateLoyaltyProject ${{ data, linkTitle }}`);

  const config = getConfig();

  const loyaltyProject = await loyaltyProjectModel.getByLinkTitle(linkTitle);

  if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project does not exist');

  const claimingDates = getClaimingDates({
    claimingDates: { start: data.claimingStartAt, end: data.claimingEndAt },
    oldClaimingDates: { start: loyaltyProject.claimingStartAt, end: loyaltyProject.claimingEndAt },
    questEndAt: new Date(data.endAt || loyaltyProject.endAt),
  });

  const updatedProject = {
    ...loyaltyProject,
    ...data,
    eligibleUsersCount: loyaltyProject.eligibleUsersCount || data.eligibleUsersCount || 0,
    claimingStartAt: claimingDates.start,
    claimingEndAt: claimingDates.end,
    title: data.projectName || loyaltyProject.title || loyaltyProject.projectName,
  } as LoyaltyProject;

  updatedProject.preview_img =
    data.previewImage || loyaltyProject.preview_img || config.DEFAULT_LOYALTY_PROJECT_PREVIEW_IMAGE;

  await loyaltyProjectModel.update(updatedProject);

  const savedProject = await loyaltyProjectModel.getByLinkTitle(updatedProject.linkTitle);

  const rewards = await loyaltyRewardModel.getAllByProjectId(loyaltyProject.id);
  const fullRewards: Array<LoyaltyReward & { tokenType?: TokenType }> = [];

  for (let i = 0; i < rewards.length; i++) {
    const reward: LoyaltyReward & { tokenType?: TokenType } = rewards[i];
    reward.tokenType = reward.contract.type;
    fullRewards.push(reward);
  }

  return {
    ...(await getBaseProjectInfo(savedProject)),
    description: savedProject.description,
    loyaltyTasks: savedProject.loyaltyTasks,
    fullRewards,
  };
};

export const checkLoyaltyProjectExistsByLinkTitle = async (loyaltyProjectLinkTitle: string) => {
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitle(loyaltyProjectLinkTitle);
  if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project does not exist');

  return loyaltyProject;
};

export const checkLoyaltyProjectExistsById = async (loyaltyProjectId: number) => {
  const loyaltyProject = await loyaltyProjectModel.getById(loyaltyProjectId);
  if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project does not exist');

  return loyaltyProject;
};

export const checkLoyaltyProjectOwnership = async ({
  investorId,
  loyaltyProjectLinkTitle,
  loyaltyProjectId,
}: {
  investorId: number;
  loyaltyProjectLinkTitle?: string;
  loyaltyProjectId?: number;
}) => {
  if (!loyaltyProjectLinkTitle && !loyaltyProjectId)
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project does not exist');

  let loyaltyProject: LoyaltyProject | undefined;
  if (loyaltyProjectLinkTitle) {
    loyaltyProject = await checkLoyaltyProjectExistsByLinkTitle(loyaltyProjectLinkTitle);
  }

  if (loyaltyProjectId) {
    loyaltyProject = await checkLoyaltyProjectExistsById(loyaltyProjectId);
  }

  if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project does not exist');

  const partnerProjectLinkTitle = loyaltyProject.partnerProjects[0]?.linkTitle;
  if (!partnerProjectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project does not exist');

  return { loyaltyProject };
};

export const deleteById = (id: number) => loyaltyProjectModel.delete(id);

export const getFullByLinkTitle = async (linkTitle: string) => {
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitle(linkTitle);

  return {
    ...(await getBaseProjectInfo(loyaltyProject)),
    description: loyaltyProject.description,
    loyaltyTasks: loyaltyProject.loyaltyTasks,
    // fullRewards: loyaltyProject.body,
  };
};

export const getLoyaltyProjects = async (
  investorId: number | undefined,
  filterOptions: LoyaltyProjectFilterOptions,
): Promise<GetLoyaltyProjectsResponse> => {
  log.info('getLoyaltyProjects');

  const trendingProjectIds = await trendingLoyaltyProjectsModel.getProjectIds();

  const loyaltyProjects = await loyaltyProjectModel.getAllFiltered({
    filterOptions,
    trendingProjectIds,
    investorId,
  });

  const paginationIndex = filterOptions.page <= 1 ? 0 : (filterOptions.page - 1) * 9;

  return {
    loyaltyProjects: loyaltyProjects.result,
    isShowMore: loyaltyProjects.total - paginationIndex - 9 > 0,
    projectsTitle: loyaltyProjects.result.map((aProject) => aProject.title),
    searchCount: filterOptions.search ? loyaltyProjects.total : null,
  };
};

export const getLoyaltyProject = async (
  linkTitle: LoyaltyProject['linkTitle'],
  investorId: number | undefined,
  language?: string,
) => {
  log.info(`getLoyaltyProject ${{ linkTitle }}`);

  let isOwner = false;

  if (investorId) {
    try {
      await checkLoyaltyProjectOwnership({ investorId, loyaltyProjectLinkTitle: linkTitle });
      isOwner = true;
    } catch (error) {
      isOwner = false;
    }
  }

  try {
    const loyaltyProject = await loyaltyProjectModel.getByLinkTitleFull({ linkTitle, investorId, language, isOwner });
    if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, `project doesn't exist`);
    const rewards = await loyaltyRewardModel.getAllByProjectId(loyaltyProject.id);
    const fullRewards: Array<LoyaltyReward & { tokenType?: TokenType }> = [];

    for (let i = 0; i < rewards.length; i++) {
      const reward: LoyaltyReward & { tokenType?: TokenType } = rewards[i];
      reward.tokenType = reward.contract.type;
      fullRewards.push(reward);
    }

    loyaltyProject.fullRewards = {
      rewards: fullRewards,
    };
    return loyaltyProject;
  } catch (e) {
    log.error(`ERROR: ${e}`);
    return null;
  }
};

export async function getBaseProjectInfo(loyaltyProject: LoyaltyProject, investorId?: number) {
  const partnerProjects: PartnerProject[] = [];

  const allTasksDoneStatus = await calculateProjectTasksCount(loyaltyProject.id, investorId);

  loyaltyProject.partnerProjects.forEach((partnerProject) => {
    partnerProjects.push({
      linkTitle: partnerProject.linkTitle,
      logo: generateS3Path(partnerProject.logo),
      verificationIcon: partnerProject.verificationIcon,
      name: partnerProject.name,
    });
  });

  const project = {
    id: loyaltyProject.id,
    linkTitle: loyaltyProject.linkTitle,
    title: loyaltyProject.title || loyaltyProject.projectName,
    startAt: loyaltyProject.startAt,
    endAt: loyaltyProject.endAt,
    sortOrder: loyaltyProject.sortOrder,
    status: defineProjectStatus(loyaltyProject, allTasksDoneStatus),
    rewards: await getProjectRewards(loyaltyProject),
    partnerProjects: partnerProjects,
    featured: loyaltyProject.featured,
    visible: loyaltyProject.visible,
    preview_img: loyaltyProject.preview_img,
    projectType: loyaltyProject.projectType,
    threshold: loyaltyProject.threshold,
    eligibleUsersCount: loyaltyProject.eligibleUsersCount,
    questStatus: loyaltyProject.questStatus,
  };

  return project;
}

function defineProjectStatus(
  loyaltyProject: LoyaltyProject,
  allTasksDoneStatus: { total: number; done: number },
): LoyaltyProjectStatuses {
  const now = new Date(Date.now());
  let status: LoyaltyProjectStatuses = LoyaltyProjectStatuses.Soon;
  if (loyaltyProject.startAt == null || loyaltyProject.startAt > now) {
    status = LoyaltyProjectStatuses.Soon;
  } else if (loyaltyProject.endAt <= now) {
    status = LoyaltyProjectStatuses.Expired;
  } else if (loyaltyProject.startAt <= now && now <= loyaltyProject.endAt && allTasksDoneStatus.done > 0) {
    status = LoyaltyProjectStatuses.Participating;
  } else if (loyaltyProject.startAt <= now && now <= loyaltyProject.endAt && allTasksDoneStatus.done === 0) {
    status = LoyaltyProjectStatuses.Active;
  }
  return status;
}

async function calculateProjectTasksCount(loyaltyProjectId: number, investorId?: number) {
  const countOfCompletedTasks = await calculateCountOfCompletedTasks(loyaltyProjectId, investorId);

  return {
    total: await loyaltyTaskModel.getCount(loyaltyProjectId),
    done: countOfCompletedTasks,
  };
}

export async function calculateActiveQuests(investorId: number) {
  const taskProgresses = await taskProgressModel.getWithUniqueLoyaltyProjectIds(investorId);

  let value = 0;

  for (const progress of taskProgresses) {
    const allTasksDoneStatus = await calculateProjectTasksCount(progress.loyaltyProjectId, progress.investorId);

    const projectStatus = defineProjectStatus(progress.loyaltyProject, allTasksDoneStatus);

    if (
      allTasksDoneStatus.total === allTasksDoneStatus.done ||
      projectStatus === LoyaltyProjectStatuses.Expired ||
      projectStatus === LoyaltyProjectStatuses.Soon
    ) {
      continue;
    }
    value += 1;
  }

  return value;
}

export function calculateTotalQuests(investorId: number) {
  return taskProgressModel.getCountWithUniqueLoyaltyProjectIds(investorId);
}

export async function calculateCountOfCompletedTasks(loyaltyProjectId: number, investorId?: number) {
  if (!investorId) return 0;

  const questCompletedTasksCount = await taskProgressModel.getCount({
    investorId: investorId,
    loyaltyProjectId: loyaltyProjectId,
    earnedPoints: MoreThan(0),
  });

  return questCompletedTasksCount;
}

export async function mappingLoyaltyTasks({
  actualLoyaltyTasks,
  investorId,
  language,
}: {
  actualLoyaltyTasks: LoyaltyTask[];
  investorId?: number;
  language?: string;
}): Promise<LoyaltyTaskDashboard[]> {
  return Promise.all(
    actualLoyaltyTasks.map(async (aTask) => {
      const title =
        'isOnboardingTask' in aTask.body
          ? await getLocalization(aTask.localizationId, language, 'title').then((data) => {
              if (data) return data;
              else return aTask.title;
            })
          : aTask.title;
      const taskProgress = await taskProgressModel.getOneByConditionsWithRelations({
        investorId,
        loyaltyTaskId: aTask.id,
      });

      return {
        id: aTask.id,
        title,
        points: aTask.points,
        startAt: aTask.startAt,
        endAt: aTask.endAt,
        type: aTask.type,
        sortOrder: aTask.sortOrder,
        required: aTask.required,
        isOnboardingTask: !!('isOnboardingTask' in aTask.body),
        body: await getTasksBody(aTask, investorId, taskProgress, language),
        status: await getStatus(aTask, taskProgress),
      };
    }),
  );
}

export async function generateInvestorInfo(
  projectLinkTitle: string,
  investorId: number | undefined,
): Promise<StickyMenuInvestorInfo> {
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitleShort(projectLinkTitle);

  const rewards: LoyaltyReward[] = await loyaltyRewardModel.getAllByProjectId(loyaltyProject.id, true);

  const { rewardsTable, nftOrder } = await getRewardsPlacementTable(rewards, loyaltyProject.projectType);

  const investorProgress = await getInvestorProgress(loyaltyProject.id, investorId);

  const currentPrizePool = getCurrentPrizePool({
    rewards: rewards,
    investorPlace: investorProgress.place,
    earnedPoints: investorProgress.earnedPoints,
    questType: loyaltyProject.projectType,
  });

  const nextPrizePool = await getNextPrizePool({
    rewardsTable,
    investorPlace: investorProgress.place,
    questId: loyaltyProject.id,
    questType: loyaltyProject.projectType,
  });

  const claimingTransactions = await getClaimingTransactions(rewards, investorId);

  const isAqClaimed = await getAQClaimed(rewards, loyaltyProject.id, investorId);

  return {
    earnedPoints: investorProgress.earnedPoints,
    claimingTransactions,
    isAqClaimed,
    scoreboard: {
      place: investorProgress.place,
      currentPrizePool,
      nextPrizePool,
      rewardsTable,
      nftOrder,
    },
    luckyDraw: {
      isWinner: await getLuckyDrawIsWinner(loyaltyProject.projectType, loyaltyProject.id, investorId),
      eligibleUsersCount: await getLuckyDrawEligibleUsersCount(
        loyaltyProject.projectType,
        loyaltyProject.id,
        loyaltyProject.threshold,
      ),
    },
  };
}

export const getAQClaimed = async (rewards: LoyaltyReward[], loyaltyProjectId: number, investorId?: number) => {
  if (!rewards.find((item) => item.contract.type === TokenType.Aq) || !investorId) {
    return false;
  }

  const tokenStorage = await tokensStorageModel.getByInvestorId(investorId);
  return await isClaimed(tokenStorage.id, loyaltyProjectId);
};

export const getInvestorProgress = async (questId: number, investorId?: number) => {
  let investorProgress: {
    place: number;
    earnedPoints: number;
  };

  if (!investorId) {
    investorProgress = { place: 0, earnedPoints: 0 };
  } else {
    investorProgress = await taskProgressModel.getInvestorScoreboardInfo(questId, investorId);
  }

  return investorProgress;
};

const getRewardsPlacementTable = async (rewards: LoyaltyReward[], questType: QuestType) => {
  if (questType !== QuestType.Scoreboard) {
    return { rewardsTable: [], nftOrder: {} };
  }

  const rewardsTable: RewardTable[] = [];

  const sortedRewards = JSON.parse(JSON.stringify(rewards)).sort(function (a, b) {
    if (a.endPlace == b.endPlace) {
      return a.startPlace - b.startPlace;
    }
    return a.endPlace - b.endPlace;
  });

  const nftOrder: Record<string, number> = {};
  let nftLastOrder = 1;

  for (let i = 0; i < sortedRewards.length; i++) {
    const iPrevRewardItem = rewardsTable[i] || {
      rewards: [],
    };

    const iSortedReward = sortedRewards[i];

    rewardsTable[i] = {
      ...iPrevRewardItem,
      startPlace: iSortedReward.startPlace,
      endPlace: iSortedReward.endPlace,
      rewards: [...iPrevRewardItem.rewards, iSortedReward],
    };

    let iSymbol = iSortedReward.contract.symbol;

    let iNftImage: string | null = null;

    if (
      iSortedReward.contract.standard === TokenStandardDto.ERC1155 ||
      iSortedReward.contract.standard === TokenStandardDto.ERC721
    ) {
      iSymbol = iSortedReward.amount > 1 ? 'NFTs' : 'NFT';

      const iNftMetadata = await nftModel.getByParams({
        contractId: iSortedReward.contract.id,
        nftId: iSortedReward.tokenIds?.[0],
      });

      iNftImage = iNftMetadata?.image || null;

      const existedOrder = nftOrder[`${iSortedReward.contract.id} ${iNftMetadata?.image}`];

      if (existedOrder) {
        iSymbol += ` #${existedOrder}`;
      } else {
        iSymbol += ` #${nftLastOrder}`;
        nftOrder[`${iSortedReward.contract.id} ${iNftMetadata?.image}`] = nftLastOrder;
        nftLastOrder += 1;
      }
    }

    const iTableString = `${isWhiteList(iSortedReward) ? '' : fixNumber(iSortedReward.amount)} ${iSymbol}`;

    rewardsTable[i].placeRewards = iTableString;

    const existedRewards: Record<
      string,
      {
        amount: number;
        symbol: string;
        rewardTableString: string;
        withPlus: boolean;
      }
    > = {};

    existedRewards[`${iSortedReward.contract.id} ${iNftImage}`] = {
      amount: iSortedReward.amount,
      symbol: iSymbol,
      rewardTableString: iTableString,
      withPlus: false,
    };

    for (let j = i + 1; j < sortedRewards.length; j++) {
      const jSortedReward = sortedRewards[j];

      if (rewardsTable[i].startPlace == jSortedReward.startPlace) {
        let jSymbol = jSortedReward.contract.symbol;

        let jNftImage: string | null = null;

        if (
          jSortedReward.contract.standard === TokenStandardDto.ERC1155 ||
          jSortedReward.contract.standard === TokenStandardDto.ERC721
        ) {
          jSymbol = jSortedReward.amount > 1 ? 'NFTs' : 'NFT';

          const jNftMetadata = await nftModel.getByParams({
            contractId: jSortedReward.contract.id,
            nftId: jSortedReward.tokenIds?.[0],
          });

          jNftImage = jNftMetadata?.image || null;

          const existedOrder = nftOrder[`${jSortedReward.contract.id} ${jNftMetadata?.image}`];

          if (existedOrder) {
            jSymbol += ` #${existedOrder}`;
          } else {
            jSymbol += ` #${nftLastOrder}`;
            nftOrder[`${jSortedReward.contract.id} ${jNftMetadata?.image}`] = nftLastOrder;
            nftLastOrder += 1;
          }
        }

        const existedReward = existedRewards[`${jSortedReward.contract.id} ${jNftImage}`];

        if (existedReward && rewardsTable[i].placeRewards) {
          const newAmount = existedReward.amount + jSortedReward.amount;

          const jRewardTableString = existedReward.withPlus
            ? ` + ${isWhiteList(existedReward as any) ? fixNumber(newAmount) : ''} ${existedReward.symbol}`
            : `${fixNumber(newAmount)} ${existedReward.symbol}`;

          rewardsTable[i].placeRewards = rewardsTable[i].placeRewards?.replace(
            existedReward.rewardTableString,
            jRewardTableString,
          );

          existedReward.amount = newAmount;
          existedReward.rewardTableString = jRewardTableString;
        } else {
          const jRewardTableString = ` + ${
            isWhiteList(jSortedReward) ? '' : fixNumber(jSortedReward.amount)
          } ${jSymbol}`;

          rewardsTable[i].placeRewards += jRewardTableString;

          existedRewards[`${jSortedReward.contract.id} ${jNftImage}`] = {
            amount: jSortedReward.amount,
            symbol: jSymbol,
            rewardTableString: jRewardTableString,
            withPlus: true,
          };
        }

        rewardsTable[i].rewards.push(jSortedReward);

        jSortedReward.startPlace = Number(iSortedReward.endPlace) + 1;
      }
    }
  }

  const result: RewardTable[] = [];

  for (const item of rewardsTable) {
    if (item && item.placeRewards && item.startPlace <= item.endPlace) {
      const currElem: RewardTable = {
        startPlace: item.startPlace,
        endPlace: item.endPlace,
        place: `${item.startPlace} - ${item.endPlace}`,
        placeRewards: `${item.placeRewards}`,
        rewards: [],
      };

      const placedRewards: number[] = [];

      for (const reward of item.rewards) {
        if (!placedRewards.includes(reward.id)) {
          currElem.rewards.push(reward);
          placedRewards.push(reward.id);
        }
      }

      if (item.startPlace == item.endPlace) {
        currElem.place = `${item.startPlace}`;
      }

      result.push(currElem);
    }
  }

  return { rewardsTable: result, nftOrder };
};

export const getCurrentPrizePool = ({
  rewards,
  investorPlace,
  earnedPoints,
  questType,
}: {
  rewards: LoyaltyReward[];
  investorPlace: number;
  earnedPoints: number;
  questType: QuestType;
}): PrizePool => {
  if (questType !== QuestType.Scoreboard) {
    return {
      rewards: [],
      points: earnedPoints,
    };
  }

  const currentPrizePool: PrizePool = {
    rewards: [],
    points: earnedPoints,
  };

  for (const reward of rewards) {
    if (reward.startPlace && reward.endPlace && reward.startPlace <= investorPlace && reward.endPlace >= investorPlace)
      currentPrizePool.rewards.push(reward);
  }

  return currentPrizePool;
};

const getNextPrizePool = async ({
  rewardsTable,
  investorPlace,
  questId,
  questType,
}: {
  rewardsTable: RewardTable[];
  investorPlace: number;
  questId: number;
  questType: QuestType;
}): Promise<PrizePool> => {
  if (questType !== QuestType.Scoreboard) {
    return {
      rewards: [],
      points: 0,
    };
  }

  let nextRewardLevel: RewardTable | null = null;

  for (const item of rewardsTable) {
    if (item.endPlace < investorPlace && (!nextRewardLevel || item.endPlace > nextRewardLevel.endPlace)) {
      nextRewardLevel = item;
    }
  }

  const minPoints = nextRewardLevel
    ? await taskProgressModel.getMinPlacePoints(questId, nextRewardLevel?.startPlace, nextRewardLevel?.endPlace)
    : 0;

  return {
    rewards: nextRewardLevel?.rewards || [],
    points: minPoints + 1,
  };
};

const getLuckyDrawIsWinner = async (questType: QuestType, questId: number, investorId?: number) => {
  if (questType !== QuestType.LuckyDraw || !investorId) {
    return false;
  }
  return Boolean(await luckyDrawProgressModel.getByInvestorIdAndLoyaltyProjectId(investorId, questId));
};

const getLuckyDrawEligibleUsersCount = (questType: QuestType, questId: number, threshold?: number | null) => {
  if (questType !== QuestType.LuckyDraw || !threshold) return 0;

  return taskProgressModel.getLuckyDrawEligibleUsersCount(questId, threshold);
};

const getClaimingTransactions = async (rewards: LoyaltyReward[], investorId?: number) => {
  if (!investorId) return {};

  const rewardIds = rewards.map((item) => item.id);

  const transactions = await onChainTransactionsHistoryModel.getAllInvestorTransactionsByRewardIds(
    rewardIds,
    investorId,
  );

  return transactions.reduce((acc, item) => {
    if (!item.transactionHash) return acc;

    return { ...acc, [item.loyaltyRewardId]: item.transactionHash };
  }, {} as Record<number, string>);
};

async function getStatus(task: LoyaltyTask, taskProgress?: TaskProgress) {
  const NOW = new Date();

  if (task.type === LoyaltyTaskType.Daily) {
    const lastSubTask = (task.body as DailyTaskBody).subTasks[(task.body as DailyTaskBody).subTasks.length - 1];

    if (taskProgress) {
      const lastProgressSubTask = (taskProgress?.json as DailyTaskProgressBody[])[
        (taskProgress?.json as DailyTaskProgressBody[]).length - 1
      ];

      if (
        (lastProgressSubTask && lastProgressSubTask.id === lastSubTask.id) ||
        (taskProgress?.json as DailyTaskProgressBody[]).length === (task.body as DailyTaskBody).subTasks.length
      ) {
        return (taskProgress?.json as DailyTaskProgressBody[]).some((subTask) => subTask.status === 'confirmed')
          ? LoyaltyTaskStatus.Done
          : LoyaltyTaskStatus.Expired;
      }

      if (new Date().getTime() >= new Date(lastSubTask.endAt).getTime()) {
        return (taskProgress?.json as DailyTaskProgressBody[]).some((subTask) => subTask.status === 'confirmed')
          ? LoyaltyTaskStatus.Done
          : LoyaltyTaskStatus.Expired;
      }
    } else if (new Date().getTime() >= new Date(lastSubTask.endAt).getTime()) {
      return LoyaltyTaskStatus.Expired;
    }

    return LoyaltyTaskStatus.Active;
  }

  if (task.type === LoyaltyTaskType.Quiz) {
    if (taskProgress) {
      if (taskProgress.completedAt) return LoyaltyTaskStatus.Done;
      return (task.body as QuizLoyaltyTaskBody).maxAnswers > (taskProgress.json as QuizProgressBody[]).length
        ? LoyaltyTaskStatus.Active
        : LoyaltyTaskStatus.Expired;
    }

    if (task.endAt && new Date().getTime() >= new Date(task.endAt).getTime()) return LoyaltyTaskStatus.Expired;

    return LoyaltyTaskStatus.Active;
  }

  if (task.type === LoyaltyTaskType.ImageUpload) {
    if (taskProgress) {
      if (taskProgress.completedAt) return LoyaltyTaskStatus.Done;
      return LoyaltyTaskStatus.Active;
    }

    if (task.endAt && new Date().getTime() >= new Date(task.endAt).getTime()) return LoyaltyTaskStatus.Expired;

    return LoyaltyTaskStatus.Active;
  }

  if (taskProgress) {
    const completedTaskJson = taskProgress.json;
    if (completedTaskJson && 'unlimitedEndAt' in completedTaskJson && completedTaskJson.unlimitedEndAt) {
      if (NOW > new Date(completedTaskJson.unlimitedEndAt)) return LoyaltyTaskStatus.Done;
      return LoyaltyTaskStatus.AdditionalProgram;
    }
    return LoyaltyTaskStatus.Done;
  }

  if (task.endAt && NOW > new Date(task.endAt)) return LoyaltyTaskStatus.Expired;

  if (task.type === LoyaltyTaskType.CustomWebhook && taskProgress) {
    return LoyaltyTaskStatus.Done;
  }

  if (task.type === LoyaltyTaskType.Invite && taskProgress) {
    return LoyaltyTaskStatus.Done;
  }

  return LoyaltyTaskStatus.Active;
}

export async function getProjectRewards(loyaltyProject: LoyaltyProject) {
  const rewards: Rewards = {
    tokens: [],
  };

  const loyaltyRewards = await loyaltyRewardModel.getAllByProjectId(loyaltyProject.id);
  for (const loyaltyReward of loyaltyRewards) {
    const existingRewardIndex = rewards.tokens.findIndex((token) => token.symbol === loyaltyReward.contract.symbol);
    if (existingRewardIndex !== -1) {
      const count =
        loyaltyReward.endPlace === loyaltyReward.startPlace
          ? 1
          : loyaltyReward?.endPlace - loyaltyReward?.startPlace + 1;
      rewards.tokens[existingRewardIndex].amount += loyaltyReward.amount * count;
    } else {
      rewards.tokens.push({
        symbol: loyaltyReward.contract.symbol,
        amount: loyaltyReward.amount,
        logo: loyaltyReward.contract.logo,
      });
    }
  }

  return rewards;
}

export const getOnboardingQuestLinkTitle = async () => {
  const {
    loyaltyProject: { linkTitle },
  } = await loyaltyTaskModel.getByType(LoyaltyTaskType.SignUp, ['loyaltyProject']);

  return { linkTitle };
};
