import { MailService } from '@sendgrid/mail';
import { getConfig } from '../../config';

const {
  SENDGRID_API_KEY,
  SENDGRID_EMAIL,
  SENDGRID_EMAIL_TEMPLATE_ID_CONFIRM_REGISTRATION,
  SENDGRID_EMAIL_TEMPLATE_ID_INVITE_TO_PARTNER_PROJECT,
  FRONTEND_DOMAIN,
} = getConfig();
const sendGridClient = new MailService();
sendGridClient.setApiKey(SENDGRID_API_KEY);

class SendGridApiService {
  async sendInviteToPartnerProject(to: string, projectName: string, inviteId: number) {
    const link = `${FRONTEND_DOMAIN}?inviteToPartnerProjectId=${inviteId}&email=${to}`;
    const msg = {
      to,
      from: SENDGRID_EMAIL,
      templateId: SENDGRID_EMAIL_TEMPLATE_ID_INVITE_TO_PARTNER_PROJECT,
      dynamicTemplateData: {
        link,
        projectName,
      },
    };

    sendGridClient.send(msg);
  }

  async sendToken(
    to: string,
    token: string,
    frontendDomain: string,
    referralCode: string,
    redirectUrl: string,
    isValidReferralCode: boolean,
  ) {
    let link = `${frontendDomain}verify-email?token=${token}&email=${to}&redirect=${redirectUrl}`;
    if (referralCode && isValidReferralCode) {
      link = link + `&referral_code=${referralCode}`;
    }

    if (referralCode && !isValidReferralCode) {
      link = link + `&quest_referral_code=${referralCode}`;
    }

    const msg = {
      to,
      from: SENDGRID_EMAIL, // Use the email address or domain you verified above
      templateId: SENDGRID_EMAIL_TEMPLATE_ID_CONFIRM_REGISTRATION,
      dynamicTemplateData: {
        link,
      },
    };

    return sendGridClient.send(msg);
  }

  async sendEmail(to: string, subject: string, messageHtml: string, message?: string) {
    const msg = {
      to,
      from: SENDGRID_EMAIL, // Use the email address or domain you verified above
      subject,
      html: messageHtml,
    };

    if (message) {
      msg['text'] = message;
    }

    return sendGridClient.send(msg);
  }
}

export const sendGridApiService = new SendGridApiService();
