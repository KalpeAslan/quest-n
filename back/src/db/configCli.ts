import { getConnectionOptions } from './initDBConnection';

module.exports = getConnectionOptions(
  {
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    password: process.env.DB_PASSWORD as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USER as string,
  },
  process.env.DB_HOST,
);
