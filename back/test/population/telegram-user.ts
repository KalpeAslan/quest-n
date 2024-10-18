import { getRepository } from 'typeorm';
import { Investor, TelegramUser } from '../../src/db/entity';

export const populateTelegramUsers = async () => {
  const telegramUserRepository = getRepository(TelegramUser);
  const investorRepository = getRepository(Investor);
  const investors = await investorRepository.find({});

  const telegramUsers = [
    {
      telegramId: '227914216',
      telegramUsername: 'kairatbeast',
      investorId: investors[0].id,
    },
  ];

  await telegramUserRepository.save(telegramUsers);
};
