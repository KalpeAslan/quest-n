import * as correlator from 'correlation-id';
import { pino } from 'pino';

export function LogErrors(logger: pino.Logger) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const $log = logger.child({ traceId: correlator.getId(), method: propertyKey });
      $log.trace(propertyKey);
      try {
        return originalMethod.apply(this, args);
      } catch (e) {
        $log.error(e, `Failed in ${propertyKey}`);
        throw e;
      }
    };
  };
}
