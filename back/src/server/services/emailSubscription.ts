import { createQueryBuilder } from 'typeorm';

import { EmailSubscription } from '../../db/entity/EmailSubscription';
import { EmailSubscriptionDto } from '../../db/types/interfaces/EmailSubscriptionDto';
import { verifyReCaptcha } from './recaptcha';
import { BadRequestError, BadRequestErrorKeys } from '../errors';

export const subscribeEmail = async (data: EmailSubscriptionDto) => {
  const recaptchaTokenVerified = await verifyReCaptcha(data.reCaptchaToken);

  if (!recaptchaTokenVerified)
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'captcha token is not verified');

  const emailSubsription = new EmailSubscription();

  emailSubsription.email = data.email;

  await createQueryBuilder().insert().into(EmailSubscription).values(emailSubsription).orIgnore(true).execute();
};
