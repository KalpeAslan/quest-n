import { getRepository } from 'typeorm';
import { TokensStorage, Investor } from '../../src/db/entity';

export const populateTokensStorage = async () => {
  const tokensStorageRepository = getRepository(TokensStorage);
  const investorRepository = getRepository(Investor);

  // Assuming that you have investors already populated
  const investors = await investorRepository.find({});

  const tokenStorages = [
    {
      amount: 1000, // Sample amount
      investor: investors[0], // Link to the first investor
      tokensStorageHistory: [], // Initially empty history
    },
    {
      amount: 2000, // Sample amount
      investor: investors[1], // Link to the second investor
      tokensStorageHistory: [], // Initially empty history
    },
  ];

  await tokensStorageRepository.save(tokenStorages);
};
