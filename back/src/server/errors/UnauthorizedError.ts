export const UnauthorizedErrorKeys = Object.freeze({
  InvalidSignature: 'InvalidSignature',
  WrongToken: 'WrongToken',
  OAuthError: 'OAuthError',
  SessionExpired: 'SessionExpired',
  WalletNotConnected: 'WalletNotConnected',
  TypeormAuthError: 'TypeormAuthError',
});

const UnauthorizedErrorData = {
  InvalidSignature: {
    errorCode: 5000,
    message: 'Invalid signature',
  },
  WrongToken: {
    errorCode: 5001,
    message: 'Wrong token',
  },
  OAuthError: {
    errorCode: 5002,
    message: 'OAuth error',
  },
  SessionExpired: {
    errorCode: 5003,
    message: 'SessionExpired error',
  },
  WalletNotConnected: {
    errorCode: 5004,
    message: 'WalletNotConnected error',
  },
  TypeormAuthError: {
    errorCode: 5005,
    message: 'TypeormAuthError error',
  },
};

type UnauthorizedErrorType = keyof typeof UnauthorizedErrorData;
export class UnauthorizedError extends Error {
  public errorCode: number;
  public message: string;
  public statusCode: number;
  public body: any;

  constructor(errorKey: UnauthorizedErrorType, username?: string, customMessage?: string) {
    const errorData = UnauthorizedErrorData[errorKey];
    const message = customMessage || errorData.message;

    super(message);
    this.body = {
      username: username,
      name: 'UnauthorizedError',
      errorCode: errorData.errorCode,
      statusCode: 401,
      message: message,
    };
  }
}
