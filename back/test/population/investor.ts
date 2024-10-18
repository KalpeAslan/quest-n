import { getRepository } from 'typeorm';
import { Investor } from '../../src/db/entity';

export const populateInvestor = async () => {
  const investorRepository = getRepository(Investor);

  const investors = [
    {
      wallet: 'wallet1',
      username: 'username1',
    },
    {
      wallet: 'wallet2',
      username: 'username2',
    },
    {
      wallet: 'wallet3',
      username: 'username3',
    },
  ];

  await investorRepository.save(investors);
};
