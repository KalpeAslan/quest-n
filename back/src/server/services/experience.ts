import { experienceTaskModel } from '../../db/models/experienceTask.model';
import { experienceProgressModel } from '../../db/models/experienceProgress.model';
import { ExperienceBodyType, ExperienceTaskType } from '../../db/types/interfaces/ExperienceDto';
import dateFormat from 'dateformat';
import { Logger } from '../services/logger';
import { isCompletedAllTasksInQuest, isFirstCompletedTaskInQuest } from './loyalty/taskProgress';
import { investorModel, taskProgressModel } from '../../db/models';
import { ExperienceLevel, ExperienceProgress } from '../../db/entity';
import {
  BadRequestError,
  BadRequestErrorKeys,
  InternalServerError,
  InternalServerErrorKeys,
  NotFoundError,
  NotFoundErrorKeys,
} from '../errors';
import { getConfig } from '../config';
import Web3 from 'web3';
const web3 = new Web3();
const {
  CONTRACT_PRIVATE_KEY,
  EXPERIENCE_LEVEL_CHAIN_ID,
  EXPERIENCE_LEVEL_CONTRACT_ADDRESS,
  EXPERIENCE_LEVEL_RPC_NODE,
} = getConfig();
import { ethers } from 'ethers';
import { experienceLevelModel } from '../../db/models/experienceLevelModel';
const log = new Logger();

export const addExperience = async (
  investorId: number,
  data: {
    experienceType: ExperienceTaskType;
    experienceId?: number;
    body?: ExperienceBodyType;
  },
  questId?: number,
) => {
  const body: Record<string, string | number | boolean> = {};
  const experienceTask =
    data.experienceType === 'customTaskExperience' && data.experienceId
      ? await experienceTaskModel.findOneById(data.experienceId)
      : await experienceTaskModel.findOneByType(data.experienceType);
  const experienceProgress = await experienceProgressModel.findOneByParams({ investorId, type: data.experienceType });
  const experieceLevel: ExperienceLevel | undefined = await investorModel.getExpLevelById(investorId);

  if (!experieceLevel) {
    log.info(`Investor: ${investorId} does not have experience. Experience points do not count.`);
    return;
  }

  const uniqueExperienceTypes: ExperienceTaskType[] = [
    'connectTelegram',
    'connectTwitter',
    'connectDiscord',
    'connectWallet',
    'connectGoogle',
    'registerWithTwitter',
    'registerWithDiscord',
    'registerWithGoogle',
    'registerWithEmail',
    'registerWithPhone',
    'registerWithWallet',
    'connect2fa',
  ];

  const questLimitedExperienceTypes: ExperienceTaskType[] = [
    'winScoreboardQuest',
    'winLuckyDrawQuest',
    'winGuaranteedQuest',
    'completeFirstTask',
    'completeAllTasks',
  ];

  const uniqueQuestIds = await taskProgressModel.getUniqueQuestIdsSortedByDate(investorId);
  const allowedQuests = uniqueQuestIds.slice(0, Number(experieceLevel?.questLimit));

  if (!experienceTask) {
    log.info(`experienceTask with type ${data.experienceType} not found`);
    return;
  }

  if (questId && questLimitedExperienceTypes.includes(experienceTask.type) && !allowedQuests.includes(questId)) {
    log.info(`questLimit exceeded, questId: ${questId}`);
    return;
  }

  if (uniqueExperienceTypes.includes(experienceTask.type) && experienceProgress) {
    log.info(`experienceProgress with type ${data.experienceType} already exists`);
    return;
  }

  if (experienceTask.type == 'inviteReferral' && experienceProgress && experienceTask.body) {
    experienceTask.points = experienceTask.body.concurrentReferralPoints
      ? (experienceTask.body.concurrentReferralPoints as number) +
        calculateBonusPoints(experienceTask.body.concurrentReferralPoints as number, experieceLevel)
      : experienceTask.points + calculateBonusPoints(experienceTask.points, experieceLevel);
  }

  if (experienceTask.type == 'dailyVisit' && experienceTask.body && experienceTask.body.concurrentDailyVisitPoints) {
    // TODO should be removed, you may avoid extra query
    const experienceProgresses = await experienceProgressModel.findByParams({
      params: { investorId, type: data.experienceType },
    });

    for (const progres of experienceProgresses) {
      if (
        `${progres.createdAt.getDate()}-${progres.createdAt.getMonth()}-${progres.createdAt.getFullYear()}` ===
        `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`
      ) {
        console.log('duplicateDailyVisit');
        return;
      }
    }
  }

  if (experienceTask.type == 'dailyVisit' && experienceTask.body && experienceTask.body.concurrentDailyVisitPoints) {
    experienceTask.points = 0;
  }

  if (experienceTask.type == 'dailyLogin' && experienceTask.body && experienceTask.body.concurrentDailyLoginPoints) {
    // const loginDates = (
    //   await experienceProgressModel.findByParams({ params: { investorId, type: data.experienceType } })
    // ).map((experience) => dateFormat(experience.createdAt, 'yyyy-mm-dd'));
    // let concurentDailyLoginCount = 0;
    // const currentDate = new Date();
    // if (loginDates.includes(dateFormat(currentDate, 'yyyy-mm-dd'))) {
    //   log.info(`dailyVisit experience for current day already exists`);
    //   return;
    // }
    // currentDate.setDate(currentDate.getDate() - 1);
    // while (loginDates.includes(dateFormat(currentDate, 'yyyy-mm-dd'))) {
    //   currentDate.setDate(currentDate.getDate() - 1);
    //   concurentDailyLoginCount++;
    // }
    // experienceTask.points = 0;
    // experienceTask.points = experienceTask.body.concurrentDailyLoginPoints[concurentDailyLoginCount - 1]
    //   ? experienceTask.body.concurrentDailyLoginPoints[concurentDailyLoginCount - 1] +
    //     calculateBonusPoints(
    //       experienceTask.body.concurrentDailyLoginPoints[concurentDailyLoginCount - 1],
    //       experieceLevel,
    //     )
    //   : experienceTask.points + calculateBonusPoints(experienceTask.points, experieceLevel);
    // body.concurentDailyLoginCount = concurentDailyLoginCount;
  }

  await experienceProgressModel.create({
    experienceTaskId: experienceTask.id,
    investorId,
    type: data.experienceType,
    earnedPoints: experienceTask.points + calculateBonusPoints(experienceTask.points, experieceLevel),
    body,
  });

  return;
};

const calculateBonusPoints = (points: number, experieceLevel: ExperienceLevel) => {
  if (!experieceLevel || !experieceLevel.bonusPointsPercentage) {
    return 0;
  }

  const bonusPoints = experieceLevel?.bonusPointsPercentage * (points / 100.0);
  return bonusPoints;
};

export const addExperienceOnCompleteTask = async (investor, loyaltyProjectId) => {
  const isCompletedAllTasks = await isCompletedAllTasksInQuest(investor.id, loyaltyProjectId);
  const isFirstTaskInQuest = await isFirstCompletedTaskInQuest(investor.id, loyaltyProjectId);

  if (isCompletedAllTasks) {
    await addExperience(
      investor.id,
      {
        experienceType: 'completeAllTasks',
      },
      loyaltyProjectId,
    );
  } else if (isFirstTaskInQuest) {
    await addExperience(
      investor.id,
      {
        experienceType: 'completeFirstTask',
      },
      loyaltyProjectId,
    );
  }
};

export const subtractExperiencePoints = async (
  investorId: number,
  type: 'discord' | 'twitter' | 'telegram' | 'wallet' | '2fa' | 'google' | 'deleteAccount',
) => {
  if (type === 'google') {
    await experienceProgressModel.deleteByParams({ investorId, type: 'registerWithGoogle' });
  } else if (type === 'discord') {
    await experienceProgressModel.deleteByParams({ investorId, type: 'connectDiscord' });
    await experienceProgressModel.deleteByParams({ investorId, type: 'registerWithDiscord' });
  } else if (type === 'twitter') {
    await experienceProgressModel.deleteByParams({ investorId, type: 'connectTwitter' });
    await experienceProgressModel.deleteByParams({ investorId, type: 'registerWithTwitter' });
  } else if (type === 'telegram') {
    await experienceProgressModel.deleteByParams({ investorId, type: 'connectTelegram' });
  } else if (type === 'wallet') {
    await experienceProgressModel.deleteByParams({ investorId, type: 'connectWallet' });
    await experienceProgressModel.deleteByParams({ investorId, type: 'registerWithWallet' });
  } else if (type === '2fa') {
    await experienceProgressModel.deleteByParams({ investorId, type: 'connect2fa' });
  } else if (type === 'deleteAccount') {
    await experienceProgressModel.deleteByParams({ investorId });
  }
};

export async function getConcurentVisitCount(investorId: number): Promise<number> {
  const loginDates: ExperienceProgress[] = (
    await experienceProgressModel.findByParams({ params: { investorId, type: 'dailyVisit' } })
  ).map((experience) => dateFormat(experience.createdAt, 'yyyy-mm-dd'));

  let concurentDailyLoginCount = 0;
  const currentDate = new Date();

  while (loginDates.includes(dateFormat(currentDate, 'yyyy-mm-dd'))) {
    currentDate.setDate(currentDate.getDate() - 1);
    concurentDailyLoginCount++;
  }

  return concurentDailyLoginCount;
}

export const getExperienceHistory = async ({
  investorId,
  page = 1,
  perPage = 6,
}: {
  investorId: number;
  page?: number;
  perPage?: number;
}) => {
  const skip = (page - 1) * perPage;

  const data = await experienceProgressModel.findByParams({
    params: { investorId },
    relations: ['experienceTask'],
    take: perPage,
    skip,
  });

  return {
    data,
    totalCount: await experienceProgressModel.getCountByParams({ investorId }),
  };
};

export const claimDailyVisitExperiece = async (investorId) => {
  const dailyVisitTask: any = (await experienceTaskModel.findByParams({ type: 'dailyVisit' }))[0];
  const dailyVisitProgresses = await experienceProgressModel.findByParams({
    params: { type: 'dailyVisit', investorId },
  });
  const concurentDailyVisitCount = await getConcurentVisitCount(investorId);

  if (!dailyVisitProgresses) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'dailyVisitProgresses is not found');
  }

  if (!dailyVisitTask || !dailyVisitTask.body || !dailyVisitTask.body.concurrentDailyVisitPoints) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'dailyVisitTask does not exist');
  }

  const updatedDailyVisitProgresses: ExperienceProgress[] = [];

  for (let i = 0; i < concurentDailyVisitCount; i++) {
    updatedDailyVisitProgresses.push({
      ...dailyVisitProgresses[concurentDailyVisitCount - i - 1],
      earnedPoints: dailyVisitTask.body.concurrentDailyVisitPoints[Math.min(i, 6)],
    });
  }

  await experienceProgressModel.repository.save(updatedDailyVisitProgresses);

  return updatedDailyVisitProgresses;
};

export const mintExperienceLevel = async (investorId: number) => {
  try {
    const abi = [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'userId',
            type: 'uint256',
          },
        ],
        name: 'getMintProfileHash',
        outputs: [
          {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const investor = await investorModel.getByInvestorId(investorId);
    if (!investor) {
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `investor: ${investorId} does not exist`);
    }

    const walletAddress = investor?.walletUser?.address;
    if (!walletAddress) {
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `investor: ${investorId} does not have wallet user`,
      );
    }

    const provider = new ethers.JsonRpcProvider(EXPERIENCE_LEVEL_RPC_NODE);

    const contract = new ethers.Contract(EXPERIENCE_LEVEL_CONTRACT_ADDRESS, abi, provider);
    const mintHash = await contract.getMintProfileHash(walletAddress, investorId);
    const signer = web3.eth.accounts.privateKeyToAccount(CONTRACT_PRIVATE_KEY);
    const { signature } = signer.sign(mintHash);

    return {
      signature,
      investorId,
      chainId: EXPERIENCE_LEVEL_CHAIN_ID,
      contractAddress: EXPERIENCE_LEVEL_CONTRACT_ADDRESS,
    };
  } catch (error) {
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Error fetching getNativeTokenBalance');
  }
};

export const verifyExperienceLevel = async (investorId: number): Promise<boolean> => {
  const abi = [
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'userId',
          type: 'uint256',
        },
      ],
      name: 'isProfileMinted',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  const investor = await investorModel.getByInvestorId(investorId);
  if (!investor) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, `investor: ${investorId} does not exist`);
  }

  const walletAddress = investor?.walletUser?.address;
  if (!walletAddress) {
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `investor: ${investorId} does not have wallet user`,
    );
  }

  const provider = new ethers.JsonRpcProvider(EXPERIENCE_LEVEL_RPC_NODE);

  const contract = new ethers.Contract(EXPERIENCE_LEVEL_CONTRACT_ADDRESS, abi, provider);
  const isProfileMinted = await contract.isProfileMinted(investorId);
  if (isProfileMinted) {
    const experienceLevelOne = await experienceLevelModel.getOneByParams({ level: 1 });
    investor.experienceLevelId = experienceLevelOne?.id;
    await investorModel.update(investor);
  }

  return isProfileMinted;
};

export const getCurrentExperienceLevel = async (investorId: number): Promise<ExperienceLevel | null> => {
  const { sum } = await experienceProgressModel.getSumOfEarnedPointsByInvestorId(investorId);
  const experienceLevel = await experienceLevelModel.findCurrentLevelByPoints(sum || 0);
  if (!experienceLevel) {
    return (await experienceLevelModel.getFirstLevel()) || null;
  }
  return experienceLevel as unknown as ExperienceLevel;
};
