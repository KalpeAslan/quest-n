import { FindConditions, ObjectLiteral, getRepository } from 'typeorm';
import { LoyaltyReward } from '../entity/LoyaltyReward';
import { LoyaltyProject } from '../entity';

class LoyaltyRewardModel {
  create(loyaltyReward: Partial<LoyaltyReward>) {
    return getRepository(LoyaltyReward).save(loyaltyReward);
  }

  update(loyaltyReward: LoyaltyReward) {
    return getRepository(LoyaltyReward).save(loyaltyReward);
  }

  async updateById(
    id: number,
    params: {
      amount?: number;
      isClaimable?: boolean;
      description?: string;
      startPlace?: number;
      endPlace?: number;
      loyaltyProjectId?: number | null;
      contractId?: number | null;
      verified?: boolean;
      tokenIds?: number[];
    },
  ): Promise<void> {
    const loyaltyRewardRepository = getRepository(LoyaltyReward);

    await loyaltyRewardRepository.update(id, params);
  }

  async deleteById(loyaltyRewardId: number) {
    return getRepository(LoyaltyReward).delete({ id: loyaltyRewardId });
  }

  getAll() {
    return getRepository(LoyaltyReward)
      .createQueryBuilder('loyaltyReward')
      .leftJoinAndSelect('loyaltyReward.contract', 'contract')
      .getMany();
  }

  getAllByProjectId(projectId: number, filterVerified?: boolean) {
    return getRepository(LoyaltyReward)
      .createQueryBuilder('loyaltyReward')
      .leftJoinAndSelect('loyaltyReward.contract', 'contract')
      .where(filterVerified ? { loyaltyProjectId: projectId, verified: true } : { loyaltyProjectId: projectId })
      .getMany();
  }

  async getById(id: number, relations?: string[]) {
    return await getRepository(LoyaltyReward).findOne(id, { relations: relations || [] });
  }

  async deleteByProjectId(projectId: number) {
    return getRepository(LoyaltyReward).delete({ loyaltyProjectId: projectId });
  }

  async getByConditionsWithRelations(
    conditions?: string | ObjectLiteral | FindConditions<LoyaltyReward> | FindConditions<LoyaltyReward>[],
    relations?: string[],
  ): Promise<LoyaltyReward[]> {
    return getRepository(LoyaltyReward).find({
      where: conditions,
      relations,
    });
  }

  async getPlacesByLoyaltyProject(loyaltyProjectId) {
    const result = await getRepository(LoyaltyReward)
      .createQueryBuilder('LoyaltyReward')
      .where('LoyaltyReward.loyaltyProjectId = :loyaltyProjectId', { loyaltyProjectId })
      .select('MIN(LoyaltyReward.startPlace)', 'startPlace')
      .addSelect('MAX(LoyaltyReward.endPlace)', 'endPlace')
      .groupBy('LoyaltyReward.loyaltyProjectId')
      .getRawMany();

    return {
      startPlace: result[0] && result[0].startPlace ? result[0].startPlace : 1,
      endPlace: result[0] && result[0].endPlace ? result[0].startPlace : 1,
    };
  }
}

export const loyaltyRewardModel = new LoyaltyRewardModel();
