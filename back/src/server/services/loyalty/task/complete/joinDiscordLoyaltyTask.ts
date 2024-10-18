import { LoyaltyTask } from '../../../../../db/entity';
import { JoinDiscordLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { discordApiService } from '../../../apis/discordApiService';

export const isJoinDiscordLoyaltyTask = async (investorId: number, loyaltyTask: LoyaltyTask) => {
  const loyaltyTaskBody = loyaltyTask.body as JoinDiscordLoyaltyTaskBody;

  const usersGuilds = await discordApiService.fetchGuilds(investorId);

  return { status: !!usersGuilds.find((aGuild) => aGuild.id === loyaltyTaskBody.serverId) };
};
