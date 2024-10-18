import { Router } from 'express';

import { parseAuthToken } from '../../helpers';
import { getConfig } from '../../config';
import {
  getLoyaltyProjects,
  getLoyaltyProject,
  generateInvestorInfo,
  getOnboardingQuestLinkTitle,
} from '../../services/loyalty/loyaltyProject';
import { getLoyaltyProjectsScoreboard, getWinnersOfProject } from '../../services/loyalty/loyaltyProjectScoreboard';
import { getFilterOptions } from '../../helpers/routerHelpers';
import { RequestLogger } from '../../services/logger';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { authMiddleware } from '../../middlewares/authValidating';
import { dtoValidationMiddleware } from '../../middlewares/dtoValidating';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { ClaimConfirmDto, ClaimDto } from '../../../db/types/interfaces/loyalty/LoyaltyProjectDto';
import { claimReward, confirmRewardClaiming } from '../../services/loyalty/loyaltyProjectClaim';
import { claimAQTokens } from '../../services/loyalty/claimAqTokens';

const logger = new RequestLogger();
export const loyaltyProject = Router();

const { APP_SECRET } = getConfig();

loyaltyProject.get('/loyalty-projects', async (req, res, next) => {
  try {
    const { investorId } = parseAuthToken(req.headers.authorization, APP_SECRET) as { investorId: number | undefined };

    const filterOptions = getFilterOptions(req.query);
    const loyaltyProjects = await getLoyaltyProjects(investorId, filterOptions);
    logger.info(req, { response: { loyaltyProjects } });
    res.send(loyaltyProjects);
  } catch (err) {
    next(err);
  }
});

loyaltyProject.get('/loyalty-project/:link', async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;
    if (!projectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no link');
    const language = req.header('language');

    const { investorId } = parseAuthToken(req.headers.authorization, APP_SECRET) as { investorId: number | undefined };
    const loyaltyProject = await getLoyaltyProject(projectLinkTitle, investorId, language);
    logger.info(req, { response: { loyaltyProject } });
    res.send(loyaltyProject);
  } catch (err) {
    next(err);
  }
});

loyaltyProject.get('/loyalty-project/:link/investor', async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;
    if (!projectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no link');

    const { investorId } = parseAuthToken(req.headers.authorization, APP_SECRET) as { investorId: number | undefined };
    const loyaltyProject = await generateInvestorInfo(projectLinkTitle, investorId);
    logger.info(req, { response: { loyaltyProject } });
    res.send(loyaltyProject);
  } catch (err) {
    next(err);
  }
});

loyaltyProject.get('/loyalty-project/:link/scoreboard', async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;
    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };

    if (!projectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no link');

    const { investorId } = parseAuthToken(req.headers.authorization, APP_SECRET) as { investorId: number | undefined };
    const loyaltyProjectsScoreboard = await getLoyaltyProjectsScoreboard(
      projectLinkTitle,
      investorId,
      page || 1,
      pageSize || 25,
    );
    logger.info(req, { response: { loyaltyProjectsScoreboard } });
    res.send(loyaltyProjectsScoreboard);
  } catch (err) {
    next(err);
  }
});

loyaltyProject.get('/loyalty-project/:link/winners', async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;

    if (!projectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no link');

    const winners = await getWinnersOfProject(projectLinkTitle);
    logger.info(req, { response: { winners } });
    res.send(winners);
  } catch (e) {
    next(e);
  }
});

loyaltyProject.post(
  '/loyalty-project/:link/claim',
  authMiddleware,
  dtoValidationMiddleware(ClaimDto),
  async (req, res, next) => {
    try {
      const projectLinkTitle = req.params.link;
      if (!projectLinkTitle) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'No link title');

      const result = await claimReward(projectLinkTitle, req['investorId'], req.body.rewardId);

      logger.info(req, {
        response: { data: result ? { ...result, treasurySignature_: '*******' } : null, success: Boolean(result) },
      });
      res.send({ data: result, success: Boolean(result) });
    } catch (err) {
      next(err);
    }
  },

  loyaltyProject.post(
    '/loyalty-project/:link/claim/confirm',
    authMiddleware,
    dtoValidationMiddleware(ClaimConfirmDto),
    async (req, res, next) => {
      try {
        const projectLinkTitle = req.params.link;
        if (!projectLinkTitle) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'No link title');

        const result = await confirmRewardClaiming(projectLinkTitle, req['investorId'], req.body as ClaimConfirmDto);

        logger.info(req, {
          response: result,
        });
        res.send(result);
      } catch (error) {
        next(error);
      }
    },
  ),
);

loyaltyProject.post('/loyalty-project/:link/claim/aq', async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;
    if (!projectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no link');

    const { investorId } = parseAuthToken(req.headers.authorization, APP_SECRET) as { investorId: number | undefined };
    if (!investorId) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no investor');

    const claimed = await claimAQTokens(projectLinkTitle, investorId);
    logger.info(req, { response: { success: claimed } });
    res.send({ success: claimed });
  } catch (err) {
    next(err);
  }
});

loyaltyProject.get('/loyalty-projects/onboarding-link', async (req, res, next) => {
  try {
    const result = await getOnboardingQuestLinkTitle();

    logger.info(req, { response: result });
    res.send(result);
  } catch (error) {
    next(error);
  }
});
