import express from 'express';
import { bodyValidator } from '../helpers';
import {
  entryLogin,
  entrySignUp,
  entryRefreshToken,
  registerByInviteToPartnerProject,
  loginByInviteToPartnerProject,
} from '../services/entry';
import { EntryTypesEnum } from '../../db/types/interfaces/entry';
import { RefreshEntryDto } from '../../db/types/interfaces/entry/refreshDto';
import { RequestLogger } from '../services/logger';
import { BadRequestError, BadRequestErrorKeys } from '../errors';
import { EntryFlowEnum } from '../../db/types/interfaces/interface-index';
import { entryValidator, getUpperCaseEntryType } from '../helpers/entryValidator';
import { addExperience, subtractExperiencePoints } from '../services/experience';
import { ExperienceTaskType } from '../../db/types/interfaces/ExperienceDto';
const logger = new RequestLogger();

import {
  authChangePassword,
  authVerifyCode,
  authVerifyCodeResend,
  bodyValidatorAuth,
  bodyValidatorVerifyCode,
  confirmAuth,
  disconnectAuth,
  сonnectAuth,
} from '../services/auth';
import { authMiddleware } from '../middlewares/authValidating';
import { subtractInviteTaskPoints } from '../services/loyalty/task/loyaltyTask';
import { NotificationsServerService } from '../services/notifications.service';
import { dtoValidationMiddleware } from '../middlewares/dtoValidating';
import { ChangePasswordDto } from '../../db/types/interfaces/entry/changePasswordDto';

export const auth = express.Router();

// auth connection flow
auth.get('/auth/:entryType/connect', async (req, res, next) => {
  try {
    const authObject = await сonnectAuth(req.params.entryType as EntryTypesEnum);
    logger.info(req, { response: { authObject } });
    res.send(authObject);
  } catch (err) {
    next(err);
  }
});

auth.post('/auth/:entryType/confirm', authMiddleware, async (req, res, next) => {
  try {
    const body = await bodyValidatorAuth(req.params.entryType as EntryTypesEnum, req.body);
    const results = await confirmAuth(req.params.entryType as EntryTypesEnum, body, req['investorId'] as number);

    logger.info(req, { response: { results } });

    if (results && req.params.entryType == EntryTypesEnum.Twitter) {
      await addExperience(req['investorId'] as number, { experienceType: 'connectTwitter' });
    } else if (results && req.params.entryType == EntryTypesEnum.Google) {
      await addExperience(req['investorId'] as number, { experienceType: 'connectGoogle' });
    } else if (results && req.params.entryType == EntryTypesEnum.Wallet) {
      await addExperience(req['investorId'] as number, { experienceType: 'connectWallet' });
    }

    res.send(results);
  } catch (err) {
    next(err);
  }
});

auth.post('/auth/:entryType/disconnect', authMiddleware, async (req, res, next) => {
  try {
    if (req.params.entryType == EntryTypesEnum.Google) {
      await subtractExperiencePoints(req['investorId'] as number, 'google');
    } else if (req.params.entryType == EntryTypesEnum.Twitter) {
      await subtractExperiencePoints(req['investorId'] as number, 'twitter');
      await subtractInviteTaskPoints(req['investorId'] as number, 'twitter');
    } else if (req.params.entryType == EntryTypesEnum.Wallet) {
      await subtractExperiencePoints(req['investorId'] as number, 'wallet');
      await subtractInviteTaskPoints(req['investorId'] as number, 'wallet');
    }

    await disconnectAuth(req.params.entryType as EntryTypesEnum, req['investorId']);

    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (err) {
    next(err);
  }
});

auth.post(
  '/auth/:entryType/change-password',
  authMiddleware,
  dtoValidationMiddleware(ChangePasswordDto),
  async (req, res, next) => {
    try {
      await authChangePassword(req.params.entryType as EntryTypesEnum, req.body, req['investorId']);

      logger.info(req, { response: { success: true } });
      res.send({ success: true });
    } catch (error) {
      next(error);
    }
  },
);

// registration flow
auth.post('/auth/register/:entryType', async (req, res, next) => {
  try {
    if (
      !req.params.entryType ||
      !Object.values(EntryTypesEnum).includes(req.params.entryType as unknown as EntryTypesEnum)
    ) {
      throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
    }

    const validatedBody = await entryValidator(req.params.entryType as EntryTypesEnum, req.body, EntryFlowEnum.Create);
    const result = await entrySignUp(req.params.entryType as EntryTypesEnum, validatedBody);
    logger.info(req, { response: { result } });

    if (result && result.flow === 'create' && result.investorId) {
      const upperCaseEntryType = getUpperCaseEntryType(req.params.entryType as EntryTypesEnum);
      const experienceTaskType: ExperienceTaskType = `registerWith${upperCaseEntryType}`;
      addExperience(result.investorId, { experienceType: experienceTaskType });
      await NotificationsServerService.addOnBoardingNotification(result.investorId);
      await NotificationsServerService.addExperienceNotification(result.investorId);
    } else if (result && result.investorId) {
      addExperience(result.investorId, { experienceType: 'dailyLogin' });
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
});

// login flow
auth.post('/auth/login/:entryType', async (req, res, next) => {
  try {
    if (
      !req.params.entryType ||
      !Object.values(EntryTypesEnum).includes(req.params.entryType as unknown as EntryTypesEnum)
    ) {
      throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
    }

    const validatedBody = await entryValidator(req.params.entryType as EntryTypesEnum, req.body, EntryFlowEnum.Login);

    const result = await entryLogin(req.params.entryType as EntryTypesEnum, validatedBody);
    logger.info(req, { response: { result } });

    if (result.flow === 'create' && result.investorId) {
      const upperCaseEntryType = getUpperCaseEntryType(req.params.entryType as EntryTypesEnum);
      const experienceTaskType: ExperienceTaskType = `registerWith${upperCaseEntryType}`;
      addExperience(result.investorId, { experienceType: experienceTaskType });
      await NotificationsServerService.addOnBoardingNotification(result.investorId);
      await NotificationsServerService.addExperienceNotification(result.investorId);
    } else {
      addExperience(result.investorId, { experienceType: 'dailyLogin' });
    }
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// refresh token flow
auth.post('/auth/refresh-token', async (req, res, next) => {
  try {
    const validatedConfirm2FADtoData = await bodyValidator(RefreshEntryDto, req.body);

    const result = await entryRefreshToken(validatedConfirm2FADtoData);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// verification flow
auth.post('/auth/register/:entryType/confirm', async (req, res, next) => {
  try {
    const validatedBody = await bodyValidatorVerifyCode(req.params.entryType as EntryTypesEnum.Email, req.body);
    const result = await authVerifyCode(req.params.entryType as EntryTypesEnum.Email, validatedBody);

    if (req.params.entryType == EntryTypesEnum.Phone) {
      if (result && 'investorId' in result && result.investorId) {
        await addExperience(result.investorId, {
          experienceType: 'registerWithPhone',
        });
      }
    } else if (req.params.entryType == EntryTypesEnum.Email) {
      if (result && 'investorId' in result && result.investorId) {
        await addExperience(result.investorId, {
          experienceType: 'registerWithEmail',
        });
      }
    }

    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

auth.post('/auth/register/:entryType/retry', async (req, res, next) => {
  try {
    const result = await authVerifyCodeResend(req.params.entryType as EntryTypesEnum, req.body);
    logger.info(req, { response: { result } });
    res.send(result);
  } catch (error) {
    next(error);
  }
});

// Register by Invite to Partner Project

auth.post('/auth/partnerProject/register', async (req, res, next) => {
  try {
    const result = await registerByInviteToPartnerProject(req.body);

    res.send(result);
  } catch (error) {
    console.log('registerByInviteToPartnerProject', error);
    next(error);
  }
});

auth.post('/auth/partnerProject/login', async (req, res, next) => {
  try {
    const result = await loginByInviteToPartnerProject(req.body);

    res.send(result);
  } catch (error) {
    console.log('loginByInviteToPartnerProject', error);
    next(error);
  }
});
