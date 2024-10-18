import { getConfig } from './config';
import { Logger } from './services/logger';
import { initDBConnection } from '../db/initDBConnection';
import { server } from './app';

const log = new Logger();

(async () => {
  const config = getConfig();
  const dbConnection = await initDBConnection({
    database: config.DB_NAME,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    username: config.DB_USER,
  });

  const httpServer = server.listen(config.APP_PORT); //for websocket connection

  log.info(`APP Server is running on port: ${config.APP_PORT}`);

  process.on('SIGINT', async () => {
    log.info('SIGINT signal received.');
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    log.info('SIGTERM signal received.');
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    log.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, p) => {
    log.error(`Possibly Unhandled Rejection at: Promise  ${p}, reason: ${reason}`);
    p.catch((error) => log.error(error));
  });
})();
