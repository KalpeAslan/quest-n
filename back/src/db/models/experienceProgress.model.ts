import { getRepository } from 'typeorm';
import { ExperienceProgress } from '../entity';
import { ExperienceTaskType } from '../types/interfaces/ExperienceDto';
import { BaseRepositoryService } from './BaseRepository';

export class ExperienceProgressModel extends BaseRepositoryService<ExperienceProgress> {
  constructor() {
    super(ExperienceProgress);
  }

  findOneByParams(params: { experieceTaskId?: number; investorId?: number; type?: string }) {
    return getRepository(ExperienceProgress).findOne({
      where: { ...params },
    });
  }

  findByParams({
    params,
    relations,
    take,
    skip,
  }: {
    params: Partial<ExperienceProgress>;
    relations?: string[];
    take?: number;
    skip?: number;
  }) {
    return getRepository(ExperienceProgress).find({
      where: { ...params },
      take,
      skip,
      relations,
      order: { createdAt: 'DESC' },
    });
  }

  getCountByParams(params: Partial<ExperienceProgress>) {
    return getRepository(ExperienceProgress).count(params);
  }

  deleteByParams(params: { experieceTaskId?: number; investorId?: number; type?: ExperienceTaskType }) {
    const criteria: any = {};

    if (params.experieceTaskId !== undefined) {
      criteria.experieceTaskId = params.experieceTaskId;
    }

    if (params.investorId !== undefined) {
      criteria.investorId = params.investorId;
    }

    if (params.type !== undefined) {
      criteria.type = params.type;
    }

    return getRepository(ExperienceProgress).delete(criteria);
  }

  async getSumOfEarnedPointsByInvestorId(investorId: number): Promise<{ sum: number }> {
    return (await this.repository
      .createQueryBuilder('exp')
      .select('SUM(exp.earnedPoints)', 'sum')
      .where('exp.investorId = :investorId', { investorId })
      .getRawOne()) as any;
  }
}

export const experienceProgressModel = new ExperienceProgressModel();
