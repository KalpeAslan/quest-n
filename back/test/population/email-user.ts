import { getRepository } from 'typeorm';
import { EmailUser, Investor } from '../../src/db/entity';
import * as bcrypt from 'bcrypt';

export const populateEmailUsers = async () => {
  const emailUserRepository = getRepository(EmailUser);
  const investorRepository = getRepository(Investor);
  const investors = await investorRepository.find({});

  const users = [
    {
      email: 'testuser1@example.com',
      password: await bcrypt.hash('securepassword1', 10),
      confirmed: false,
      isResetPasswordVerified: false,
      createdAt: new Date(),
      investorId: investors[0].id,
    },
    {
      email: 'testuser2@example.com',
      password: await bcrypt.hash('securepassword1', 10),
      confirmed: true,
      isResetPasswordVerified: false,
      createdAt: new Date(),
      investorId: investors[1].id,
    },
  ];

  await emailUserRepository.save(users);
};
