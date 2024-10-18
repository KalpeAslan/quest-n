export const NotFoundErrorKeys = Object.freeze({
  NotFound: 'NotFound',
});

const NotFoundErrorData = {
  NotFound: {
    errorCode: 7000,
    message: 'Not found',
  },
};

type ErrorKeysType = keyof typeof NotFoundErrorData;
export class NotFoundError extends Error {
  public errorCode: number;
  public message: string;
  public statusCode: number;
  public body: any;

  constructor(errorKey: ErrorKeysType, customMessage?: string) {
    const errorData = NotFoundErrorData[errorKey];
    const message = customMessage || errorData.message;

    super(message);
    this.body = {
      name: 'NotFoundError',
      errorCode: errorData.errorCode,
      statusCode: 404,
      message: message,
    };
  }
}
