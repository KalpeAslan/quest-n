import { IsInt, IsNotEmpty, validate, IsString, IsOptional, IsNumber } from 'class-validator';
import { Expose, plainToClass, Type } from 'class-transformer';
import 'reflect-metadata';
import { BadRequestError, BadRequestErrorKeys } from '../errors';

class ConfigDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  APP_HOST!: string;

  @Type(() => Number)
  @Expose()
  @IsInt()
  @IsNotEmpty()
  APP_PORT!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  APP_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  AWS_ACCESS_KEY_ID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  AWS_SECRET_ACCESS_KEY!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  AWS_REGION!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  FRONTEND_DOMAIN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  REFLINK_IV!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  REFLINK_ENCRYPTION_KEY!: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  NEW_USER_DAYS_RANGE!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  @Type(() => Number)
  @Expose()
  @IsInt()
  @IsNotEmpty()
  DB_PORT!: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  S3_BUCKET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  RECAPTCHA_BASE_URL!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  RECAPTCHA_INVISIBLE_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  RECAPTCHA_V3_INVISIBLE_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DISCORD_LOGIN_URL!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DISCORD_CLIENT_ID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DISCORD_CLIENT_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DISCORD_REDIRECT_URI!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DISCORD_SCOPE!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_ID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_NAME!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TELEGRAM_API_KEY!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_TOKEN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_URL!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  GOOGLE_CALLBACK_URL!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWILIO_KEY_SID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWILIO_ACCOUNT_SID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWILIO_AUTH_TOKEN_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWILIO_VERIFY_SERVICE!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SENDGRID_API_KEY!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SENDGRID_EMAIL!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SENDGRID_EMAIL_TEMPLATE_ID_CONFIRM_REGISTRATION!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SENDGRID_EMAIL_TEMPLATE_ID_INVITE_TO_PARTNER_PROJECT!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  MORALIS_WEB3_API_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  RABBITMQ_URL: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWITTER_SERVICE_RABBITMQ_QUEUE_NAME: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  COMPLETED_TASKS_RABBITMQ_QUEUE_NAME: string;

  @Expose()
  @IsString()
  @IsOptional()
  DEFAULT_PARTNER_PROJECT_LOGO!: string;

  @Expose()
  @IsString()
  @IsOptional()
  DEFAULT_LOYALTY_PROJECT_PREVIEW_IMAGE!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  REFERRAL_SERVICE_HOST: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DATADOG_API_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  DATADOG_SERVICE_NAME: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ONLYPLAY_SECRET_KEY: string;

  @Type(() => Number)
  @Expose()
  @IsInt()
  @IsNotEmpty()
  ONLYPLAY_PROJECT_ID: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ONLYPLAY_API_URL: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWITTER_CONSUMER_KEY!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWITTER_CONSUMER_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWITTER_APP_BEARER_TOKEN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TWITTER_CALLBACK_URL!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SQS_REGION!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SQS_SERVICE_ENDPOINT!: string;

  @Expose()
  @IsString()
  @IsOptional()
  SQS_ACCESS_KEY_ID!: string;

  @Expose()
  @IsString()
  @IsOptional()
  SQS_SECRET_ACCESS_KEY!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SQS_ACCOUNT_ID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SQS_LIKES_QUEUE!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SQS_RETWEETS_QUEUE!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SQS_CHECK_USER_QUEUE!: string;

  @Expose()
  @IsString()
  @IsOptional()
  NO_TWEET_ANALYZE!: string;

  @Expose()
  @IsString()
  @IsOptional()
  ENV!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SNS_ARN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  SCRAPERAPI_KEY!: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  INVITE_TASK_LIMIT!: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  ADMIN_TASK_LIMIT!: number;

  //ETHERSCAN
  @Expose()
  @IsString()
  @IsNotEmpty()
  X1_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X1_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X1_SCAN_API_KEY_V2: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X1_RPC_URL: string;
  // POLYGONSCAN
  @Expose()
  @IsString()
  @IsNotEmpty()
  X89_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X89_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X89_RPC_URL: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X89_DEPLOYER: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X89_TREASURY: string;

  // BSCSCAN
  @Expose()
  @IsString()
  @IsNotEmpty()
  X38_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X38_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X38_RPC_URL: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X38_DEPLOYER: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X38_TREASURY: string;
  //AVASCAN
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA86A_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA86A_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA86A_RPC_URL: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA86A_DEPLOYER: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA86A_TREASURY: string;
  // ARBITRUM;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA4B1_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA4B1_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA4B1_RPC_URL: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA4B1_DEPLOYER: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA4B1_TREASURY: string;
  //OPTIMISM;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA_RPC_URL: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA_DEPLOYER: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  XA_TREASURY: string;
  //KCC EXPLORER;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X141_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X141_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X141_RPC_URL: string;
  //BITGERT EXPLORER;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X7F08_SCAN: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X7F08_SCAN_API_KEY: string;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X7F08_RPC_URL: string;
  //ZETACHAIN EXPLORER;
  @Expose()
  @IsString()
  @IsNotEmpty()
  X1B59_RPC_URL: string;
  //GOERLI
  @Expose()
  @IsString()
  @IsNotEmpty()
  X5_RPC_URL: string;

  @Expose()
  @IsString()
  @IsOptional()
  X5_DEPLOYER: string;

  @Expose()
  @IsString()
  @IsOptional()
  X5_TREASURY: string;

  // Aurora
  @Expose()
  @IsString()
  @IsOptional()
  X4E454152_SCAN_API_KEY: string;

  @Expose()
  @IsString()
  @IsOptional()
  X4E454152_RPC_URL: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TELEGRAM_BOT_TRACKER: string;

  @Expose()
  @IsString()
  @IsOptional()
  DISABLE_CAPTCHA: string;

  @Expose()
  @IsString()
  @IsOptional()
  CONTRACT_PRIVATE_KEY: string;

  @Expose()
  @IsString()
  @IsOptional()
  GIT_COIN_SCORE_ID: string;

  @Expose()
  @IsString()
  @IsOptional()
  GIT_COIN_API_KEY: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  NOTIFICATION_SERVICE_HOST!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  X66EED_RPC_URL!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  EXPERIENCE_LEVEL_CHAIN_ID!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  EXPERIENCE_LEVEL_CONTRACT_ADDRESS!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  EXPERIENCE_LEVEL_RPC_NODE!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  TG_AUTH_BOT_API_TOKEN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ANALYTICS_DOMAIN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  FIREBASE_API_KEY: string;
}

export const getConfig = (): ConfigDto => {
  const config = plainToClass(ConfigDto, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  // validate(config, { validationError: { target: false, value: false } }).then((validationErrors) => {
  //   if (validationErrors.length) {
  //     throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, JSON.stringify(validationErrors));
  //   }
  // });

  return config;
};
