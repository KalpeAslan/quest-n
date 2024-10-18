import { sign, verify } from 'jsonwebtoken';

import { getConfig } from '../../config';
import { constants } from '../../config/constants';
import { phoneEndHider } from '../../helpers';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';
import { investorModel } from '../../../db/models';

const { APP_SECRET } = getConfig();

export const generateEntryResponse = (investorId: number, flow: EntryFlowEnum, entryUsername?: string) => {
  investorModel.updateLastActivity(investorId);
  return {
    accessToken: sign({ investorId }, APP_SECRET, { expiresIn: constants.jwt.accessExpiresIn }),
    refreshToken: sign({ investorId }, APP_SECRET + 'refresh', { expiresIn: constants.jwt.refreshExpiresIn }),
    flow,
    entryUsername,
    investorId,
  };
};

export const generate2FAEntryResponse = (investorId: number, entryUsername: string, phoneNumber: string) => {
  return {
    twoFactorAuthToken: sign({ investorId }, APP_SECRET + '2fa', { expiresIn: constants.jwt.accessExpiresIn }),
    entryUsername,
    twoFactorAuth: true,
    flow: EntryFlowEnum.Login,
    phoneNumber: phoneEndHider(phoneNumber),
    investorId,
  };
};

export const generateAccessTokenResponse = (investorId: number) => {
  return {
    accessToken: sign({ investorId }, APP_SECRET, { expiresIn: constants.jwt.accessExpiresIn }),
  };
};

export const verifyRefreshToken = (refreshToken: string) => {
  return verify(refreshToken, APP_SECRET + 'refresh') as { investorId: number };
};

export const verify2FAAccessToken = (accessToken: string) => {
  return verify(accessToken, APP_SECRET + '2fa') as { investorId: number };
};

export const verifyAccessToken = (accessToken: string, secretKey?: string) => {
  return verify(accessToken, secretKey || APP_SECRET) as { investorId: number };
};

export const signEmailToken = (emailUserId: number) => {
  return sign({ emailUserId }, APP_SECRET + 'email', { expiresIn: constants.jwt.accessExpiresIn });
};
export const verifyEmailToken = (emailToken: string) => {
  return verify(emailToken, APP_SECRET + 'email') as { emailUserId: number };
};

//TODO: may be refactored here, get rid of unnecessary token generation methods
export const signPhoneToken = (phoneUserId: number) => {
  return sign({ phoneUserId }, APP_SECRET + 'email', { expiresIn: constants.jwt.accessExpiresIn });
};
export const verifyPhoneToken = (phoneToken: string) => {
  return verify(phoneToken, APP_SECRET + 'email') as { phoneUserId: number };
};

export const signResetPasswordToken = (userId: number, type: 'phone' | 'email') => {
  return sign({ userId, type }, APP_SECRET + 'resetPassword', { expiresIn: constants.jwt.accessExpiresIn });
};
export const verifyResetPasswordToken = (token: string) => {
  return verify(token, APP_SECRET + 'resetPassword') as { userId: number; type: 'phone' | 'email' };
};
