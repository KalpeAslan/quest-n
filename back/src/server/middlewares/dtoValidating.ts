import { RequestHandler } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export const dtoValidationMiddleware =
  (type: any, skipMissingProperties = false): RequestHandler =>
  async (req, res, next) => {
    let dtoObj;
    let errors;
    if (!Array.isArray(type)) {
      dtoObj = plainToClass(type, req.body);
      errors = await validate(dtoObj, { skipMissingProperties });
    } else {
      for (const typeItem of type) {
        const itemDtoObj = plainToClass(typeItem, req.body);
        const itemErrors = await validate(itemDtoObj, { skipMissingProperties });
        dtoObj = itemDtoObj;
        if (itemErrors.length > 0) {
          errors = itemErrors;
        } else {
          errors = [];
          break;
        }
      }
    }
    if (errors.length > 0) {
      const dtoErrors = errors.map((error: ValidationError) => (Object as any).values(error.constraints)).join(', ');
      next(dtoErrors);
    } else {
      req.body = dtoObj;
      next();
    }
  };
