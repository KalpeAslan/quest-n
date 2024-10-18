export const InternalServerErrorKeys = Object.freeze({
  Default: 'Default',
});

const InternalServerErrorData = {
  Default: {
    errorCode: 6000,
    message: 'Internal server error',
  },
};

type InternalServerErrorType = keyof typeof InternalServerErrorData;
export class InternalServerError extends Error {
  public errorCode: number;
  public message: string;
  public statusCode: number;
  public body: any;

  constructor(errorKey: InternalServerErrorType, customMessage?: string) {
    const errorData = InternalServerErrorData[errorKey];
    const message = customMessage || errorData.message;

    super(message);
    this.body = {
      name: 'InternalServerError',
      errorCode: errorData.errorCode,
      statusCode: 500,
      message: message,
    };
  }
}
