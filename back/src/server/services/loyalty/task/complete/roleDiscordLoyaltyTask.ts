import { LoyaltyTask } from '../../../../../db/entity';
import { RoleDiscordLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { discordApiService } from '../../../apis/discordApiService';

export const isRoleDiscordLoyaltyTask = async (investorId: number, loyaltyTask: LoyaltyTask) => {
  const loyaltyTaskBody = loyaltyTask.body as RoleDiscordLoyaltyTaskBody;

  const guildRoles = await discordApiService.fetchGuildRoles(investorId, loyaltyTaskBody.serverId as string);
  const isUserHasRole = !!guildRoles.find((aRoleId) => aRoleId === loyaltyTaskBody.roleId);
  return { status: isUserHasRole };
};
