import { Logger } from './logger';

const log = new Logger();

export const isExcludedToValidateRoutePath = (path: string) => {
  log.info(`called Excluded Route Path: ${path}`);
  return EXCLUDED_TO_VALIDATE_PATHS.includes(path);
};

const EXCLUDED_TO_VALIDATE_PATHS = ['/api/entry/refresh-token'];
