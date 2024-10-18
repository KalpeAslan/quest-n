import * as correlator from 'correlation-id';
import { pino } from 'pino';

export function LogErrors(logger) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (e) {
        logger.error(`Failed in ${propertyKey}: ${e}`);
        throw e;
      }
    };
  };
}
