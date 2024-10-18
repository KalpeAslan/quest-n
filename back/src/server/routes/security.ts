import { Router } from 'express';
import { RequestLogger } from '../services/logger';
import { bodyValidator } from '../helpers';
import { verify2FAAccessToken } from '../services/entry/jwt';
import { ForbiddenError, ForbiddenErrorKeys } from '../errors';
import { confirmConnect2FA, confirmLogin, connect2FA, sendVerificationCode } from '../services/2fa';
import { Login2FADto } from '../../db/types/interfaces/2fa/LoginDto';
import { LoginConfirm2FADto } from '../../db/types/interfaces/2fa/LoginConfirmDto';
import { authMiddleware } from '../middlewares/authValidating';
import { Connect2FADto } from '../../db/types/interfaces/2fa/Connect2FADto';
import { Confirm2FADto } from '../../db/types/interfaces/2fa/ConfirmDto';
import { addExperience, subtractExperiencePoints } from '../services/experience';
import { deletingInvestorWith2FA } from '../services/investor';

const logger = new RequestLogger();
export const security = Router();

security.post('/security/2fa/connect', authMiddleware, async (req, res, next) => {
  try {
    const validatedConnect2FADtoData = await bodyValidator(Connect2FADto, req.body);
    await connect2FA(req['investorId'] as number, validatedConnect2FADtoData.phoneNumber);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});

security.post('/security/2fa/connect/confirm', authMiddleware, async (req, res, next) => {
  try {
    const validatedConfirm2FADtoData = await bodyValidator(Confirm2FADto, req.body);
    const result = await confirmConnect2FA(req['investorId'] as number, validatedConfirm2FADtoData.code);
    logger.info(req, { response: { result } });
    await addExperience(req['investorId'] as number, {
      experienceType: 'connect2fa',
    });
    res.send(result);
  } catch (err) {
    next(err);
  }
});

security.post('/security/2fa/disconnect', authMiddleware, async (req, res, next) => {
  try {
    await sendVerificationCode(req['investorId'] as number);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});

security.post('/security/2fa/disconnect/confirm', authMiddleware, async (req, res, next) => {
  try {
    await subtractExperiencePoints(req['investorId'] as number, '2fa');
    const validated2FADtoData = await bodyValidator(Confirm2FADto, req.body);
    await deletingInvestorWith2FA(req['investorId'] as number, validated2FADtoData.code);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});

security.post('/security/2fa/login', async (req, res, next) => {
  try {
    const validatedLogin2FADtoData = await bodyValidator(Login2FADto, req.body);
    const { investorId } = verify2FAAccessToken(validatedLogin2FADtoData.twoFactorAuthToken);
    if (!investorId) throw new ForbiddenError(ForbiddenErrorKeys.TokenIsNotValid);
    await sendVerificationCode(investorId);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

security.post('/security/2fa/login/confirm', async (req, res, next) => {
  try {
    const validatedConfirm2FADtoData = await bodyValidator(LoginConfirm2FADto, req.body);
    const { investorId } = verify2FAAccessToken(validatedConfirm2FADtoData.twoFactorAuthToken);
    if (!investorId) throw new ForbiddenError(ForbiddenErrorKeys.TokenIsNotValid);
    const result = await confirmLogin(investorId, validatedConfirm2FADtoData.code);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});
