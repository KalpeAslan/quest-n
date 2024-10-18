import crypto from 'crypto';

import { LoyaltyTask, TaskProgress } from '../../../../db/entity';
import { encryptRefLink } from '../../crypto';
import { getConfig } from '../../../config';
import { AdditionalProgram, LoyaltyTaskBody, LoyaltyTaskType } from '../../../../db/types/interfaces/loyalty';
import {
  MentionTwitterLoyaltyTaskBody,
  NFTTaskBody,
  PartnerLoyaltyTaskBody,
  ReTweetQuoteTwitterLoyaltyTaskBody,
  TokenTaskBody,
  DailyTaskBody,
  DailyTask,
  InviteTaskBody,
} from '../../../../db/types/interfaces/loyalty/tasks';
import { NFTTypes } from '../../../../db/types/interfaces/blockchain.types';
import { DailyStatus, DailyTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/dailyTask.types';
import { ImageUploadTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/imageUploadTask.types';
import { SuggestionTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/suggestion.types';
import { QuizProgressBody, QuizTypesStatus } from '../../../../db/types/interfaces/taskProgress/quiz.types';
import { TwitterTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/twitterUnlimited.types';
import { OnChainTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/onChainTask.type';
import { EmailTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/email.types';
import { GitCoinTaskProgressBody } from '../../../../db/types/interfaces/taskProgress/gitCoinTaskProgressBody';

const config = getConfig();

export const loyaltyTaskBodyMapper = async (
  loyaltyTask: LoyaltyTask,
  investorId: number | undefined,
  taskProgress?: TaskProgress,
) => {
  switch (loyaltyTask.type) {
    case LoyaltyTaskType.Quiz:
      return quizTaskBody(loyaltyTask.body, taskProgress);
    case LoyaltyTaskType.Suggestion:
      return suggestionTaskBody(loyaltyTask.body, taskProgress);
    case LoyaltyTaskType.Email:
      return emailTaskBody(loyaltyTask.body, taskProgress);
    case LoyaltyTaskType.ReferralLink:
      return referralLinkTaskBody(loyaltyTask, investorId, taskProgress);
    case LoyaltyTaskType.MentionTwitter:
      return mentionTwitterTaskBody(loyaltyTask, taskProgress);
    case LoyaltyTaskType.ReTweetQuoteTwitter:
      return reTweetQuoteTwitterTaskBody(loyaltyTask, taskProgress);
    // case LoyaltyTaskType.LikeTweetTwitter:
    //   return reTweetQuoteTwitterTaskBody(loyaltyTask, taskProgress);
    // case LoyaltyTaskType.CommentTweetTwitter:
    //   return reTweetQuoteTwitterTaskBody(loyaltyTask, taskProgress);
    case LoyaltyTaskType.Partner:
      return partnerTaskBody(loyaltyTask, taskProgress);
    case LoyaltyTaskType.Token:
      return baseTokenTaskBody(loyaltyTask, taskProgress as TaskProgress);
    case LoyaltyTaskType.NFT:
      return baseTokenTaskBody(loyaltyTask, taskProgress as TaskProgress, (loyaltyTask.body as NFTTaskBody).standard);
    case LoyaltyTaskType.BlockchainUser:
    case LoyaltyTaskType.ValueHolder:
    case LoyaltyTaskType.NativeHolder:
      return onChainTaskBody(loyaltyTask, taskProgress as TaskProgress);
    case LoyaltyTaskType.Daily:
      return dailyTaskBody(loyaltyTask, taskProgress as TaskProgress);
    case LoyaltyTaskType.ImageUpload:
      return imageUploadTaskBody(loyaltyTask.body, taskProgress as TaskProgress);
    case LoyaltyTaskType.Invite:
      return inviteTaskBody(loyaltyTask.body, taskProgress as TaskProgress);
    case LoyaltyTaskType.GitCoin:
      return gitCoinTaskBody(loyaltyTask.body, taskProgress as TaskProgress);
    default:
      return defaultTaskBody(loyaltyTask.body, taskProgress);
  }
};

const quizTaskBody = (body: LoyaltyTaskBody, taskProgress?: TaskProgress) => {
  if (taskProgress && taskProgress.json) {
    const answer = (taskProgress.json as QuizProgressBody[]).find(
      (aAnswer) => aAnswer.status === QuizTypesStatus.COMPLETED,
    );

    if (answer)
      return {
        answer: answer.answer,
        completedAt: taskProgress.completedAt,
        description: body.description,
      };

    if ((taskProgress.json as QuizProgressBody[]).length)
      return {
        description: body.description,
        answer: taskProgress.json[(taskProgress.json as []).length - 1].answer,
      };
  }

  return {
    description: body.description,
  };
};

const suggestionTaskBody = async (body: LoyaltyTaskBody, taskProgress?: TaskProgress) => {
  if (!taskProgress) {
    return {
      description: body.description,
    };
  }

  const jsonBody = taskProgress.json as SuggestionTaskProgressBody;

  return {
    description: body.description,
    suggestionDescription: jsonBody.description,
    completedAt: taskProgress.completedAt || taskProgress.createdDate,
  };
};

const emailTaskBody = async (body: LoyaltyTaskBody, taskProgress?: TaskProgress) => {
  if (!taskProgress) {
    return {
      description: body.description,
    };
  }

  const jsonBody = taskProgress.json as EmailTaskProgressBody;

  return {
    description: body.description,
    email: jsonBody.email,
    completedAt: taskProgress.completedAt || taskProgress.createdDate,
  };
};

const referralLinkTaskBody = (loyaltyTask: LoyaltyTask, investorId?: number, taskProgress?: TaskProgress) => {
  if (taskProgress)
    return {
      description: loyaltyTask.body.description,
      completedAt: taskProgress.completedAt || taskProgress.createdDate,
    };

  return {
    description: loyaltyTask.body.description,
    redirectLink:
      `${config.APP_HOST}reflink/` +
      encryptRefLink(`${loyaltyTask.id}:${investorId}:${parseInt(crypto.randomBytes(4).toString('hex'), 16)}`),
  };
};

const mentionTwitterTaskBody = (loyaltyTask: LoyaltyTask, taskProgress?: TaskProgress) => {
  const loyaltyTaskBody = loyaltyTask.body as MentionTwitterLoyaltyTaskBody;
  if (taskProgress)
    return {
      description: loyaltyTaskBody.description,
      completedAt: taskProgress.completedAt,
      mentionUserName: loyaltyTaskBody.mentionUserName,
      taskCompletedTweetId: (taskProgress.json as TwitterTaskProgressBody).tweetId,
      additionalProgram: getAdditionalProgramBodyResponse(loyaltyTaskBody.additionalProgram, taskProgress),
    };
  return {
    description: loyaltyTaskBody.description,
    additionalProgram: !!loyaltyTaskBody.additionalProgram,
    mentionUserName: loyaltyTaskBody.mentionUserName,
  };
};
const reTweetQuoteTwitterTaskBody = (loyaltyTask: LoyaltyTask, taskProgress?: TaskProgress) => {
  const loyaltyTaskBody = loyaltyTask.body as ReTweetQuoteTwitterLoyaltyTaskBody;
  if (taskProgress)
    return {
      tweetId: loyaltyTaskBody.tweetId,
      description: loyaltyTask.body.description,
      completedAt: taskProgress.completedAt,
      taskCompletedTweetId: (taskProgress.json as TwitterTaskProgressBody).tweetId,
      additionalProgram: getAdditionalProgramBodyResponse(loyaltyTaskBody.additionalProgram, taskProgress),
    };
  return {
    tweetId: loyaltyTaskBody.tweetId,
    description: loyaltyTask.body.description,
    additionalProgram: !!loyaltyTaskBody.additionalProgram,
  };
};

const getAdditionalProgramBodyResponse = (
  taskAdditionalProgram: AdditionalProgram | null,
  taskProgress?: TaskProgress,
) => {
  if (!taskAdditionalProgram || !taskProgress) return false;

  const jsonBody = taskProgress.json as TwitterTaskProgressBody;

  return {
    additionalProgramEndAt: jsonBody.unlimitedEndAt,
    likes: jsonBody.unlimitedLikesCount,
    reTweets: jsonBody.unlimitedReTweetsCount,
    totalEarned: taskProgress.earnedPoints,
    individualDuration: !!taskAdditionalProgram.individualDuration,
  };
};

const partnerTaskBody = (loyaltyTask: LoyaltyTask, taskProgress?: TaskProgress) => {
  const loyaltyTaskBody = loyaltyTask.body as PartnerLoyaltyTaskBody;
  if (taskProgress)
    return {
      description: loyaltyTaskBody.description,
      completedAt: taskProgress.completedAt || taskProgress.createdDate,
    };
  return {
    description: loyaltyTaskBody.description,
    partnerProjectLink: loyaltyTaskBody.partnerTask.projectLink,
  };
};

const baseTokenTaskBody = (loyaltyTask: LoyaltyTask, taskProgress?: TaskProgress, standard?: NFTTypes | undefined) => {
  const loyaltyTaskBody = loyaltyTask.body as TokenTaskBody | NFTTaskBody;
  const body: TokenTaskBody & { standard?: NFTTypes } = { ...loyaltyTaskBody };

  if (standard) body.standard = standard;

  if (!taskProgress) return body;

  const jsonBody = taskProgress.json as OnChainTaskProgressBody;

  return {
    ...body,
    wallet: jsonBody.wallet,
    amount: jsonBody.amount,
  };
};

const defaultTaskBody = (body, taskProgress?: TaskProgress) => {
  if (taskProgress)
    return {
      ...body,
      completedAt: taskProgress.completedAt || taskProgress.createdDate,
    };
  return body;
};

const onChainTaskBody = (loyaltyTask: LoyaltyTask, taskProgress?: TaskProgress) => {
  const loyaltyTaskBody = loyaltyTask.body as TokenTaskBody | NFTTaskBody;
  const body = { ...loyaltyTaskBody };

  if (!taskProgress) return body;

  const jsonBody = taskProgress.json as OnChainTaskProgressBody;

  return {
    ...body,
    wallet: jsonBody.wallet,
    amount: jsonBody.amount,
  };
};

const dailyTaskBody = (loyaltyTask: LoyaltyTask, taskProgress: TaskProgress) => {
  const loyaltyTaskBody = loyaltyTask.body as DailyTaskBody;
  const body = { ...loyaltyTaskBody };

  body.subTasks = body.subTasks.reduce((acc, subTask, currentIndex) => {
    // If Daily Tasks not started, we need send only first task
    if (currentIndex === 0 && new Date(subTask.startAt).getTime() > new Date().getTime()) {
      acc.push({
        ...subTask,
        status: getStatusOfSubTask(subTask),
      });
      return acc;
    }
    // If Daily Tasks ended, we need send only last task
    if (
      currentIndex === body.subTasks.length - 1 &&
      new Date(subTask.endAt).getTime() <= new Date().getTime() &&
      !acc.length
    ) {
      acc.push({
        ...subTask,
        status: getStatusOfSubTask(subTask),
      });
      return acc;
    }

    if (new Date(subTask.endAt).getTime() >= new Date().getTime() && !acc.length) {
      acc.push({
        ...subTask,
        status: getStatusOfSubTask(subTask),
      });
    }
    return acc;
  }, [] as any[]);
  body.total = loyaltyTaskBody.subTasks.length;

  if (taskProgress && loyaltyTask.id === taskProgress.loyaltyTaskId) {
    body.subTasks = body.subTasks.map((subTask) => {
      const completedSubTask =
        taskProgress.json &&
        (taskProgress.json as DailyTaskProgressBody[]).find((completed) => subTask.id === completed.id);
      if (!completedSubTask)
        return {
          ...subTask,
          status: getStatusOfSubTask(subTask),
        };
      return {
        ...subTask,
        answer: completedSubTask.answer,
        status: completedSubTask.status,
      };
    });
  }
  return body;
};

export const imageUploadTaskBody = (body: LoyaltyTaskBody, taskProgress?: TaskProgress) => {
  if (taskProgress && taskProgress.json) {
    const answer = (taskProgress.json as ImageUploadTaskProgressBody).imgSrc;
    if (answer)
      return {
        imgSrc: answer,
        completedAt: taskProgress.completedAt,
        description: body.description,
      };
  }

  return {
    description: body.description,
  };
};

export const inviteTaskBody = (body: LoyaltyTaskBody, taskProgress?: TaskProgress) => {
  if (taskProgress) {
    const jsonBody = taskProgress.json as InviteTaskBody;
    return {
      ...body,
      inviteCode: jsonBody.inviteCode,
      inviteCount: jsonBody.invitedInvestorIds ? jsonBody.invitedInvestorIds.length : 0,
      totalEarned: taskProgress.earnedPoints,
    };
  }

  return { ...body };
};

export const gitCoinTaskBody = (body: LoyaltyTaskBody, taskProgress?: TaskProgress) => {
  if (taskProgress) {
    const jsonBody = taskProgress.json as GitCoinTaskProgressBody;
    return {
      ...body,
      wallet: jsonBody.wallet,
    };
  }
  return { ...body };
};

export const getStatusOfSubTask = (subTask: DailyTask) =>
  new Date().getTime() < new Date(subTask.endAt).getTime() ? DailyStatus.Active : DailyStatus.Expired;
