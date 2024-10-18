export const BadRequestErrorKeys = Object.freeze({
  EmailAlreadyExist: 'EmailAlreadyExist',
  CodeIsNotValid: 'CodeIsNotValid',
  TwoFactorAuthAlreadyConnected: 'TwoFactorAuthAlreadyConnected',
  RetrySendCodeLimit: 'RetrySendCodeLimit',
  TwoFactorRecordNotFound: 'TwoFactorRecordNotFound',
  UserHasTwoFactorAuth: 'UserHasTwoFactorAuth',
  UserHasNotTwoFactorAuth: 'UserHasNotTwoFactorAuth',
  WrongDeleteToken: 'WrongDeleteToken',
  WrongRefreshToken: 'WrongRefreshToken',
  AlreadyHaveReferrer: 'AlreadyHaveReferrer',
  WrongReferrerCode: 'WrongReferrerCode',
  ExpiredReferrerAddingPeriod: 'ExpiredReferrerAddingPeriod',
  WrongWallet: 'WrongWallet',
  WalletAlreadyUsed: 'WalletAlreadyUsed',
  AlreadyHaveReferrals: 'AlreadyHaveReferrals',
  UserAlreadyExist: 'UserAlreadyExist',
  UserWithEmailDoesNotExist: 'UserWithEmailDoesNotExist',
  EmailIsNotValid: 'EmailIsNotValid',
  EmailIsNotVerified: 'EmailIsNotVerified',
  PasswordNotMatch: 'PasswordNotMatch',
  ResetCodeIsNotValid: 'ResetCodeIsNotValid',
  UserDoesNotExist: 'UserDoesNotExist',
  PasswordCanNotBeEmpty: 'PasswordCanNotBeEmpty',
  NotValidDataProvided: 'NotValidDataProvided',
  DiscordRefreshToken: 'DiscordRefreshToken',
  TaskWasNotFound: 'TaskWasNotFound',
  NotValidParameter: 'NotValidParameter',
  RedundantInvite: 'RedundantInvite',
  ReCaptchaTokenInvalid: 'ReCaptchaTokenInvalid',
  GitCoinUserDoesntExist: 'GitCoinUserDoesntExist',
  CannotFetchTokenNameAndSymbol: 'CannotFetchTokenNameAndSymbol',
  ImageUploadFileTooLarge: 'ImageUploadFileTooLarge',
  InsufficientTokenAmount: 'InsufficientTokenAmount',
  TypeormBadRequest: 'TypeormBadRequest',
});

export const BadRequestErrorData = {
  EmailAlreadyExist: {
    errorCode: 1000,
    message: 'Email already exist',
  },
  CodeIsNotValid: {
    errorCode: 1001,
    message: 'code is not valid',
  },
  TwoFactorAuthAlreadyConnected: {
    errorCode: 1002,
    message: 'two factor auth already connected',
  },
  RetrySendCodeLimit: {
    errorCode: 1003,
    message: 'Retry send code limit',
  },
  TwoFactorRecordNotFound: {
    errorCode: 1005,
    message: '2fa record not found',
  },
  UserHasTwoFactorAuth: {
    errorCode: 1006,
    message: 'user has 2fa',
  },
  UserHasNotTwoFactorAuth: {
    errorCode: 1007,
    message: 'user has not 2fa',
  },
  WrongDeleteToken: {
    errorCode: 1008,
    message: 'wrong delete token',
  },
  WrongRefreshToken: {
    errorCode: 1009,
    message: 'wrong refresh token',
  },
  AlreadyHaveReferrer: {
    errorCode: 1010,
    message: 'already have referrer',
  },
  WrongReferrerCode: {
    errorCode: 1011,
    message: 'wrong referrer code',
  },
  ExpiredReferrerAddingPeriod: {
    errorCode: 1012,
    message: 'expired referrer period',
  },
  WrongWallet: {
    errorCode: 1013,
    message: 'wrong wallet',
  },
  WalletAlreadyUsed: {
    errorCode: 1014,
    message: 'wallet already used',
  },
  AlreadyHaveReferrals: {
    errorCode: 1015,
    message: 'Added referral already have referrals',
  },
  UserAlreadyExist: {
    errorCode: 1016,
    message: 'user already exist',
  },
  UserWithEmailDoesNotExist: {
    errorCode: 1017,
    message: 'user with this email does not exist',
  },
  EmailIsNotValid: {
    errorCode: 1018,
    message: 'email is not valid',
  },
  EmailIsNotVerified: {
    errorCode: 1019,
    message: 'email is not verified',
  },
  PasswordNotMatch: {
    errorCode: 1020,
    message: 'confirmNewPassword does not match',
  },
  ResetCodeIsNotValid: {
    errorCode: 1021,
    message: 'reset password code is not verified',
  },
  UserDoesNotExist: {
    errorCode: 1022,
    message: 'user does not exist',
  },
  PasswordCanNotBeEmpty: {
    errorCode: 1023,
    message: 'password can not be empty',
  },
  NotValidDataProvided: {
    errorCode: 1024,
    message: 'not valid data provided',
  },
  DiscordRefreshToken: {
    errorCode: 1025,
    message: 'discord refresh token error',
  },
  TaskWasNotFound: {
    errorCode: 1025,
    message: 'task was not found',
  },
  NotValidParameter: {
    errorCode: 1026,
    message: 'Wrong Parameter',
  },
  RedundantInvite: {
    errorCode: 1027,
    message: 'Redundant Invite',
  },
  ReCaptchaTokenInvalid: {
    errorCode: 1028,
    message: 'ReCaptcha Token',
  },
  GitCoinUserDoesntExist: {
    errorCode: 1029,
    message: 'GitCoin User Doesnt Exist',
  },
  CannotFetchTokenNameAndSymbol: {
    errorCode: 1030,
    message: 'Cannot fetch token name and symbol',
  },
  ImageUploadFileTooLarge: {
    errorCode: 1031,
    message: 'Image upload file too large',
  },
  InsufficientTokenAmount: {
    errorCode: 1032,
    message: 'Insufficient tokens amount',
  },
  TypeormBadRequest: {
    errorCode: 1033,
    message: 'Typeorm bad request',
  },
};

type errorKeysType = keyof typeof BadRequestErrorData;

export class BadRequestError extends Error {
  public errorCode: number;
  public message: string;
  public statusCode: number;
  public body: any;

  constructor(errorKey: errorKeysType, customMessage?: string) {
    const errorData = BadRequestErrorData[errorKey];
    const message = customMessage || errorData.message;

    super(message);
    this.body = {
      name: 'BadRequest',
      errorCode: errorData.errorCode,
      statusCode: 400,
      message: message,
    };
  }
}
