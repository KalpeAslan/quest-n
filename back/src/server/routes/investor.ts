import { Router } from 'express';
import { bodyValidator } from '../helpers';
import { authMiddleware } from '../middlewares/authValidating';
import { sendVerificationCode } from '../services/2fa';
import {
  claimReferralProfit,
  deleteInvestor,
  deletingInvestorWith2FA,
  getInvestorAnalyticsInfo,
  getInvestorProfileInfo,
  updateInvestor,
} from '../services/investor';
import { Confirm2FADto } from '../../db/types/interfaces/2fa/ConfirmDto';
import { DeleteInvestorDto, UpdateInvestorDto } from '../../db/types/interfaces/InvestorDto';
import { getReferralStats } from '../services/referralProfile';
import { getInvestorPartnerProjects } from '../services/loyalty/partnerProject';
import { subtractExperiencePoints } from '../services/experience';
import { RequestLogger } from '../services/logger';
import { subtractInviteTaskPoints } from '../services/loyalty/task/loyaltyTask';
import { userNameValidating } from '../middlewares/usernameValidating';
const logger = new RequestLogger();

export const investor = Router();

investor.get('/investor/analytics', authMiddleware, async (req, res, next) => {
  try {
    const result = await getInvestorAnalyticsInfo(req['investorId']);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

investor.get('/investor/profile', authMiddleware, async (req, res, next) => {
  try {
    const result = await getInvestorProfileInfo(req['investorId']);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

investor.get('/investor/referral', authMiddleware, async (req, res, next) => {
  try {
    const result = await getReferralStats(req['investorId']);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

investor.post('/investor/referral/claim', authMiddleware, async (req, res, next) => {
  try {
    const response = await claimReferralProfit(req['investorId']);
    logger.info(req, { response });
    res.send(response);
  } catch (err) {
    next(err);
  }
});

investor.get('/investor/partner-projects', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const result = await getInvestorPartnerProjects(investorId);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

investor.delete('/investor', authMiddleware, async (req, res, next) => {
  try {
    await subtractExperiencePoints(req['investorId'], 'deleteAccount');
    await subtractInviteTaskPoints(req['investorId'], 'allTypes');
    const validatedInvestorDtoData = await bodyValidator(DeleteInvestorDto, req.body);
    await deleteInvestor(req['investorId'], validatedInvestorDtoData.deleteToken);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

investor.put('/investor', authMiddleware, userNameValidating, async (req, res, next) => {
  try {
    const validatedInvestorDtoData = await bodyValidator(UpdateInvestorDto, req.body);

    await updateInvestor(req['investorId'], validatedInvestorDtoData);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

investor.post('/investor/2fa/removing-code', authMiddleware, async (req, res, next) => {
  try {
    await sendVerificationCode(req['investorId'] as number);
    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

investor.post('/investor/2fa/removing-confirm', authMiddleware, async (req, res, next) => {
  try {
    const validatedInvestorDtoData = await bodyValidator(Confirm2FADto, req.body);
    const response = await deletingInvestorWith2FA(req['investorId'] as number, validatedInvestorDtoData.code);
    logger.info(req, { response });
    res.send(response);
  } catch (error) {
    next(error);
  }
});
