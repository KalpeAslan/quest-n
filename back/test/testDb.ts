import { Connection, FindManyOptions, getConnection, getManager, In } from 'typeorm';

import { entities } from '../src/db/entity';
import { initDBConnection } from '../src/db/initDBConnection';
import { getConfig } from './config';

const config = getConfig();

let connection: Connection;

export async function dbConnection(database = 'test') {
  if (!connection) {
    connection = await initDBConnection({
      database,
      host: process.env.DB_HOST || 'localhost',
      password: process.env.DB_PASSWORD || 'postgres',
      username: process.env.DB_USER || 'postgres',
      port: Number(process.env.DB_PORT) || 5432,
    });

    if (database === 'test') await connection.runMigrations();
  }

  return connection;
}
export async function dbClear(connection, entity: any, key = 'id', ids: number[] | string[]) {
  const isEntityExist = entities.includes(entity);
  if (!isEntityExist) throw new Error();

  await connection.query(
    `DELETE FROM ${getManager().getRepository(entity.name).metadata.tableName} WHERE "${key}" IN (${ids})`,
  );
}

export async function dbTruncate(connection, entity: any) {
  const isEntityExist = entities.includes(entity);
  if (!isEntityExist) throw new Error();

  await connection.query(`TRUNCATE TABLE ${getManager().getRepository(entity.name).metadata.tableName}`);
}
export async function dbTruncateAll() {
  const connection = getConnection();

  for (const entity of connection.entityMetadatas) {
    const tableName = entity.tableName;

    const query = `
      DO $$ 
      BEGIN
         IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '${tableName}') THEN 
            TRUNCATE "${tableName}" CASCADE; 
         END IF;
      END $$;
    `;

    await connection.query(query);
  }
}

export function dbSave(connection, entity, data) {
  const isEntityExist = entities.includes(entity);
  if (!isEntityExist) throw new Error();

  return connection.getRepository(entity).save(data);
}

export class TestDb {
  constructor(private connection: Connection) {}

  async save<T>(Entity, data): Promise<T> {
    return this.connection.getRepository(Entity).save(data);
  }

  async findAll<T>(Entity): Promise<T[]> {
    const records = await this.connection.getRepository(Entity).find();

    return records as T[];
  }

  async findAllIds<T>(Entity): Promise<number[]> {
    const records: any[] = await this.connection.getRepository(Entity).find();

    return records.map((i) => {
      return i.id;
    }) as number[];
  }

  async findOneById<T>(Entity, id, relations?): Promise<T> {
    const queryParams: any = { where: { id } };

    if (relations) {
      queryParams.relations = relations;
    }
    const record = await this.connection.getRepository(Entity).findOne(queryParams);

    return record as T;
  }

  async findByCondition<T>(Entity, condition: FindManyOptions<T>): Promise<T[]> {
    const records = await this.connection.getRepository(Entity).find(condition);

    return records as T[];
  }

  deleteById(Entity, id) {
    return this.connection.getRepository(Entity).delete(id);
  }

  deleteByIds(Entity, ids: number[]) {
    return this.connection.getRepository(Entity).delete({ id: In(ids) });
  }

  dbClearAll(Entity: any) {
    const isEntityExist = entities.includes(Entity);
    if (!isEntityExist) throw new Error();

    return this.connection.getRepository(Entity).clear();
  }
}
