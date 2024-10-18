import { Router } from 'express';

import { bodyValidator } from '../helpers';
import { authMiddleware } from '../middlewares/authValidating';
import { AddReferralDto } from '../../db/types/interfaces/ReferralDto';
import { becomeReferral, getInvestorIdByCode, getReferralProfile } from '../services/referralProfile';
import { RequestLogger } from '../services/logger';
import { investorModel, loyaltyProjectModel, taskProgressModel } from '../../db/models';
import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';
import { InviteTaskBody } from '../../db/types/interfaces/loyalty/tasks';
import { BadRequestError, BadRequestErrorKeys } from '../errors';
import { getConfig } from '../config';
import { addExperience } from '../services/experience';

const config = getConfig();
const logger = new RequestLogger();
export const referral = Router();

referral.post('/referral', authMiddleware, async (req, res, next) => {
  try {
    const validatedAddReferralDtoData = await bodyValidator(AddReferralDto, req.body);

    await becomeReferral(validatedAddReferralDtoData.code, req['investorId']);
    const referrerInvestorId = await getInvestorIdByCode(validatedAddReferralDtoData.code);
    logger.info(req, { response: { success: true } });

    addExperience(referrerInvestorId, { experienceType: 'inviteReferral' });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

referral.post('/questReferral', authMiddleware, async (req, res, next) => {
  try {
    const investor = await investorModel.getByInvestorId(req['investorId']);
    const recentDate = new Date();
    recentDate.setMinutes(recentDate.getMinutes() - 30);

    if (investor && investor.createdAt < recentDate) {
      throw Error('You are trying to set user created more than 1 hour ago as an invite referral');
    }

    if (!investor) {
      throw new NotFoundError(NotFoundErrorKeys.NotFound, 'investor not does not exist');
    }

    const validatedAddReferralDtoData = await bodyValidator(AddReferralDto, req.body);

    const taskProgress = await taskProgressModel.getByInviteCode(validatedAddReferralDtoData.code);
    if (!taskProgress) {
      throw new NotFoundError(
        NotFoundErrorKeys.NotFound,
        `taskProgress with code: ${validatedAddReferralDtoData.code} not does not exist`,
      );
    }

    const json = taskProgress.json as InviteTaskBody;
    if (json.invitedInvestorIds.length >= config.INVITE_TASK_LIMIT) {
      throw new BadRequestError(BadRequestErrorKeys.RedundantInvite, `Only 25 users can be invited with invite task`);
    }

    const inviterTaskProgress = await taskProgressModel.addInvitedInvestor(
      validatedAddReferralDtoData.code,
      req['investorId'],
    );

    if (!inviterTaskProgress) {
      throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Invite task does not exist');
    }

    const referralProfile = await getReferralProfile(inviterTaskProgress.investorId);
    logger.info(req, { inviterTaskProgress, referralProfile, investorId: req['investorId'] });
    await becomeReferral(referralProfile.referralCode, req['investorId']);

    const quest = await loyaltyProjectModel.getById(inviterTaskProgress.loyaltyProjectId);
    logger.info(req, { response: { success: true, response: { questLinkTitle: quest?.linkTitle } } });
    res.send({ success: true, response: { questLinkTitle: quest?.linkTitle } });
  } catch (error) {
    next(error);
  }
});

referral.get('/questReferral', async (req, res, next) => {
  try {
    const { code } = req.query as any;
    const inviterTaskProgress = await taskProgressModel.getByInviteCode(code);

    if (!inviterTaskProgress) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Invite task does not exist');

    logger.info(req, { inviterTaskProgress });

    const quest = await loyaltyProjectModel.getById(inviterTaskProgress.loyaltyProjectId);
    logger.info(req, { response: { success: true, response: { questLinkTitle: quest?.linkTitle } } });
    res.send({ success: true, response: { questLinkTitle: quest?.linkTitle } });
  } catch (error) {
    next(error);
  }
});
