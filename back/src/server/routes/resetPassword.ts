import express from 'express';
import { bodyValidator } from '../helpers';
import {
  confirmResetPasswordVerificationCode,
  resendResetPasswordVerificationCode,
  sendResetPasswordVerificationCode,
  resetPasswordService,
} from '../services/resetEmailPassword';
import {
  ResetPasswordVerificationResendDto,
  ResetPasswordVerificationSendDto,
  ResetPasswordVerificationConfirmDto,
  ResetPasswordDto,
} from '../../db/types/interfaces/entry/resetPasswordDto';
import { RequestLogger } from '../services/logger';
const logger = new RequestLogger();

export const resetPassword = express.Router();

resetPassword.post('/reset-password/verification-send', async (req, res, next) => {
  try {
    const validatedBody = await bodyValidator(ResetPasswordVerificationSendDto, req.body);
    const result = await sendResetPasswordVerificationCode(validatedBody);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (err) {
    next(err);
  }
});

resetPassword.post('/reset-password/verification-resend', async (req, res, next) => {
  try {
    const validatedBody = await bodyValidator(ResetPasswordVerificationResendDto, req.body);
    const result = await resendResetPasswordVerificationCode(validatedBody);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (err) {
    next(err);
  }
});

resetPassword.post('/reset-password/verification-confirm', async (req, res, next) => {
  try {
    const validatedBody = await bodyValidator(ResetPasswordVerificationConfirmDto, req.body);
    const result = await confirmResetPasswordVerificationCode(validatedBody);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (err) {
    next(err);
  }
});

resetPassword.post('/reset-password', async (req, res, next) => {
  try {
    const validatedBody = await bodyValidator(ResetPasswordDto, req.body);
    const result = await resetPasswordService(validatedBody);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (err) {
    next(err);
  }
});
