import pg from 'pg';
import { ConnectionOptions, createConnection } from 'typeorm';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { resolve } from 'path';

import { entities } from './entity';

// Set type parser for numeric (includes decimal) types
pg.types.setTypeParser(
  // 1700 is a numeric type oid
  1700,
  // Convert to float
  (v) => parseFloat(v),
);

export const indexMigrations = (migrationsPath: string): string => {
  const code = readdirSync(migrationsPath)
    .filter((fileName) => {
      return /^\d+-.+\.ts$/.test(fileName);
    })
    .map((fileName) => {
      const fileNameWOExtension = fileName.replace(/\.ts$/, '');
      return `export*from'${migrationsPath}/${fileNameWOExtension}'`;
    })
    .join(';');

  const codeHash = createHash('sha1').update(code).digest('hex');

  const filePath = `/tmp/typeorm-migrations-index-${codeHash}.ts`;

  if (!existsSync(filePath) || readFileSync(filePath, 'utf8') !== code) {
    writeFileSync(filePath, code);
  }

  return filePath;
};

export interface DBConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export const getConnectionOptions = async (dbConfig: DBConfig, host?: string): Promise<ConnectionOptions> => {
  const config = dbConfig;
  const migrations: ConnectionOptions['migrations'] = [indexMigrations(resolve(__dirname, './migration/'))];

  const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: host || config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password: config.password,
    logging: false,
    synchronize: false,
    migrationsRun: false,
    entities,
    migrations,
    cli: {
      entitiesDir: 'src/db/entity',
      migrationsDir: 'src/db/migration',
    },
  };
  return connectionOptions;
};

export const initDBConnection = async (dbConfig: DBConfig) => {
  const connectionOptions = await getConnectionOptions(dbConfig);

  const connection = await createConnection(connectionOptions);
  return connection;
};
