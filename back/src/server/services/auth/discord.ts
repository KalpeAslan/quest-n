import { ConflictError, ConflictErrorKeys } from '../../errors';
import { discordTokenModel } from '../../../db/models/discordTokenModel';
import { DiscordEntryDto } from '../../../db/types/interfaces/entry/discordDto';
import { discordApiService } from '../apis/discordApiService';
import { taskProgressModel } from '../../../db/models';
import { LoyaltyTaskType } from '../../../db/types/interfaces/loyalty';
import { In, Raw } from 'typeorm';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';

export const discordLoginService = () => {
  return discordApiService.getAuthUrl();
};

export const discordAccessTokenService = async (discordOauthDto: DiscordEntryDto, investorId: number) => {
  const discordOathData = await discordApiService.fetchAccessTokenAndUser(discordOauthDto.code);

  const existedDiscordToken = await discordTokenModel.getByInvestorId(investorId);

  if (!existedDiscordToken) {
    const isDiscordAccountUsed = await discordTokenModel.getAllByDiscordId(discordOathData.discordId);

    const newAccount = isDiscordAccountUsed.find((acc) => acc.investor?.username); // old users don't have a username
    if (newAccount) throw new ConflictError(ConflictErrorKeys.AccountAlreadyExists, discordOathData.discordUsername);

    await discordTokenModel.create({
      investorId,
      discordId: discordOathData.discordId,
      discordUsername: discordOathData.discordUsername,
      accessToken: discordOathData.accessToken,
      refreshToken: discordOathData.refreshToken,
      expiredIn: discordOathData.expiredIn,
    });
  }

  return {
    id: discordOathData.discordId,
    username: discordOathData.discordUsername,
  };
};

export const refreshDiscordAccessToken = async (investorId: number) => {
  const existedDiscordToken = await discordTokenModel.getByInvestorId(investorId);

  if (!existedDiscordToken) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Token does not exist');

  const discordOauthData = await discordApiService.refreshAccessTokenAndUser(
    existedDiscordToken.refreshToken,
    investorId,
  );

  const updatedDiscordToken = await discordTokenModel.update({
    ...existedDiscordToken,
    discordId: discordOauthData.discordId,
    discordUsername: discordOauthData.discordUsername,
    accessToken: discordOauthData.accessToken,
    refreshToken: discordOauthData.refreshToken,
    expiredIn: discordOauthData.expiredIn,
  });

  return { accessToken: updatedDiscordToken.accessToken };
};

export const clearDiscordProgresses = async (investorId: number) => {
  const discordCompletedTasks = await taskProgressModel.getByConditionsWithRelations(
    {
      investorId: investorId,
      loyaltyTask: {
        type: In([LoyaltyTaskType.JoinDiscord, LoyaltyTaskType.RoleDiscord]),
      },
      loyaltyProject: {
        endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
      },
    },
    ['loyaltyTask', 'loyaltyProject'],
  );

  await taskProgressModel.removeTaskProgresses(discordCompletedTasks);
};

export const discordDisconnectUserService = async (investorId: number) => {
  const discordTokens = await discordTokenModel.getByInvestorId(investorId);
  if (!discordTokens) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have discord data');

  await clearDiscordProgresses(investorId);

  await discordTokenModel.delete(discordTokens);

  return { success: true };
};
