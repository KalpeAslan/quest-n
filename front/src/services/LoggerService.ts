export class LoggerService {
  private static readonly logger = console;

  public static log(message?: any, ...optionalParams: any[]): void {
    LoggerService.logger.log(message, ...optionalParams);
  }

  public static warn(message: any, warn: any): void {
    LoggerService.logger.warn(message, warn);
  }

  public static error(message: any, error: any): void {
    LoggerService.logger.error(message, error);
  }
}
