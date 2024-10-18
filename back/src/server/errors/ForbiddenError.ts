export const ForbiddenErrorKeys = Object.freeze({
  TokenExpired: 'TokenExpired',
  TokenIsNotValid: 'TokenIsNotValid',
  NotCorrectCredentials: 'NotCorrectCredentials',
  NotClaimingPeriod: 'NotClaimingPeriod',
  NotAWinner: 'NotAWinner',
});

const ForbiddenErrorData = {
  TokenExpired: {
    errorCode: 2000,
    message: 'Token is expired',
  },
  TokenIsNotValid: {
    errorCode: 2001,
    message: 'wrong token',
  },
  NotCorrectCredentials: {
    errorCode: 2001,
    message: 'Bad login or password',
  },
  NotClaimingPeriod: {
    errorCode: 2002,
    message: 'Claiming period not started or expired',
  },
  NotAWinner: {
    errorCode: 2003,
    message: 'You are not a winner',
  },
};

type ErrorKeysType = keyof typeof ForbiddenErrorData;
export class ForbiddenError extends Error {
  public errorCode: number;
  public message: string;
  public statusCode: number;
  public body: any;

  constructor(errorKey: ErrorKeysType, customMessage?: string) {
    const errorData = ForbiddenErrorData[errorKey];
    const message = customMessage || errorData.message;

    super(message);
    this.body = {
      name: 'ForbiddenError',
      errorCode: errorData.errorCode,
      statusCode: 403,
      message: message,
    };
  }
}
