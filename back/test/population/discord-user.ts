import { getRepository } from 'typeorm';
import { DiscordToken, Investor } from '../../src/db/entity';

export const populateDiscordUsers = async () => {
  const discordTokenRepository = getRepository(DiscordToken);
  const investorRepository = getRepository(Investor);
  const investors = await investorRepository.find({});

  const discordTokens = [
    {
      discordId: '691301859016835092',
      discordUsername: 'kairatbishkek',
      accessToken: 'rUb8xkXzypYyqQc9FP9GdjIaexRIGX',
      refreshToken: 'Y4jfVg6NhTR7QEG8Thi2011pNnTeb8',
      expiredIn: 1697178187,
      createdAt: new Date(),
      updatedAt: new Date(),
      investorId: investors[0].id,
    },
  ];

  await discordTokenRepository.save(discordTokens);
};
