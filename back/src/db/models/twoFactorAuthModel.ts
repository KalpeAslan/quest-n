import { getRepository } from 'typeorm';

import { TwoFactorAuth } from '../entity';

interface SaveTwoFactorAuthDto {
  investorId: number;
  phoneNumber: string;
}

class TwoFactorAuthModel {
  findByInvestorId(investorId: number) {
    return getRepository(TwoFactorAuth).findOne({
      where: {
        investorId,
      },
    });
  }

  save(data: SaveTwoFactorAuthDto) {
    const record = getRepository(TwoFactorAuth).create(data);
    return getRepository(TwoFactorAuth).save(record);
  }

  updateSaving(record: TwoFactorAuth) {
    return getRepository(TwoFactorAuth).save(record);
  }

  async confirm(investorId: number) {
    const record = await this.findByInvestorId(investorId);
    if (!record) throw new Error('record by investorId not found');

    record.confirmed = true;
    return getRepository(TwoFactorAuth).save(record);
  }

  async confirmDisconnect(investorId: number) {
    const record = await this.findByInvestorId(investorId);
    if (!record) throw new Error('record by investorId not found');

    return getRepository(TwoFactorAuth).remove(record);
  }
}

export const twoFactorAuthModel = new TwoFactorAuthModel();
