import { getRepository } from 'typeorm';

import { TwoFactorCodeSendHistory } from '../entity';

class TwoFactorCodeSendHistoryModel {
  save(investorId: number) {
    const record = getRepository(TwoFactorCodeSendHistory).create({ investorId });
    return getRepository(TwoFactorCodeSendHistory).save(record);
  }

  getByInvestorId(investorId: number) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return getRepository(TwoFactorCodeSendHistory)
      .createQueryBuilder('q')
      .where(`q.createdAt BETWEEN '${start.toUTCString()}' AND '${end.toUTCString()}'`)
      .andWhere(`q.investorId = ${investorId}`)
      .orderBy('q.createdAt', 'DESC')
      .getMany();
  }

  getLastRequest(investorId: number) {
    return getRepository(TwoFactorCodeSendHistory).findOne({
      where: {
        investorId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}

export const twoFactorCodeSendHistoryModel = new TwoFactorCodeSendHistoryModel();
