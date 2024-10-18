import { BaseRepositoryService } from './BaseRepository';
import { UserModalSettings } from '../entity/UserModalSettings';
import { UserModalSettingsTypes } from '../types/interfaces/UserModalSettings.types';

export class UserModalSettingsModel extends BaseRepositoryService<UserModalSettings> {
  constructor() {
    super(UserModalSettings);
  }

  findByTypeAndInvestorId(type: UserModalSettingsTypes, investorId: number) {
    return this.repository.findOne({
      where: {
        type,
        investorId,
      },
    });
  }
}

export const userModalSettingsModel = new UserModalSettingsModel();
