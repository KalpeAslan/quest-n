export const RateLimitErrorKeys = Object.freeze({
  SmsLimitIsUsed: 'SmsLimitIsUsed',
  RpcNodeLimitIsUsed: 'RpcNodeLimitIsUsed',
  TwitterLimitIsUsed: 'TwitterLimitIsUsed',
});

const RateLimitErrorData = {
  SmsLimitIsUsed: {
    errorCode: 3000,
    message: 'Limit sms is used',
  },
  RpcNodeLimitIsUsed: {
    errorCode: 3001,
    message: 'Limit rpc node is used',
  },
  TwitterLimitIsUsed: {
    errorCode: 3002,
    message: 'Twitter limit is used',
  },
};

type RateLimitErrorType = keyof typeof RateLimitErrorData;
export class RateLimitError extends Error {
  public errorCode: number;
  public message: string;
  public statusCode: number;
  public body: any;

  constructor(errorKey: RateLimitErrorType, customMessage?: string) {
    const errorData = RateLimitErrorData[errorKey];
    const message = customMessage || errorData.message;

    super(message);
    this.body = {
      name: 'RateLimitError',
      errorCode: errorData.errorCode,
      statusCode: 429,
      message: message,
    };
  }
}
