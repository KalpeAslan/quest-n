import { BadRequestError, BadRequestErrorKeys, RateLimitError, RateLimitErrorKeys } from '../../errors';
import { phoneHider } from '../../helpers/phoneHider';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';
import { generateEntryResponse } from '../entry/jwt';
import {
  confirm2FARecord,
  confirmDisconnect2FARecord,
  getTwoFactorRecordByInvestorId,
  saveTwoFactorRecord,
} from './2faCode';
import { getLimitInfo } from './2faSmsLimits';
import { codeValidating, sendCodeToInvestor } from './2faValidating';

export const connect2FA = async (investorId: number, phoneNumber: string) => {
  const twoFactorRecord = await getTwoFactorRecordByInvestorId(investorId);
  if (twoFactorRecord && twoFactorRecord.confirmed)
    throw new BadRequestError(BadRequestErrorKeys.TwoFactorAuthAlreadyConnected);

  await saveTwoFactorRecord(investorId, phoneNumber);

  const { isLimitUsed } = await getLimitInfo(investorId);
  if (isLimitUsed) throw new RateLimitError(RateLimitErrorKeys.SmsLimitIsUsed);

  await sendCodeToInvestor(investorId, phoneNumber);
};

export const confirmConnect2FA = async (investorId: number, code: string) => {
  const twoFactorRecord = await getTwoFactorRecordByInvestorId(investorId);
  if (!twoFactorRecord) throw new BadRequestError(BadRequestErrorKeys.TwoFactorRecordNotFound);

  if (twoFactorRecord && twoFactorRecord.confirmed)
    throw new BadRequestError(BadRequestErrorKeys.TwoFactorAuthAlreadyConnected);

  const isCodeValid = await codeValidating(twoFactorRecord.phoneNumber, code);

  if (!isCodeValid) {
    throw new BadRequestError(BadRequestErrorKeys.CodeIsNotValid);
  }

  await confirm2FARecord(investorId);
  return {
    phoneNumber: phoneHider(twoFactorRecord.phoneNumber),
  };
};

export const confirmLogin = async (investorId: number, code: string) => {
  const isCodeValid = await confirmingVerificationCode(investorId, code);
  if (isCodeValid) return generateEntryResponse(investorId, EntryFlowEnum.Login);

  throw new BadRequestError(BadRequestErrorKeys.CodeIsNotValid);
};

export const sendVerificationCode = async (investorId: number) => {
  const { isLimitUsed, isRetryLimitUsed } = await getLimitInfo(investorId);
  if (isLimitUsed) throw new RateLimitError(RateLimitErrorKeys.SmsLimitIsUsed);
  if (isRetryLimitUsed) throw new BadRequestError(BadRequestErrorKeys.RetrySendCodeLimit);

  const twoFactorRecord = await getTwoFactorRecordByInvestorId(investorId);
  if (!twoFactorRecord) throw new BadRequestError(BadRequestErrorKeys.TwoFactorRecordNotFound);

  await sendCodeToInvestor(investorId, twoFactorRecord.phoneNumber);
};

export const confirmingVerificationCode = async (investorId: number, code: string) => {
  const twoFactorRecord = await getTwoFactorRecordByInvestorId(investorId);
  if (!twoFactorRecord || !twoFactorRecord.confirmed)
    throw new BadRequestError(BadRequestErrorKeys.TwoFactorRecordNotFound);
  return await codeValidating(twoFactorRecord.phoneNumber, code);
};

export const confirmDisconnect2FA = async (investorId: number, code: string) => {
  const isCodeValid = await confirmingVerificationCode(investorId, code);
  if (isCodeValid) return await confirmDisconnect2FARecord(investorId);

  throw new BadRequestError(BadRequestErrorKeys.CodeIsNotValid);
};
