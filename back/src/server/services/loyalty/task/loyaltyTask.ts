import { LoyaltyProject, LoyaltyTask } from '../../../../db/entity';
import { loyaltyProjectModel, taskProgressModel } from '../../../../db/models';
import { loyaltyTaskModel } from '../../../../db/models/loyaltyTaskModel';
import { BadRequestError, BadRequestErrorKeys } from '../../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../../errors/NotFoundError';
import { twitterApiService } from '../../apis/twitterApiService';
import { discordApiService } from '../../apis/discordApiService';
import { CreateLoyaltyTaskDto, UpdateLoyaltyTaskDto } from '../../../../db/types/interfaces/loyalty/LoyaltyTaskDto';
import { LoyaltyTaskBody, LoyaltyTaskType } from '../../../../db/types/interfaces/loyalty';
import { InviteTaskBody } from '../../../../db/types/interfaces/loyalty/tasks';
import { Logger } from '../../logger';
import { getDecimals } from '../../blockchain/erc20';

const log = new Logger();

const loyaltyTaskMapping = (loyaltyTask: LoyaltyTask, data) => {
  loyaltyTask.title = data.title;
  loyaltyTask.points = data.points;
  loyaltyTask.startAt = data.startAt || null;
  loyaltyTask.endAt = data.endAt || null;
  loyaltyTask.type = data.type;
  loyaltyTask.sortOrder = data.sortOrder || 0;
  loyaltyTask.body = bodyMapping(data.type, data);

  return loyaltyTask;
};

const dataToLoyaltyTask = (createTaskDto: CreateLoyaltyTaskDto) => {
  return loyaltyTaskMapping(new LoyaltyTask(), createTaskDto);
};

const getTweetId = ({ tweetId, tweetLink }: { tweetId?: string; tweetLink?: string }) => {
  if (tweetId) return tweetId;
  if (tweetLink) {
    const split = tweetLink.split('/');

    return extractBaseString(split[split.length - 1]);
  }

  return '';
};

function extractBaseString(input: string): string {
  const pattern = /^([^?]+)/;
  const match = input.match(pattern);
  return match ? match[1] : input;
}

const bodyMapping = (type: LoyaltyTaskType, data): LoyaltyTaskBody => {
  switch (type) {
    case LoyaltyTaskType.VisitLink:
    case LoyaltyTaskType.Medium:
      return {
        link: data.link,
        description: data.description || null,
      };
    case LoyaltyTaskType.ReferralLink:
    case LoyaltyTaskType.CheckSpaceTwitter:
      return {
        redirectLink: data.redirectLink,
        description: data.description || null,
      };
    case LoyaltyTaskType.Quiz:
      return {
        description: data.description,
        answers: Array.isArray(data.answers) ? data.answers : data.answers.split(','),
        maxAnswers: data.maxAnswers,
      };
    case LoyaltyTaskType.FollowTwitter:
      return {
        username: data.username,
        userId: data.userId,
        description: data.description || null,
      };
    case LoyaltyTaskType.MentionTwitter:
      return {
        mentionUserId: data.mentionUserId,
        mentionUserName: data.mentionUserName,
        description: data.description || null,
        additionalProgram: data.additionalProgram || null,
      };
    case LoyaltyTaskType.TweetTwitter:
      return {
        tweetText: data.tweetText,
        description: data.description || null,
      };
    case LoyaltyTaskType.ReTweetTwitter:
      return {
        tweetId: getTweetId({ tweetId: data.tweetId, tweetLink: data.tweetLink }),
        tweetLink: data.tweetLink,
        description: data.description || null,
      };
    case LoyaltyTaskType.LikeTweetTwitter:
      return {
        tweetId: getTweetId({ tweetId: data.tweetId, tweetLink: data.tweetLink }),
        tweetLink: data.tweetLink,
        description: data.description || null,
        additionalProgram: data.additionalProgram || null,
      };
    case LoyaltyTaskType.CommentTweetTwitter:
      return {
        tweetId: getTweetId({ tweetId: data.tweetId, tweetLink: data.tweetLink }),
        tweetLink: data.tweetLink,
        description: data.description || null,
      };
    case LoyaltyTaskType.ReTweetQuoteTwitter:
      return {
        tweetId: getTweetId({ tweetId: data.tweetId, tweetLink: data.tweetLink }),
        tweetLink: data.tweetLink,
        description: data.description || null,
        additionalProgram: data.additionalProgram || null,
      };
    case LoyaltyTaskType.Suggestion:
    case LoyaltyTaskType.Email:
    case LoyaltyTaskType.CustomWebhook:
      return {
        description: data.description,
        regex: data.regex || null,
      };
    case LoyaltyTaskType.JoinDiscord:
      return {
        serverId: data.serverId,
        inviteLink: data.inviteLink,
        description: data.description || null,
      };
    case LoyaltyTaskType.RoleDiscord:
      return {
        serverId: data.serverId,
        roleId: data.roleId,
        roleName: data.roleName,
        description: data.description || null,
        inviteLink: data.inviteLink,
      };
    case LoyaltyTaskType.Partner:
      return {
        partnerTask: data.partnerTask,
        description: data.description || null,
      };
    case LoyaltyTaskType.JoinTelegram:
      return {
        description: data.description || null,
        chatId: data.chatId,
        inviteLink: data.inviteLink,
      };
    case LoyaltyTaskType.SignUp:
      return {
        description: data.description,
        isOnboardingTask: data.isOnboardingTask,
        onboardingTitle: data.onboardingTitle,
        onboardingDescription: data.onboardingDescription,
      };
    case LoyaltyTaskType.WatchVideo: {
      return {
        description: data.description,
        videoId: data.videoId,
      };
    }
    case LoyaltyTaskType.CompletedOnboarding:
      return {
        description: data.description,
        isOnboardingTask: true,
        buttonText: data.buttonText,
        linkTitle: data.linkTitle,
      };
    case LoyaltyTaskType.Token:
      return {
        description: data.description,
        address: data.address,
        minTokenAmount: data.minTokenAmount,
        chainId: data.chainId,
        decimals: data.decimals,
      };
    case LoyaltyTaskType.NFT:
      return {
        description: data.description,
        address: data.address,
        minTokenAmount: data.minTokenAmount,
        chainId: data.chainId,
        standard: data.standard || 'ERC721',
      };
    case LoyaltyTaskType.BlockchainUser:
      return {
        description: data.description,
        minTransactions: data.minTransactions,
        chainId: data.chainId,
      };
    case LoyaltyTaskType.ValueHolder:
      return {
        description: data.description,
        minUSDValue: data.minUSDValue,
        chainId: data.chainId,
      };
    case LoyaltyTaskType.NativeHolder:
      return {
        description: data.description,
        minValue: data.minValue,
        chainId: data.chainId,
      };
    case LoyaltyTaskType.Daily:
      return {
        description: data.description,
        subTasks: data.subTasks.map((subTask, id) => ({
          ...subTask,
          id,
        })),
      };
    case LoyaltyTaskType.DEXLiquidityProvider:
      return {
        contractAddress: data.contractAddress,
        description: data.description,
        chainId: data.chainId,
        methodAbi: typeof data.methodAbi === 'string' ? JSON.parse(data.methodAbi) : data.methodAbi,
        eventsQuantity: data.eventsQuantity || null,
      };
    case LoyaltyTaskType.ImageUpload:
      return {
        description: data.description,
      };
    case LoyaltyTaskType.Invite:
      return {
        description: data.description,
        scorePercentage: data.scorePercentage,
        username: data.username || null,
      };
    case LoyaltyTaskType.Bridge:
      return {
        bridgeAddress: data.bridgeAddress,
        description: data.description,
        chainId: data.chainId,
        methodAbi: typeof data.methodAbi === 'string' ? JSON.parse(data.methodAbi) : data.methodAbi,
        tokenAddress: data.tokenAddress,
      };
    case LoyaltyTaskType.GitCoin:
      return {
        description: data.description,
        gitCoinApiKey: data.gitCoinApiKey,
        gitCoinScorerId: data.gitCoinScorerId,
        threshold: data.threshold,
      };
    case LoyaltyTaskType.OnChainEvent:
      return {
        description: data.description,
        contractAddress: data.contractAddress,
        chainId: data.chainId,
        abi: data.abi,
        eventName: data.eventName,
        conditions: data.conditions,
        eventsQuantity: data.eventsQuantity || null,
      };
  }
};

export const checkLoyaltyTaskExists = async (id: number) => {
  const loyaltyTask = await loyaltyTaskModel.getById(Number(id));
  if (!loyaltyTask) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Task does not exist');

  return loyaltyTask;
};

export const deleteById = (id: number) => loyaltyTaskModel.delete(id);

export const createLoyaltyTask = async (
  loyaltyProjectLinkTitle: LoyaltyProject['linkTitle'],
  createTaskDto: CreateLoyaltyTaskDto,
  investorId: number,
) => {
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitle(loyaltyProjectLinkTitle);
  if (!loyaltyProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, `loyaltyProject doesn't exist`);

  log.info(`loyaltyProject ${loyaltyProject.id} found`);

  switch (createTaskDto.type) {
    case LoyaltyTaskType.MentionTwitter:
      createTaskDto.mentionUserId = await twitterApiService.fetchTwitterIdByUsername(
        createTaskDto.mentionUserName,
        investorId,
      );
      break;

    case LoyaltyTaskType.FollowTwitter:
      createTaskDto.userId = await twitterApiService.fetchTwitterIdByUsername(createTaskDto.username, investorId);
      break;

    case LoyaltyTaskType.Invite:
      createTaskDto.points = 0;

      if (!createTaskDto.scorePercentage || createTaskDto.scorePercentage > 100 || createTaskDto.scorePercentage <= 0) {
        throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
      }
      break;

    case LoyaltyTaskType.Token:
      createTaskDto.decimals = await getDecimals(createTaskDto.address, createTaskDto.chainId);
      break;

    case LoyaltyTaskType.JoinDiscord:
    case LoyaltyTaskType.RoleDiscord:
      // TODO: [pultik] do we need this "if"?  isn't the body invalid without the inviteLink?
      if (createTaskDto.inviteLink) {
        log.info(`trying to get serverId for ${createTaskDto.type} task`);
        // TODO: [pultik] vvv here could be 404/429/whatever. We need to handle this
        createTaskDto.serverId = await discordApiService.getServerIdByInviteLink(createTaskDto.inviteLink);
        log.info(`serverId got successfully: ${createTaskDto.serverId}`);
      }
      break;
  }

  createTaskDto.startAt = createTaskDto.startAt ? new Date(createTaskDto.startAt) : null;
  createTaskDto.endAt = createTaskDto.endAt ? new Date(createTaskDto.endAt) : null;

  const loyaltyTask = dataToLoyaltyTask(createTaskDto);

  loyaltyTask.loyaltyProjectId = loyaltyProject.id;
  loyaltyTask.taskProgress = [];

  const savedLoyaltyTask = await loyaltyTaskModel.create(loyaltyTask);

  return loyaltyTaskModel.getById(savedLoyaltyTask.id);
};

export const updateLoyaltyTask = async (
  loyaltyTaskId: LoyaltyTask['id'],
  updateTaskDto: UpdateLoyaltyTaskDto,
  investorId: number,
) => {
  log.info(`${loyaltyTaskId} | ${JSON.stringify(updateTaskDto)}`);
  const loyaltyTask = await loyaltyTaskModel.getById(loyaltyTaskId);
  if (!loyaltyTask) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Task does not exist');

  switch (updateTaskDto.type) {
    case LoyaltyTaskType.MentionTwitter:
      if (updateTaskDto.mentionUserName) {
        updateTaskDto.mentionUserId = await twitterApiService.fetchTwitterIdByUsername(
          updateTaskDto.mentionUserName,
          investorId,
        );
      }
      break;

    case LoyaltyTaskType.FollowTwitter:
      if (updateTaskDto.username) {
        updateTaskDto.userId = await twitterApiService.fetchTwitterIdByUsername(updateTaskDto.username, investorId);
      }
      break;

    // TODO: [pultik] why do we need !updateTaskDto.scorePercentage here? isn't the body invalid without it?
    case LoyaltyTaskType.Invite:
      if (!updateTaskDto.scorePercentage || updateTaskDto.scorePercentage > 100 || updateTaskDto.scorePercentage <= 0) {
        throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
      }
      break;

    case LoyaltyTaskType.Token:
      updateTaskDto.decimals = await getDecimals(updateTaskDto.address, updateTaskDto.chainId);
      break;

    case LoyaltyTaskType.JoinDiscord:
    case LoyaltyTaskType.RoleDiscord:
      // TODO: [pultik] do we need this "if"?  isn't the body invalid without the inviteLink?
      if (updateTaskDto.inviteLink) {
        log.info(`trying to get serverId for ${updateTaskDto.type} task`);
        // TODO: [pultik] vvv here could be 404/429/whatever. We need to handle this
        updateTaskDto.serverId = await discordApiService.getServerIdByInviteLink(updateTaskDto.inviteLink);
        log.info(`serverId got successfully: ${updateTaskDto.serverId}`);
      }
      break;
  }

  if (updateTaskDto.type !== loyaltyTask.type || !isBodyValid(updateTaskDto)) {
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `body of task ${updateTaskDto.id} doesn't have required fields with this type`,
    );
  }

  const updatedLoyaltyTask = loyaltyTaskMapping(loyaltyTask, { ...loyaltyTask, ...loyaltyTask.body, ...updateTaskDto });

  return loyaltyTaskModel.update(updatedLoyaltyTask);
};

export const updateAndReplaceLoyaltyTasks = async (
  linkTitle: string,
  dto: Array<CreateLoyaltyTaskDto | UpdateLoyaltyTaskDto>,
  investorId: number,
) => {
  let taskIdsToRemove: number[] = await loyaltyTaskModel
    .getByLoyaltyLinkTitle(linkTitle)
    .then((tasks) => tasks.map((item) => item.id));

  await Promise.all(
    dto.map(async (item) => {
      if ((item as UpdateLoyaltyTaskDto).id) {
        taskIdsToRemove = taskIdsToRemove.filter((id) => id !== (item as UpdateLoyaltyTaskDto).id);
        return await updateLoyaltyTask(
          (item as UpdateLoyaltyTaskDto).id as number,
          item as UpdateLoyaltyTaskDto,
          investorId,
        );
      }
      return await createLoyaltyTask(linkTitle, item as CreateLoyaltyTaskDto, investorId);
    }),
  );
  log.info(`taskIdsToRemove: ${taskIdsToRemove}`);
  await Promise.all(taskIdsToRemove.map((id) => loyaltyTaskModel.delete(id)));
};

const isBodyValid = (updateTaskDto: UpdateLoyaltyTaskDto) => {
  if (!updateTaskDto.type) return false;

  let isValidBody = true;
  const newBody = bodyMapping(updateTaskDto.type, updateTaskDto);

  log.info(`newBody: ${JSON.stringify(newBody)}`);

  Object.keys(newBody).forEach((aKey) => {
    if (newBody[aKey] === undefined) isValidBody = false;
    log.info(`${newBody[aKey]} for ${aKey}`);
    log.info(`${isValidBody}`);
  });

  return isValidBody;
};

export const subtractInviteTaskPoints = async (
  invitedInvestorId: number,
  type: 'discord' | 'twitter' | 'telegram' | 'wallet' | 'allTypes',
) => {
  const inviterTaskProgress = await taskProgressModel.getInviterTaskProgressByInvitedInvestorId(invitedInvestorId);

  if (!inviterTaskProgress) {
    return;
  }

  let taskProgresses;
  if (type === 'discord') {
    taskProgresses = await taskProgressModel.getByInvestorAndTaskTypes(invitedInvestorId, [
      LoyaltyTaskType.JoinDiscord,
      LoyaltyTaskType.RoleDiscord,
    ]);
  } else if (type === 'twitter') {
    taskProgresses = await taskProgressModel.getByInvestorAndTaskTypes(invitedInvestorId, [
      LoyaltyTaskType.TweetTwitter,
      LoyaltyTaskType.LikeTweetTwitter,
      LoyaltyTaskType.FollowTwitter,
      LoyaltyTaskType.ReTweetQuoteTwitter,
      LoyaltyTaskType.ReTweetTwitter,
      LoyaltyTaskType.MentionTwitter,
      LoyaltyTaskType.CommentTweetTwitter,
    ]);
  } else if (type === 'telegram') {
    taskProgresses = await taskProgressModel.getByInvestorAndTaskTypes(invitedInvestorId, [
      LoyaltyTaskType.JoinTelegram,
    ]);
  } else if (type === 'wallet') {
    taskProgresses = await taskProgressModel.getByInvestorAndTaskTypes(invitedInvestorId, [
      LoyaltyTaskType.Token,
      LoyaltyTaskType.NFT,
      LoyaltyTaskType.BlockchainUser,
      LoyaltyTaskType.ValueHolder,
      LoyaltyTaskType.NativeHolder,
      LoyaltyTaskType.DEXLiquidityProvider,
    ]);
  } else if (type === 'allTypes') {
    const json = inviterTaskProgress.json as InviteTaskBody;
    json.invitedInvestorIds = json.invitedInvestorIds.filter((investorId) => investorId !== invitedInvestorId);
    inviterTaskProgress.json = json;
    await taskProgressModel.save([inviterTaskProgress]);

    taskProgresses = await taskProgressModel.getByInvestorAndTaskTypes(
      invitedInvestorId,
      Object.values(LoyaltyTaskType),
    );
  }

  let totalEarnedInvitePoints = 0;
  for (const taskProgress of taskProgresses) {
    totalEarnedInvitePoints += parseFloat(
      (
        (+taskProgress.earnedPoints / 100) *
        +(inviterTaskProgress.loyaltyTask.body as InviteTaskBody).scorePercentage
      ).toFixed(2),
    );
  }

  inviterTaskProgress.earnedPoints -= totalEarnedInvitePoints;
  await taskProgressModel.save([inviterTaskProgress]);
};
