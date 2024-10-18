import {
  BadRequestError,
  BadRequestErrorKeys,
  ConflictError,
  ConflictErrorKeys,
  InternalServerError,
  InternalServerErrorKeys,
  UnauthorizedError,
  UnauthorizedErrorKeys,
} from '../../errors';
import { telegramUserModel } from '../../../db/models/telegramUserModel';
import { telegramAuthService } from '../apis/telegram/telegramAuthService';
import { taskProgressModel } from '../../../db/models';
import { In, Raw } from 'typeorm';
import { LoyaltyTaskType } from '../../../db/types/interfaces/loyalty';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { Logger } from '../logger';
import { getRandomAuthCode } from '../../helpers/common.utils';
import { TelegramEntryDto } from '../../../db/types/interfaces/entry/telegramDto';
import { getConfig } from '../../config';
const log = new Logger();

const { TG_AUTH_BOT_API_TOKEN } = getConfig();

export const telegramLoginService = async (investorId: number) => {
  const telegramUser = await telegramUserModel.getByInvestorId(investorId);

  if (!telegramUser) {
    const authCode = getRandomAuthCode(6);

    await telegramUserModel.create(authCode, investorId);
    return { authCode };
  }

  if (telegramUser?.telegramId) {
    throw new BadRequestError(BadRequestErrorKeys.UserAlreadyExist, 'Telegram is already connected');
  }

  return { authCode: telegramUser.tempCode };
};

export const telegramAccessTokenService = async (telegramData: TelegramEntryDto, apiKey?: string) => {
  console.log(apiKey, TG_AUTH_BOT_API_TOKEN);
  if (apiKey !== TG_AUTH_BOT_API_TOKEN) {
    throw new UnauthorizedError(UnauthorizedErrorKeys.WrongToken, 'Wrong tg bot token');
  }

  const telegramUser = await telegramUserModel.getByTempCode(telegramData.tempCode);
  if (!telegramUser || telegramUser.telegramId) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Invalid auth code');
  }

  const accountUsed = await telegramUserModel.isAccountUsed(telegramData.id);
  if (accountUsed) {
    throw new ConflictError(ConflictErrorKeys.AccountAlreadyExists, 'This tg account is already in use');
  }

  telegramUser.telegramId = telegramData.id;
  telegramUser.telegramUsername = getUsername(telegramData);

  await telegramUserModel.update(telegramUser);

  return {
    username: getUsername(telegramData),
    id: telegramData.id,
  };
};

export const telegramDisconnectUserService = async (investorId: number) => {
  const telegramUser = await telegramUserModel.getByInvestorId(investorId);
  if (!telegramUser) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have telegram data');

  const questTwitterTasks = await taskProgressModel.getByConditionsWithRelations(
    {
      investorId,
      loyaltyTask: {
        type: In([LoyaltyTaskType.JoinTelegram]),
      },
      loyaltyProject: {
        endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
      },
    },
    ['loyaltyTask', 'loyaltyProject'],
  );

  await taskProgressModel.removeTaskProgresses(questTwitterTasks);

  await telegramUserModel.delete(telegramUser);

  return { success: true };
};

export const isTelegramBotInvited = (group: string) => {
  if (!group) throw new BadRequestError(BadRequestErrorKeys.NotValidParameter, 'group is not valid');
  try {
    return telegramAuthService.isBotInvited(group);
  } catch (e) {
    log.error(`Error telegram custom api get membership: ${e}`);
    console.log('Error telegram custom api get membership: ', e);
    throw new InternalServerError(InternalServerErrorKeys.Default, 'Internal server error');
  }
};

export const verifyTelegram = async (investorId: number) => {
  const telegramUser = await telegramUserModel.getByInvestorId(investorId);

  if (!telegramUser?.telegramId) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Telegram user not found');
  }

  return { id: telegramUser.telegramId, username: telegramUser.telegramUsername };
};

const getUsername = (telegramData) => {
  if (telegramData.username) return telegramData.username;
  if (telegramData.first_name && telegramData.last_name) return telegramData.first_name + telegramData.last_name;
  if (telegramData.first_name) return telegramData.first_name;
  if (telegramData.last_name) return telegramData.last_name;

  return telegramData.id;
};
