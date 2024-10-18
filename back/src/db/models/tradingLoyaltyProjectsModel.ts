import { getRepository } from 'typeorm';
import { TrendingLoyaltyProjects } from '../entity/TrendingLoyaltyProjects';

class TrendingLoyaltyProjectsModel {
  create(loyaltyProjectIds: number[]) {
    const tradingRecords = loyaltyProjectIds.map((loyaltyProjectId) =>
      getRepository(TrendingLoyaltyProjects).create({
        loyaltyProjectId,
      }),
    );

    getRepository(TrendingLoyaltyProjects).save(tradingRecords);
  }

  async getProjectIds() {
    const records = await getRepository(TrendingLoyaltyProjects).find();
    return records.map((aRecord) => aRecord.loyaltyProjectId);
  }

  async purge() {
    const records = await getRepository(TrendingLoyaltyProjects).find();
    await getRepository(TrendingLoyaltyProjects).remove(records);
  }
}

export const trendingLoyaltyProjectsModel = new TrendingLoyaltyProjectsModel();
