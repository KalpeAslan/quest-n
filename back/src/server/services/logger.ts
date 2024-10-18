import { getNamespace } from 'cls-hooked';
import { createLogger, format, transports } from 'winston';

export class RequestLogger {
  private logger: any;

  constructor() {
    const httpTransportOptions = {
      host: 'http-intake.logs.datadoghq.eu',
      path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=${process.env.DATADOG_SERVICE_NAME}`,
      ssl: true,
    };

    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.Http(httpTransportOptions)],
    });
  }

  info(request, additionalData?): void {
    const message = this.prepare(request, additionalData);
    this.logger.info(`request: ${request.originalUrl}`, message);
  }

  error(request, additionalData?): void {
    const message = this.prepare(request, additionalData);
    this.logger.error(`error: ${request.originalUrl}`, message);
  }

  warn(request, additionalData?): void {
    const message = this.prepare(request, additionalData);
    this.logger.warn(`error: ${request.originalUrl}`, message);
  }

  prepare(request, additionalData?): object {
    if (additionalData) {
      additionalData = this.maskObjectValues(additionalData);
    }
    const session = getNamespace('cls-session');
    const logTraceId = session.get('logTraceId');

    return {
      logTraceId,
      request: {
        method: request.method,
        url: request.originalUrl,
        query: JSON.stringify(request.query, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
        body: JSON.stringify(request.body, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
        params: JSON.stringify(request.params, (key, value) => (typeof value === 'bigint' ? value.toString() : value)),
        userAgent: request.headers ? request.headers['user-agent'] : undefined,
        remoteAddress: request.ip,
      },
      investorId: request.investorId,
      ...additionalData,
    };
  }

  maskObjectValues(obj: Record<string, any>, maskChar = '*', recursionDepth = 1): Record<string, any> {
    const maskedObj: Record<string, any> = {};
    const keysToMask = ['password', 'confirmToken', 'token', 'emailToken'];

    for (const key in obj) {
      const value = obj[key];

      if (keysToMask.includes(key)) {
        maskedObj[key] = maskChar.repeat(8);
      } else if (typeof value === 'object' && value !== null && recursionDepth < 10) {
        maskedObj[key] = this.maskObjectValues(value, maskChar, recursionDepth + 1);
      } else {
        maskedObj[key] = value;
      }
    }

    return maskedObj;
  }
}

export class Logger {
  private logger: any;

  constructor() {
    const httpTransportOptions = {
      host: 'http-intake.logs.datadoghq.eu',
      path: `/api/v2/logs?dd-api-key=${process.env.DATADOG_API_KEY}&ddsource=nodejs&service=${process.env.DATADOG_SERVICE_NAME}`,
      ssl: true,
    };

    this.logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.Http(httpTransportOptions), new transports.Console()],
    });
  }

  info(message): void {
    const session = getNamespace('cls-session');
    const logTraceId = session.get('logTraceId');

    this.logger.info(`${message}`, { logTraceId });
  }

  error(message): void {
    const session = getNamespace('cls-session');
    const logTraceId = session.get('logTraceId');

    this.logger.error(`${message}`, { logTraceId });
  }

  warn(message): void {
    const session = getNamespace('cls-session');
    const logTraceId = session.get('logTraceId');

    this.logger.warn(`${message}`, { logTraceId });
  }
}
