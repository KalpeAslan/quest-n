import { ObjectLiteral, FindConditions, getRepository } from 'typeorm';
import { ExperienceLevel, LoyaltyProject } from '../entity';
import { BaseRepositoryService } from './BaseRepository';

export class ExperienceLevelModel extends BaseRepositoryService<ExperienceLevel> {
  constructor() {
    super(ExperienceLevel);
  }

  async getOneByParams(
    criteria: string | ObjectLiteral | FindConditions<LoyaltyProject> | FindConditions<LoyaltyProject>[],
  ) {
    return await getRepository(ExperienceLevel).findOne({
      where: criteria,
    });
  }

  async getFirstLevel() {
    return await getRepository(ExperienceLevel).findOne({
      order: {
        pointsFrom: 'ASC',
      },
    });
  }

  async findCurrentLevelByPoints(points: number): Promise<ExperienceLevel | undefined> {
    return this.repository
      .createQueryBuilder('exp')
      .where(':points BETWEEN exp.pointsFrom AND exp.pointsTo', { points })
      .orderBy('exp.pointsFrom', 'ASC')
      .getOne();
  }
}

export const experienceLevelModel = new ExperienceLevelModel();
