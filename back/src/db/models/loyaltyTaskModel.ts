import { getRepository } from 'typeorm';

import { LoyaltyTask } from '../../db/entity';
import { NotFoundError, NotFoundErrorKeys } from '../../server/errors/NotFoundError';
import { LoyaltyTaskType } from '../types/interfaces/loyalty';

export class LoyaltyTaskModel {
  getByLoyaltyTaskId(loyaltyTaskId: number): Promise<LoyaltyTask> {
    return getRepository(LoyaltyTask).findOneOrFail({
      where: { id: loyaltyTaskId },
      relations: ['loyaltyProject'],
    });
  }

  async create(loyaltyTask: LoyaltyTask) {
    return getRepository(LoyaltyTask).save(loyaltyTask);
  }

  async getAll() {
    return getRepository(LoyaltyTask).find({});
  }

  async getTotalPointsByLoyaltyLinkTitle(loyaltyProjectId: number) {
    const result = await getRepository(LoyaltyTask)
      .createQueryBuilder('loyaltyTask')
      .where('loyaltyTask.loyaltyProjectId = :loyaltyProjectId', { loyaltyProjectId })
      .select('SUM(loyaltyTask.points)', 'totalPoints')
      .groupBy('loyaltyTask.loyaltyProjectId')
      .getRawMany();

    return result[0] && result[0].totalPoints ? result[0].totalPoints : 0;
  }

  async getById(id: number) {
    try {
      const loyaltyTask = await getRepository(LoyaltyTask).findOneOrFail(
        { id },
        {
          relations: ['loyaltyProject', 'experienceTask'],
        },
      );
      return loyaltyTask;
    } catch (error) {
      throw new NotFoundError(NotFoundErrorKeys.NotFound, error.message);
    }
  }

  getByType(type: LoyaltyTaskType, relations?: string[]) {
    try {
      return getRepository(LoyaltyTask).findOneOrFail({ type }, { relations: relations || [] });
    } catch (error) {
      throw new NotFoundError(NotFoundErrorKeys.NotFound, error.message);
    }
  }

  async update(loyaltyTask: LoyaltyTask) {
    return getRepository(LoyaltyTask).save(loyaltyTask);
  }

  async delete(id: LoyaltyTask['id']) {
    return getRepository(LoyaltyTask).delete({ id });
  }

  async getCount(loyaltyProjectId: number) {
    return getRepository(LoyaltyTask).count({ where: { loyaltyProjectId } });
  }

  async getByLoyaltyProjectId(loyaltyProjectId: number) {
    return getRepository(LoyaltyTask).find({
      where: { loyaltyProjectId },
      relations: ['loyaltyProject'],
    });
  }

  async getByLoyaltyLinkTitle(linkTitle: string) {
    return getRepository(LoyaltyTask).find({
      where: {
        loyaltyProject: {
          linkTitle,
        },
      },
      relations: ['loyaltyProject'],
    });
  }

  async getByParams(criteria: Partial<LoyaltyTask>) {
    return await getRepository(LoyaltyTask).find({
      where: criteria,
    });
  }
}

export const loyaltyTaskModel = new LoyaltyTaskModel();
