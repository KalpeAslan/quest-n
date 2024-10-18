import { getRepository } from 'typeorm';
import { LoyaltyProjectTokensEarnRule } from '../../db/entity';

class LoyaltyProjectTokensEarnRuleModel {
  getAll() {
    return getRepository(LoyaltyProjectTokensEarnRule).find({ order: { startPlace: 'ASC' } });
  }

  insert(rule) {
    return getRepository(LoyaltyProjectTokensEarnRule).insert(rule);
  }

  removeAll() {
    return getRepository(LoyaltyProjectTokensEarnRule).clear();
  }

  delete(id) {
    return getRepository(LoyaltyProjectTokensEarnRule).delete({ id });
  }
}

export const loyaltyProjectTokensEarnRuleModel = new LoyaltyProjectTokensEarnRuleModel();
