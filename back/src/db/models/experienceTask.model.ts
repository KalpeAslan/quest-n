import { getRepository } from 'typeorm';
import { ExperienceTask } from '../entity';
import { BaseRepositoryService } from './BaseRepository';

export class ExperienceTaskModel extends BaseRepositoryService<ExperienceTask> {
  constructor() {
    super(ExperienceTask);
  }

  findOneByType(experienceType: string) {
    return getRepository(ExperienceTask).findOne({
      where: { type: experienceType },
    });
  }

  findByParams(params: any, relations?: string[]) {
    return getRepository(ExperienceTask).find({
      where: { ...params },
      relations,
      order: {
        createdAt: 'DESC',
      },
    });
  }
}

export const experienceTaskModel = new ExperienceTaskModel();
