import {
  ConfirmTokenDto,
  PhoneEntryDto,
  PhoneRegistrationDto,
  PhoneVerificationDto,
} from '../../../db/types/interfaces/entry/phoneEntryDto';
import { phoneUserModel } from '../../../db/models/phoneUserModel';
import { BadRequestError, BadRequestErrorKeys, ForbiddenError, ForbiddenErrorKeys } from '../../errors';
import bcrypt from 'bcrypt';
import { Logger } from '../logger';
const log = new Logger();
import { generate2FAEntryResponse, generateEntryResponse, signPhoneToken, verifyPhoneToken } from './jwt';
import { twilioApiService } from '../apis/twilioApiService';
import { createInvestor } from '../investor';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';
import { phoneHider } from '../../helpers';
import { verifyReCaptcha } from '../recaptcha';
import { getConfig } from '../../config';
import { codeValidating } from '../2fa/2faValidating';

const { DISABLE_CAPTCHA } = getConfig();

export const registrationPhoneEntryService = async (phoneEntryDto: PhoneRegistrationDto) => {
  let phoneUser = await phoneUserModel.getByPhone(phoneEntryDto.phone);

  if (phoneUser && phoneUser.confirmed) {
    throw new BadRequestError(BadRequestErrorKeys.UserAlreadyExist);
  }

  if (!DISABLE_CAPTCHA && phoneEntryDto.reCaptchaToken && !(await verifyReCaptcha(phoneEntryDto.reCaptchaToken))) {
    throw new BadRequestError(BadRequestErrorKeys.ReCaptchaTokenInvalid);
  }

  if (!phoneUser) {
    const password = await bcrypt.hash(phoneEntryDto.password, 10);
    phoneUser = await phoneUserModel.create({
      phone: phoneEntryDto.phone,
      password,
    });
  }
  log.info(`created new account via phone number, phoneUserId: ${phoneUser.id}`);
  const phoneSingToken = signPhoneToken(phoneUser.id);
  log.info(`send verification code to phoneUserId: ${phoneUser.id}`);

  try {
    await twilioApiService.sendCode(phoneUser.phone);
    return {
      confirmToken: phoneSingToken,
      flow: 'create',
      phoneNumber: phoneHider(phoneUser.phone),
      investorId: phoneUser.investorId,
    };
  } catch (error) {
    log.error(`ERROR with sending verification code, phoneUserId: ${phoneUser.id}: ${error}`);
  }
};

export const verifyPhoneEntryService = async (phoneVerificationDto: PhoneVerificationDto) => {
  if (!phoneVerificationDto) {
    return { success: false };
  }

  const { phoneUserId } = verifyPhoneToken(phoneVerificationDto.confirmToken);
  const phoneUser = await phoneUserModel.getOneById(phoneUserId);

  if (phoneUser && !phoneUser.confirmed) {
    const verification = await codeValidating(phoneUser?.phone, phoneVerificationDto.code);
    if (!verification) {
      return { success: false };
    }

    const investor = await createInvestor();
    log.info(`create investor and referral profile  ${investor.id}`);

    phoneUser.confirmed = true;
    phoneUser.investor = investor;
    phoneUser.investorId = investor.id;
    await phoneUserModel.update(phoneUser);
    log.info(`created investor: ${phoneUser.investorId} for phoneUserId: ${phoneUserId}`);

    return generateEntryResponse(phoneUser.investorId, 'create' as EntryFlowEnum);
  }

  if (!phoneUser) {
    log.error(`phone user with id ${phoneUserId} not found`);
  }
  return { success: false };
};

export const loginPhoneEntryService = async (phoneEntryDto: PhoneEntryDto) => {
  const existedPhoneUser = await phoneUserModel.getByPhone(phoneEntryDto.phone);

  if (existedPhoneUser && existedPhoneUser.investor && existedPhoneUser.investorId) {
    const isPasswordMatch = await bcrypt.compare(phoneEntryDto.password, existedPhoneUser.password);
    if (isPasswordMatch && existedPhoneUser.investor.twoFactorAuth?.confirmed) {
      return generate2FAEntryResponse(
        existedPhoneUser.investorId,
        '',
        existedPhoneUser.investor.twoFactorAuth.phoneNumber,
      );
    }

    if (isPasswordMatch) {
      return generateEntryResponse(existedPhoneUser.investorId, EntryFlowEnum.Login);
    }
  }

  throw new ForbiddenError(ForbiddenErrorKeys.NotCorrectCredentials);
};

export const sendPhoneVerificationCode = async (confirmToken: ConfirmTokenDto) => {
  const { phoneUserId } = verifyPhoneToken(confirmToken.confirmToken);
  const phoneUser = await phoneUserModel.getOneById(phoneUserId);
  if (phoneUser && phoneUser.phone) {
    await twilioApiService.sendCode(phoneUser.phone);
    const confirmToken = signPhoneToken(phoneUserId);
    return {
      confirmToken,
      flow: 'create',
      phoneNumber: phoneHider(phoneUser.phone),
    };
  } else {
    throw new BadRequestError(BadRequestErrorKeys.CodeIsNotValid);
  }
};
