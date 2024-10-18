export const ConflictErrorKeys = Object.freeze({
  AccountAlreadyExists: 'AccountAlreadyExists',
  TokenAlreadyExists: 'TokenAlreadyExists',
  MaxTokensLimit: 'MaxTokensLimit',
  ConflictError: 'ConflictError',
  TransactionAlreadyExists: 'TransactionAlreadyExists',
});

const ConflictErrorData = {
  AccountAlreadyExists: {
    errorCode: 4000,
    message: 'Account already in use',
  },
  TokenAlreadyExists: {
    errorCode: 4001,
    message: 'Token already in use',
  },
  MaxTokensLimit: {
    errorCode: 4002,
    message: 'Max tokens limit is 5',
  },
  ConflictError: {
    errorCode: 4003,
    message: 'ConflictError',
  },
  TransactionAlreadyExists: {
    errorCode: 4004,
    message: 'Transaction already exists',
  },
};

type ConflictErrorType = keyof typeof ConflictErrorData;
export class ConflictError extends Error {
  public errorCode: number;
  public message: string;
  public statusCode: number;
  public body: any;

  constructor(errorKey: ConflictErrorType, customMessage?: string) {
    const errorData = ConflictErrorData[errorKey];
    const message = customMessage || errorData.message;

    super(message);
    this.body = {
      name: 'ConflictError',
      errorCode: errorData.errorCode,
      statusCode: 409,
      message: message,
    };
  }
}
