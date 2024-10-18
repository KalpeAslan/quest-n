import { ErrorRequestHandler } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { RequestLogger } from '../services/logger';
import {
  BadRequestError,
  ForbiddenError,
  RateLimitError,
  ConflictError,
  UnauthorizedError,
  UnauthorizedErrorKeys,
  ConflictErrorKeys,
  InternalServerError,
  InternalServerErrorKeys,
  BadRequestErrorKeys,
  NotFoundError,
  NotFoundErrorKeys,
} from '../errors';
import { MulterError } from 'multer';

const logger = new RequestLogger();

const ignoredRoutes = ['/loyalty-tasks/:loyaltyTaskId/checkTask'];

export const errorRequestHandler: ErrorRequestHandler = async (err, req, res, next) => {
  // Handle sql/typeorm request errors
  if (err && err.code && (err.code.startsWith('42') || err.code.startsWith('22') || err.code.startsWith('23'))) {
    err = new BadRequestError(BadRequestErrorKeys.TypeormBadRequest, err.message);
  } else if (err && err.code && err.code.startsWith('02')) {
    err = new NotFoundError(NotFoundErrorKeys.NotFound, err.message);
  } else if (err && err.code && err.code.startsWith('08')) {
    err = new InternalServerError(InternalServerErrorKeys.Default, err.message);
  } else if (err && err.code && err.code.startsWith('28')) {
    err = new UnauthorizedError(UnauthorizedErrorKeys.TypeormAuthError, err.message);
  } else if (err && err.message && err.message.includes('not find any entity of type')) {
    err = new NotFoundError(NotFoundErrorKeys.NotFound, err.message);
  }

  if (req.route && req.route.path && ignoredRoutes.includes(req.route.path)) {
    return res.status(400).send({ ...err.body });
  }

  if (err instanceof MulterError) {
    err = new BadRequestError(BadRequestErrorKeys.ImageUploadFileTooLarge);
  }
  if (err.response && (err.response.status === 429 || err.response.status === 403)) {
    logger.error(req, {
      err,
      errorStack: err.stack,
      errorKeys: Object.keys(err),
      countErrorKeys: Object.keys(err).length,
      typeofError: typeof err,
      response: err.body,
    });
  } else if (isHandledError(err)) {
    logger.warn(req, {
      err,
      errorStack: err.stack,
      errorKeys: Object.keys(err),
      countErrorKeys: Object.keys(err).length,
      typeofError: typeof err,
      response: err.body,
    });
  } else {
    logger.error(req, {
      err,
      errorStack: err.stack,
      errorKeys: Object.keys(err),
      countErrorKeys: Object.keys(err).length,
      response: err.body,
    });
  }

  if (err instanceof JsonWebTokenError && err.name === 'TokenExpiredError') {
    err = new UnauthorizedError(UnauthorizedErrorKeys.InvalidSignature);
  }

  if (err.code && err.code == 23505) {
    err = new ConflictError(ConflictErrorKeys.AccountAlreadyExists);
  }

  if (
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof BadRequestError ||
    err instanceof ConflictError ||
    err instanceof NotFoundError
    // err instanceof RateLimitError
  ) {
    return res.status(err.body.statusCode).send({ success: 'false', ...err.body });
  }

  // TODO: ask front end to check if we use message in conditions
  if (err instanceof RateLimitError)
    return res.status(429).send({ message: 'Too many requests', success: 'false', ...err.body });

  err = new InternalServerError(InternalServerErrorKeys.Default);
  return res.status(err.body.statusCode).send({ success: false, ...err.body });
};

function isHandledError(err): boolean {
  if (
    (err.body && err.body.statusCode == 409) ||
    (err.body && err.body.statusCode == 401) ||
    (err.body && err.body.statusCode == 403) ||
    (err.body && err.body.statusCode == 404) ||
    (err.body && err.body.statusCode == 400) ||
    err.code ||
    err.name
  ) {
    return true;
  }
  return false;
}
