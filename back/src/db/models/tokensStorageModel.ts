import { getRepository } from 'typeorm';
import { TokensStorage } from '../../db/entity';

class TokensStorageModel {
  getByInvestorId(investorId: number) {
    return getRepository(TokensStorage).findOneOrFail({
      where: { investorId },
    });
  }

  update(tokenStorage: TokensStorage) {
    return getRepository(TokensStorage).save(tokenStorage);
  }

  create(investorId: number) {
    const tokenStorage = new TokensStorage();
    tokenStorage.investorId = investorId;
    tokenStorage.amount = 0;
    return getRepository(TokensStorage).save(tokenStorage);
  }
}

export const tokensStorageModel = new TokensStorageModel();
