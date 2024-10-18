import { getRepository } from 'typeorm';
import { TelegramUser } from '../entity';

class TelegramUserModel {
  async store(telegramId: string, username: string, investorId: number) {
    const savedTelegramTokenUser = await this.getByInvestorId(investorId);
    if (savedTelegramTokenUser) return;

    await this.save(telegramId, username, investorId);
  }

  async create(authCode: string, investorId: number) {
    const savedTelegramTokenUser = await this.getByInvestorId(investorId);
    if (savedTelegramTokenUser) return;

    const telegramUser = new TelegramUser();

    telegramUser.investorId = investorId;
    telegramUser.tempCode = authCode;

    return getRepository(TelegramUser).save(telegramUser);
  }

  getByInvestorId(investorId: number) {
    return getRepository(TelegramUser).findOne({
      where: { investorId },
    });
  }

  getByTempCode(tempCode: string) {
    return getRepository(TelegramUser).findOne({
      where: { tempCode },
    });
  }

  update(telegramUser: TelegramUser) {
    return getRepository(TelegramUser).save(telegramUser);
  }

  delete(telegramUser: TelegramUser) {
    return getRepository(TelegramUser).remove(telegramUser);
  }

  async isAccountUsed(telegramId: string) {
    const record = await getRepository(TelegramUser).findOne({
      where: { telegramId },
    });
    return !!record;
  }

  private save(telegramId: string, telegramUsername: string, investorId: number) {
    const telegramUser = getRepository(TelegramUser).create({
      investorId,
      telegramId,
      telegramUsername,
    });

    return getRepository(TelegramUser).save(telegramUser);
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(TelegramUser).delete({ investorId });
  }
}

export const telegramUserModel = new TelegramUserModel();
