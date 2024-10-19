import { TelegramMiniDto } from '../../../db/types/interfaces/entry/telegramMiniDto';
import { telegramUserModel } from '../../../db/models';
import { createInvestor } from '../investor';
import { generateEntryResponse } from '../entry/jwt';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';

export const loginTelegramMiniApp = async (dto: TelegramMiniDto) => {
  const existingUser = await telegramUserModel.getByTgId(dto.id);

  if (existingUser) {
    return generateEntryResponse(
      existingUser.investorId as number,
      EntryFlowEnum.Login,
      existingUser.telegramUsername as string,
    );
  }

  const investor = await createInvestor();
  const newTgUser = await telegramUserModel.save(dto.id, dto.username || '', investor.id);

  return generateEntryResponse(investor.id, EntryFlowEnum.Create, newTgUser.telegramUsername as string);
};
