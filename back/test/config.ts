import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

class ConfigDto {
  ADMIN_NODE_ENV!: 'DEV' | 'PROD';

  ADMIN_PORT!: number;

  PRIVATE_KEY_FOR_DEPLOY!: string;

  PRIVATE_KEY_TOKEN_HOLDER_FOR_TEST!: string;

  DEFAULT_PARTNER_PROJECT_LOGO!: string;

  UPDATE_LOYALTY_PROGRESS_PERIOD!: string;

  REMOVE_BOTOMETER_REQUEST_PERIOD!: string;

  LOYALTY_HANDLER_PERIOD!: string;

  GOOGLE_TRANSLATE_PROJECT!: string;

  GOOGLE_TRANSLATE_CLIENT_EMAIL!: string;

  SET_AG_TOKENS_AVAILABLE_TO_CLAIM!: string;

  UPDATE_LOYALTY_PROJECTS_TRENDING_PERIOD!: string;

  TRENDING_DATES!: number;

  TRENDING_TOP_RECORDS!: number;

  DB_HOST!: string;

  DB_NAME!: string;

  DB_PASSWORD!: string;

  DB_USER!: string;

  DB_PORT!: number;

  S3_BUCKET!: string;

  ADMIN_SECRET!: string;

  ADMIN_LOGIN!: string;

  TWITTER_CONSUMER_KEY!: string;

  TWITTER_CONSUMER_SECRET!: string;

  TWITTER_APP_BEARER_TOKEN!: string;

  TWITTER_CALLBACK_URL!: string;

  DISCORD_LOGIN_URL!: string;

  DISCORD_CLIENT_ID!: string;

  DISCORD_CLIENT_SECRET!: string;

  DISCORD_REDIRECT_URI!: string;

  DISCORD_SCOPE!: string;

  TELEGRAM_BOT_ID!: string;

  TELEGRAM_BOT_NAME!: string;

  TELEGRAM_API_KEY!: string;

  TELEGRAM_BOT_TOKEN!: string;

  GOOGLE_CLIENT_ID!: string;

  GOOGLE_CLIENT_SECRET!: string;

  GOOGLE_CALLBACK_URL!: string;

  TWILIO_KEY_SID!: string;

  TWILIO_ACCOUNT_SID!: string;

  TWILIO_AUTH_TOKEN_SECRET!: string;

  TWILIO_VERIFY_SERVICE!: string;

  TWITTER_MESSAGE_CONSUMPTION_RATE!: string;

  UPDATE_TWEET_IDS_PERIOD!: string;

  IV!: string;

  ENCRYPTION_KEY!: string;

  SCRAPERAPI_KEY!: string;
}

export const getConfig = (): ConfigDto => {
  const config = plainToClass(ConfigDto, process.env, {
    enableImplicitConversion: true,
    excludeExtraneousValues: true,
  });

  // validate(config, { validationError: { target: false, value: false } }).then((validationErrors) => {
  //   if (validationErrors.length) {
  //     throw new Error(JSON.stringify(validationErrors));
  //   }
  // });

  return config;
};
