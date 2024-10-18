import { emailUserModel } from '../../db/models/emailUserModel';
import { phoneUserModel } from '../../db/models/phoneUserModel';
import * as bcrypt from 'bcrypt';
import { BadRequestError, BadRequestErrorKeys } from '../errors';
import { twilioApiService } from './apis/twilioApiService';
import { phoneHider } from '../helpers/phoneHider';
import {
  ResetPasswordVerificationConfirmDto,
  ResetPasswordVerificationResendDto,
  ResetPasswordVerificationSendDto,
  ResetPasswordDto,
} from '../../db/types/interfaces/entry/resetPasswordDto';
import { generateEntryResponse, signResetPasswordToken, verifyResetPasswordToken } from './entry/jwt';
import { EntryFlowEnum } from '../../db/types/interfaces/interface-index';
import { investor } from '../routes/investor';

export const sendResetPasswordVerificationCode = async (data: ResetPasswordVerificationSendDto) => {
  if ((data.type === 'phone' && data.email) || (data.type === 'email' && data.phone)) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }

  if (data.type === 'phone' && data.phone) {
    const phoneUser = await phoneUserModel.getByPhone(data.phone);

    if (!phoneUser) {
      throw new BadRequestError(BadRequestErrorKeys.UserDoesNotExist);
    }

    await twilioApiService.sendCode(phoneUser.phone);

    return {
      confirmToken: signResetPasswordToken(phoneUser.id, data.type),
      flow: 'reset',
      phone: phoneHider(data.phone),
      type: 'phone',
    };
  } else if (data.type === 'email' && data.email) {
    const emailUser = await emailUserModel.getByEmail(data.email);
    if (!emailUser) {
      throw new BadRequestError(BadRequestErrorKeys.UserDoesNotExist);
    }

    await twilioApiService.sendCodeToEmail(emailUser.email);

    return {
      confirmToken: signResetPasswordToken(emailUser.id, data.type),
      flow: 'reset',
      email: data.email,
      type: 'email',
    };
  }
};

export const resendResetPasswordVerificationCode = async (data: ResetPasswordVerificationResendDto) => {
  const { userId, type } = verifyResetPasswordToken(data.confirmToken);

  if (type != data.type) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }

  if (data.type === 'phone') {
    const phoneUser = await phoneUserModel.getOneById(userId);
    if (!phoneUser) {
      throw new BadRequestError(BadRequestErrorKeys.UserDoesNotExist);
    }

    await twilioApiService.sendCode(phoneUser.phone);
    const creds = generateEntryResponse(phoneUser.investorId as number, EntryFlowEnum.Login);

    return {
      ...creds,
      confirmToken: signResetPasswordToken(phoneUser.id, data.type),
      flow: 'reset',
      phone: phoneHider(phoneUser.phone),
      type: 'phone',
    };
  } else if (data.type === 'email') {
    const emailUser = await emailUserModel.getOneById(userId);
    if (!emailUser) {
      throw new BadRequestError(BadRequestErrorKeys.UserDoesNotExist);
    }

    await twilioApiService.sendCodeToEmail(emailUser.email);

    return {
      confirmToken: signResetPasswordToken(emailUser.id, data.type),
      flow: 'reset',
      email: emailUser.email,
      type: 'email',
    };
  }
};

export const confirmResetPasswordVerificationCode = async (data: ResetPasswordVerificationConfirmDto) => {
  const { userId, type } = verifyResetPasswordToken(data.confirmToken);

  if (type != data.type) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }

  if (type === 'phone') {
    const phoneUser = await phoneUserModel.getOneById(userId);

    if (!phoneUser || !phoneUser.phone) {
      throw new BadRequestError(BadRequestErrorKeys.UserAlreadyExist);
    }

    const result = await twilioApiService.fetchVerified(phoneUser.phone, data.code);
    if (result.valid && result.status === 'approved') {
      return {
        resetToken: signResetPasswordToken(phoneUser.id, 'phone'),
        flow: 'reset',
        type: 'phone',
      };
    } else {
      throw new BadRequestError(BadRequestErrorKeys.CodeIsNotValid);
    }
  } else if (type === 'email') {
    const emailUser = await emailUserModel.getOneById(userId);

    if (!emailUser || !emailUser.email) {
      throw new BadRequestError(BadRequestErrorKeys.UserAlreadyExist);
    }

    const result = await twilioApiService.fetchVerified(emailUser.email, data.code);
    if (result.valid && result.status === 'approved') {
      return {
        resetToken: signResetPasswordToken(emailUser.id, 'email'),
        flow: 'reset',
        type: 'email',
      };
    } else {
      throw new BadRequestError(BadRequestErrorKeys.CodeIsNotValid);
    }
  }
};

export const resetPasswordService = async (data: ResetPasswordDto) => {
  if (data.resetToken.length === 0) {
    throw new BadRequestError(BadRequestErrorKeys.PasswordCanNotBeEmpty);
  }

  const { userId, type } = verifyResetPasswordToken(data.resetToken);

  if (type != data.type) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }

  const password = await bcrypt.hash(data.newPassword, 10);
  if (type === 'phone') {
    const investor = await phoneUserModel.setPassword(userId, password);
    const creds = generateEntryResponse(investor.investorId as number, EntryFlowEnum.Login);
    return {
      ...creds,
      success: true,
    };
  } else if (type === 'email') {
    const investor = await emailUserModel.setPassword(userId, password);
    const creds = generateEntryResponse(investor.investorId as number, EntryFlowEnum.Login);
    return {
      ...creds,
      success: true,
    };
  }
};
