import { twoFactorCodeSendHistoryModel } from '../../../db/models/twoFactorCodeSendHistoryModel';
import { Logger } from '../logger';
import { twilioApiService } from '../apis/twilioApiService';

const log = new Logger();

export const sendCodeToInvestor = async (investorId: number, phoneNumber: string) => {
  try {
    log.info(`Send auth code to investor: ${investorId}`);
    await twilioApiService.sendCode(phoneNumber);
  } catch (error) {
    log.error(`When try to send verify sms twilio ${error}`);
    return;
  }
  await twoFactorCodeSendHistoryModel.save(investorId);
};

export const codeValidating = async (phoneNumber: string, code: string) => {
  try {
    log.info(`Send validating request`);
    const result = await twilioApiService.fetchVerified(phoneNumber, code);
    return result.status === 'approved';
  } catch (error) {
    log.error(`When try to verify sms twilio ${error}`);
    return false;
  }
};
