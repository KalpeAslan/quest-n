import { Twilio } from 'twilio';

import { getConfig } from '../../config';

const { TWILIO_ACCOUNT_SID, TWILIO_KEY_SID, TWILIO_AUTH_TOKEN_SECRET, TWILIO_VERIFY_SERVICE } = getConfig();

class TwilioApiService {
  private client: InstanceType<typeof Twilio>;
  constructor() {
    this.client = new Twilio(TWILIO_KEY_SID, TWILIO_AUTH_TOKEN_SECRET, { accountSid: TWILIO_ACCOUNT_SID });
  }

  sendCode(phoneNumber: string) {
    return this.client.verify.v2.services(TWILIO_VERIFY_SERVICE).verifications.create({
      to: phoneNumber,
      channel: 'sms',
    });
  }

  sendCodeToEmail(email: string) {
    return this.client.verify.v2.services(TWILIO_VERIFY_SERVICE).verifications.create({
      to: email,
      channel: 'email',
    });
  }

  fetchVerified(phoneNumber: string, code: string) {
    return this.client.verify.v2.services(TWILIO_VERIFY_SERVICE).verificationChecks.create({
      to: phoneNumber,
      code,
    });
  }
}

export const twilioApiService = new TwilioApiService();
