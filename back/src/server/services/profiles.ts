import { loyaltyRewardModel } from '../../db/models/loyaltyRewardModel';
import { ExperienceLevel, LoyaltyProject, LoyaltyReward } from '../../db/entity';
import { getClaimingStatus } from './blockchain/reward/alphaTreasury';
import { RequestLogger } from './logger';
import { LoyaltyTaskType, ProfileLoyaltyProjectFilterOptions } from '../../db/types/interfaces/loyalty';
import { experienceProgressModel } from '../../db/models/experienceProgress.model';
import { experienceTaskModel } from '../../db/models/experienceTask.model';
import { NotFoundError, NotFoundErrorKeys } from '../errors';
import { emailUserModel, googleUserModel, investorModel, loyaltyProjectModel } from '../../db/models';
import { experienceLevelModel } from '../../db/models/experienceLevelModel';
import { getConcurentVisitCount, getCurrentExperienceLevel } from './experience';
import { LoyaltyProjectRewards } from '../../db/types/interfaces/loyalty';
import { getCurrentPrizePool, getInvestorProgress } from './loyalty/loyaltyProject';
import { getConfig } from '../config';
import { loyaltyTaskModel } from '../../db/models/loyaltyTaskModel';
import { UserModalSettingsTypes } from '../../db/types/interfaces/UserModalSettings.types';
import { userModalSettingsModel } from '../../db/models/UserModalSettings.model';
const { EXPERIENCE_LEVEL_CHAIN_ID, EXPERIENCE_LEVEL_CONTRACT_ADDRESS } = getConfig();
const logger = new RequestLogger();

interface IGetQuestsByInvestor extends LoyaltyReward {
  isClaimed: boolean;
  loyaltyProject: LoyaltyProject;
}

export const getRewardsByInvestor = async (
  investorId: number,
  filterOptions: ProfileLoyaltyProjectFilterOptions,
  isClaimed: string | undefined,
): Promise<IGetQuestsByInvestor[]> => {
  filterOptions.status = 'win';

  filterOptions.reward =
    filterOptions.reward.length == 0
      ? [LoyaltyProjectRewards.NFT, LoyaltyProjectRewards.Token, LoyaltyProjectRewards.Whitelist]
      : filterOptions.reward;
  const investorQuests = (await getQuestsByInvestor(investorId, filterOptions)).filter(
    (quest) => quest.isWinner,
  ) as LoyaltyProject[];

  let rewards: IGetQuestsByInvestor[] = [];
  for (let i = 0; i < investorQuests.length; i++) {
    const projectRewards = await loyaltyRewardModel.getAllByProjectId(investorQuests[i].id, true);
    const investorProgress = await getInvestorProgress(investorQuests[i].id, investorId);

    const currentPrizePool = await getCurrentPrizePool({
      rewards: projectRewards,
      investorPlace: investorProgress.place,
      earnedPoints: investorProgress.earnedPoints,
      questType: investorQuests[i].projectType,
    });

    rewards = [
      ...rewards,
      ...(
        await Promise.all(
          currentPrizePool.rewards.map(async (reward) => {
            try {
              const isClaimed = !!(await getClaimingStatus(
                reward.contract.chainId,
                reward.loyaltyProjectId || 0,
                reward.id,
                investorId,
              ));

              return {
                ...reward,
                loyaltyProject: investorQuests[i],
                isClaimed,
              };
            } catch (error) {
              logger.error(error);
              return {
                ...reward,
                loyaltyProject: investorQuests[i],
                isClaimed: false,
              };
            }
          }),
        )
      ).filter((item) => item.contract.name.toLowerCase().includes(filterOptions.search.toLowerCase())),
    ];
  }

  if (isClaimed === 'true' || isClaimed === 'false') {
    rewards = rewards.filter((reward) => reward.isClaimed === true);
  }

  const investor = await investorModel.getByInvestorId(investorId);
  const loyaltyTask = await loyaltyTaskModel.getByType(LoyaltyTaskType.SignUp, ['loyaltyProject']);

  if (investor?.experienceLevelId) {
    const profileNftReward = {
      id: 1,
      amount: 1,
      isClaimable: true,
      description: '',
      startPlace: 1,
      endPlace: 3,
      loyaltyProjectId: null,
      investorId: investorId,
      contractId: null,
      verified: true,
      tokenIds: [],
      contract: {
        id: 1,
        name: investor.experienceLevel?.name,
        symbol: investor.experienceLevel?.name,
        logo: investor.experienceLevel?.image,
        chainId: EXPERIENCE_LEVEL_CHAIN_ID,
        isVerified: true,
        address: EXPERIENCE_LEVEL_CONTRACT_ADDRESS,
        standard: 'erc20',
        decimals: 6,
        type: 'nft',
        investorId: investorId,
      },
      loyaltyProject: loyaltyTask.loyaltyProject,
      isClaimed: true,
    };

    rewards.push(profileNftReward as any);
  }

  return rewards;
};

export const getQuestsByInvestor = async (
  investorId: number,
  filterOptions: ProfileLoyaltyProjectFilterOptions,
): Promise<any> => {
  const loyaltyProjects = await loyaltyProjectModel.getInvestorQuests({
    investorId,
    rewardTypes: filterOptions.rewardTypes,
    search: filterOptions.search,
    visible: filterOptions.visible,
    questType: filterOptions.questTypes,
  });

  const quests: Array<object> = [];
  for (let i = 0; i < loyaltyProjects.length; i++) {
    const currElem = loyaltyProjects[i];

    currElem.rewards = currElem.rewards.reduce((acc, item) => {
      if (!acc.find((elem) => elem.contract.id === item.contract.id)) {
        acc.push(item);
      }
      return acc;
    }, []);

    currElem.isWinner =
      (currElem.isWinner || // lucky draw check
        (currElem.threshold && currElem.threshold <= currElem.earnedPoints) || // guaranteed check
        (currElem.startPlace <= Number(currElem.place) && Number(currElem.endPlace >= currElem.place))) &&
      currElem.endAt <= new Date(); // scoreboard check

    if (currElem.isWinner) {
      currElem.status = 'win';
    }

    if (filterOptions.status && filterOptions.status.includes(currElem.status)) {
      quests.push(currElem);
    }
  }

  return quests;
};

export const getProfileExperience = async (investorId: number): Promise<any> => {
  const experienceLevels = await experienceLevelModel.findAll({});
  const investor = await investorModel.findOneByParams({ id: investorId }, ['experienceLevel']);

  if (!investor) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `investor ${investorId} do not have experienceLevel`);
  }

  let levels: (ExperienceLevel & { isClaimed: boolean })[] = [];

  for (const experienceLevel of experienceLevels) {
    levels.push({
      ...experienceLevel,
      isClaimed: investor.experienceLevelId === experienceLevel.id,
    });
  }
  levels = levels.sort((a, b) => a.pointsFrom - b.pointsFrom);

  const experienceProgresses = await experienceProgressModel.findByParams({
    params: { investorId },
    relations: ['experienceTask'],
  });

  const allExperieceTasks = await experienceTaskModel.findByParams({});

  const dailyVisitExperieceTask = allExperieceTasks.find((elem) => elem.type === 'dailyVisit');
  const totalExpPoints = experienceProgresses.reduce((total, progress) => total + progress.earnedPoints, 0);
  const dailyExperienceProgresses = experienceProgresses.filter((progress) => progress.type == 'dailyVisit');

  const uniqueCompletedTypes: string[] = [
    ...new Set(experienceProgresses.map((progress) => progress.experienceTask.type)),
  ];

  const notCompletedExpTasks = allExperieceTasks.filter((exTask) => !uniqueCompletedTypes.includes(exTask.type));

  if (
    !dailyVisitExperieceTask ||
    !dailyVisitExperieceTask.body ||
    !dailyVisitExperieceTask.body.concurrentDailyVisitPoints
  ) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound);
  }

  const consecutiveDays = await getConcurentVisitCount(investorId);
  const dailyVisitData: { points: number; completed: boolean; isClaimed: boolean }[] = [];

  for (let i = 0; i < Math.max(consecutiveDays, 7); i++) {
    dailyVisitData.push({
      points:
        i < 7
          ? dailyVisitExperieceTask.body.concurrentDailyVisitPoints[i]
          : dailyVisitExperieceTask.body.concurrentDailyVisitPoints[6],
      completed: i < consecutiveDays ? true : false,
      isClaimed:
        dailyExperienceProgresses[consecutiveDays - 1 - i] && i < consecutiveDays
          ? dailyExperienceProgresses[consecutiveDays - 1 - i].earnedPoints != 0
          : false,
    });
  }
  const currentLevel = await getCurrentExperienceLevel(investorId);
  const nextLevel = levels.filter((level) => level.pointsFrom >= (currentLevel?.pointsTo as number))[0];

  return {
    notCompletedExpTasks,
    dailyVisitData,
    totalExpPoints,
    levels,
    currentLevel,
    nextLevel,
  };
};

export const getUserModalSettingsByTypeAndInvestorId = (type: UserModalSettingsTypes, investorId: number) => {
  return userModalSettingsModel.findByTypeAndInvestorId(type, investorId);
};

export const createUserModalSettingsByTypeAndInvestorId = (type: UserModalSettingsTypes, investorId: number) => {
  return userModalSettingsModel.create({
    investorId,
    type,
  });
};

export const getUserEmailByInvestorId = async (investorId: number) => {
  const googleUser = await googleUserModel.getByInvestorId(investorId);
  if (googleUser) {
    return googleUser;
  }

  const emailUser = await emailUserModel.getByInvestorId(investorId);
  if (emailUser) {
    return emailUser;
  }

  return null;
};

export const getUserByEmail = async (email: string) => {
  const googleUser = await googleUserModel.getByEmail(email);
  if (googleUser) {
    return googleUser;
  }

  const emailUser = await emailUserModel.getByEmail(email);
  if (emailUser) {
    return emailUser;
  }

  return null;
};
