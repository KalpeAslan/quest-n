import { getRepository } from 'typeorm';
import { Investor, Contract } from '../../src/db/entity';
import { TokenType } from '../../src/db/types/interfaces/loyalty';

export const populateTokens = async () => {
  const tokenRepository = getRepository(Contract);
  const investorRepository = getRepository(Investor);
  const investors = await investorRepository.find({});

  const tokens = [
    // Token 1: Full information
    {
      name: 'Token 1',
      symbol: 'TK1',
      logo: 'logo-1.png',
      type: TokenType.Nft, // Update to the correct type
      investorId: investors[0].id, // Reference to the existing Investor ID
    },
    // Token 2: Without logo
    {
      name: 'Token 2',
      symbol: 'TK2',
      logo: null,
      type: TokenType.Aq, // Update to the correct type
      investorId: investors[0].id, // Reference to another existing Investor ID or the same, depending on your setup
    },
    // Token 3: Different type
    {
      name: 'Token 3',
      symbol: 'TK3',
      logo: 'logo-3.png',
      type: TokenType.Token, // Assuming TokenType has 'AnotherType', update accordingly
      investorId: investors[0].id, // Reference to another existing Investor ID or the same, depending on your setup
    },
  ];

  for (const token of tokens) {
    const tokenInstance = await tokenRepository.create(token as Contract);
    await tokenRepository.save(tokenInstance);
  }
};
