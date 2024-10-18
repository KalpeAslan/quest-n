import { getRepository } from 'typeorm';
import { InvestorLevelsRule } from '../../db/entity';

class InvestorLevelsRuleModel {
  getAll() {
    return getRepository(InvestorLevelsRule).find({
      order: {
        number: 'ASC',
      },
    });
  }

  removeAll() {
    return getRepository(InvestorLevelsRule).clear();
  }

  insert(rule) {
    return getRepository(InvestorLevelsRule).insert(rule);
  }
}

export const investorLevelsRuleModel = new InvestorLevelsRuleModel();
