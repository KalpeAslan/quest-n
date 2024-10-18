import { LoyaltyTask } from '../../../../../db/entity';
import { telegramUserModel } from '../../../../../db/models/telegramUserModel';
import { JoinTelegramLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { telegramApiService } from '../../../apis/telegram/telegramApiService';

export const isJoinTelegramLoyaltyTask = async (investorId: number, loyaltyTask: LoyaltyTask) => {
  const loyaltyTaskBody = loyaltyTask.body as JoinTelegramLoyaltyTaskBody;

  const telegramUser = await telegramUserModel.getByInvestorId(investorId);
  if (!telegramUser?.telegramId) return { status: false };

  const isUserJoined = await telegramApiService.checkJoined(telegramUser.telegramId, loyaltyTaskBody.chatId);
  return { status: isUserJoined };
};
