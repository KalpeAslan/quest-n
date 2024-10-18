import { getRepository } from 'typeorm';
import { TokensStorageHistory } from '../../db/entity';
import { TokensStorageHistoryTypes } from '../types/interfaces';

class TokensStorageHistoryModel {
  getByTokenSotrageId(tokenSotrageId: number) {
    return getRepository(TokensStorageHistory).find({
      where: { tokenSotrageId },
    });
  }

  getByLoyaltyProjectId(tokenSotrageId: number, loyaltyProjectId: number) {
    return getRepository(TokensStorageHistory).find({
      where: { loyaltyProjectId, tokenSotrageId },
    });
  }

  getByTransactionIdAndType(transactionId: string, type?: TokensStorageHistoryTypes) {
    return getRepository(TokensStorageHistory).findOne({
      where: type ? { transactionId, type } : { transactionId },
    });
  }

  create(tokensStorageHistory: TokensStorageHistory) {
    return getRepository(TokensStorageHistory).save(tokensStorageHistory);
  }

  updateTokensHistory({
    tokenAmount,
    tokenStorageId,
    type,
    loyaltyProjectId,
    transactionId,
  }: {
    tokenAmount: number;
    tokenStorageId: number;
    type: TokensStorageHistoryTypes;
    loyaltyProjectId?: number;
    transactionId?: string;
  }) {
    const tokenStorageHistory = new TokensStorageHistory();
    tokenStorageHistory.tokenSotrageId = tokenStorageId;
    if (loyaltyProjectId) {
      tokenStorageHistory.loyaltyProjectId = loyaltyProjectId;
    }

    if (transactionId) {
      tokenStorageHistory.transactionId = transactionId;
    }

    tokenStorageHistory.amount = tokenAmount;
    tokenStorageHistory.type = type;
    return getRepository(TokensStorageHistory).save(tokenStorageHistory);
  }
}

export const tokensStorageHistoryModel = new TokensStorageHistoryModel();
