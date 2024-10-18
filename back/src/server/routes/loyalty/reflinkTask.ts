import { Router } from 'express';
import { getRepository } from 'typeorm';
import { completeLoyaltyTask } from '../../services/loyalty/task';
import { decryptRefLink } from '../../services/crypto';
import { Investor, LoyaltyTask } from '../../../db/entity';
import { getConfig } from '../../config';
import { ReferralLinkLoyaltyTaskBody } from '../../../db/types/interfaces/loyalty/tasks';

const config = getConfig();

export const reflinkLoyaltyTask = Router();

reflinkLoyaltyTask.get('/reflink/:code', async (req, res) => {
  try {
    const code = req.params.code;
    const language = req.header('language');
    let redirectLink = config.FRONTEND_DOMAIN;
    if (!code) res.redirect(redirectLink);

    const decodedData = decryptRefLink(code).split(':');

    if (decodedData.length < 3) return res.redirect(redirectLink);
    const loyaltyTaskId = Number(decodedData[0]);
    const investorId = decodedData[1];

    const investor = await getRepository(Investor).findOne({ where: { id: investorId } });
    if (!investor) return res.redirect(redirectLink);

    const success = await completeLoyaltyTask(investor.id, loyaltyTaskId, req.body, language);
    if (success.status) {
      const loyaltyTask = await getRepository(LoyaltyTask).findOneOrFail(loyaltyTaskId);
      const loyaltyTaskBody = loyaltyTask.body as ReferralLinkLoyaltyTaskBody;
      redirectLink = loyaltyTaskBody.redirectLink;
    }

    res.redirect(redirectLink);
  } catch (error) {
    res.redirect(config.FRONTEND_DOMAIN);
  }
});
