import * as dotenv from 'dotenv';
import 'reflect-metadata';

import { IsInt, IsNotEmpty, IsOptional, IsString, validate } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';

dotenv.config();

export class MainConfigDto {
  @Expose()
  @IsString()
  @IsOptional()
  ENV!: string;

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
  ANALYTICS_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ANALYTICS_SALT!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ANALYTICS_PASSWORD!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ANALYTICS_LOGIN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_SECRET!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_SALT!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_PASSWORD!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_LOGIN!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ADMIN_TOKEN_LIFETIME!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  IV!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  ENCRYPTION_KEY!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  REACT_APP_ENVIRONMENT!: 'dev' | 'prod';

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
  @IsNotEmpty()
  SNS_ARN!: string;

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
}

type MergedConfig = MainConfigDto;

let mergedConfig: MergedConfig;

export const getConfig = (): MergedConfig => {
  if (mergedConfig) return mergedConfig;

  const config = plainToClass(MainConfigDto, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  validate(config, { validationError: { target: false, value: false } }).then((validationErrors) => {
    if (validationErrors.length) {
      throw new Error(JSON.stringify(validationErrors));
    }
  });

  return config;
};
