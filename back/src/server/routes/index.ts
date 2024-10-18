import * as express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { errorRequestHandler } from './errorHandler';
import { email } from './email';
import { abiFunctions } from './abi';
import { getRepository } from 'typeorm';
import { ShortLink } from '../../db/entity';
import { partners } from './partner';
import { loyaltyEvent } from './loyaltyEvent';
import { auth } from './auth';
import { loyaltyTasks } from './loyalty/tasks';
import { reflinkLoyaltyTask } from './loyalty/reflinkTask';
import { loyaltyProject } from './loyalty/loyaltyProjects';
import { referral } from './referral';
import { investor } from './investor';
import { resetPassword } from './resetPassword';
import { partnerProject } from './loyalty/partnerProjects';
import { token } from './token';
import { twitter } from './twitter';
import { quest as questAdminPanel } from './admin/quest';
import { task } from './admin/task';
import { project as loyaltyPartnerProject } from './admin/project';
import { RequestLogger } from '../services/logger';
import { v4 as uuidv4 } from 'uuid';
import { createNamespace } from 'cls-hooked';
import { verifyAccessToken } from '../services/entry/jwt';
import { isExcludedToValidateRoutePath } from '../services/serverRouter.service';
import { games } from './games';
import { BadRequestError, BadRequestErrorKeys } from '../errors';
import { advertisement } from './advertisement';
import { contract } from './contract';
import { reward } from './admin/reward';
import { ambassadorRouter } from './ambassador';
import { notifications } from './notifications.controller';
import { security } from './security';
import { profile } from './profile';
import { socials } from './socials';
import { experience } from './experience';
import { analytics } from './analytics';
import { internalAdmin } from './admin/internal';
import { constants } from '../config/constants';

const session = createNamespace('cls-session');

const logger = new RequestLogger();

export const router = express.Router();

router.use(cors({ origin: '*' }));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(
  bodyParser.json({
    limit: `${constants.maxImageSizeUploadTaskInMB}MB`,
  }),
);

router.use((req, _res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token && !isExcludedToValidateRoutePath(req.path)) {
      const { investorId } = verifyAccessToken(token);
      req['investorId'] = investorId;
    }
    session.run(() => {
      const logTraceId = uuidv4();
      session.set('logTraceId', logTraceId);
      logger.info(req, { logTraceId });
      next();
    });
  } catch (err) {
    next(err);
  }
});

router.get('/healthcheck', async (req, res) => {
  return res.send({ success: true });
});

const api = express.Router();

router.get('/:redirect', async (req, res, next) => {
  try {
    const shortName = req.params.redirect;

    if (!shortName) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'no short param');

    const shortLink = await getRepository(ShortLink).findOne({ where: { shortLink: shortName } });

    if (shortLink) {
      return res.send({ redirectUrl: shortLink.source });
    } else {
      return res.status(404).send(`Cannot GET /${shortName}`);
    }
  } catch (err) {
    next(err);
  }
});

router.use('/api', api);
router.use('/', reflinkLoyaltyTask);

api.use(experience);
api.use(profile);
api.use(security);
api.use(socials);
api.use(reward);
api.use(contract);
api.use(investor);
api.use(partners);
api.use(email);
api.use(abiFunctions);
api.use(loyaltyEvent);
api.use(loyaltyTasks);
api.use(loyaltyProject);
api.use(partnerProject);
api.use(referral);
api.use(auth);
api.use(resetPassword);
api.use(token);
api.use(twitter);
api.use(loyaltyPartnerProject);
api.use(questAdminPanel);
api.use(task);
api.use(games);
api.use(advertisement);
api.use(ambassadorRouter);
api.use(notifications);
api.use(analytics);
api.use(internalAdmin);
router.use(errorRequestHandler);
