import { Repository, EntityTarget, getRepository, DeepPartial, ObjectLiteral } from 'typeorm';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import { JoinOptions } from 'typeorm/find-options/JoinOptions';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

export interface IPaginatableBaseRepository<T> {
  page: number;
  pageSize: number;
  where?: FindConditions<T>[] | FindConditions<T> | ObjectLiteral | string;
  order?: any;
}

export interface IFindAllBaseRepository<T> {
  where?: FindConditions<T>[] | FindConditions<T> | ObjectLiteral | string;
  order?: 'ASC' | 'DESC';
  join?: JoinOptions;
  relations?: string[];
}

export class BaseRepositoryService<Entity extends ObjectLiteral> {
  constructor(private readonly entity: EntityTarget<Entity>) {}

  get repository(): Repository<Entity> {
    return getRepository(this.entity);
  }

  async create(data: DeepPartial<Entity>) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity as any);
  }

  async findOneById(id: number): Promise<Entity | undefined> {
    return await this.repository.findOne(id);
  }

  async findAll(options: IFindAllBaseRepository<Entity>): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      order: {
        id: options.order === 'DESC' ? 'DESC' : 'ASC',
      },
    } as any);
  }

  async findOne(options: FindOneOptions<Entity>) {
    return await this.repository.findOne(options);
  }

  async update(id: number, data: DeepPartial<Entity>): Promise<Entity | undefined> {
    const entityToUpdate = await this.findOneById(id);

    if (!entityToUpdate) {
      return undefined;
    }

    Object.assign(entityToUpdate, data);
    await this.repository.save(entityToUpdate as any);

    return entityToUpdate;
  }

  async delete(id: number): Promise<boolean> {
    const entityToDelete = await this.findOneById(id);

    if (!entityToDelete) {
      return false;
    }

    await this.repository.remove(entityToDelete);

    return true;
  }

  async paginatable({
    page,
    pageSize,
    where,
    order,
  }: IPaginatableBaseRepository<Entity>): Promise<{ items: Entity[]; total: number; pagesCount }> {
    const [items, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      order: {
        id: order === 'DESC' ? 'DESC' : 'ASC',
      },
    } as any);

    const pagesCount = Math.ceil(total / pageSize);

    return { items, total, pagesCount };
  }
}
