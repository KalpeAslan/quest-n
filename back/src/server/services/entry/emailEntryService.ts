import * as bcrypt from 'bcrypt';
import { emailUserModel } from '../../../db/models/emailUserModel';
import { BadRequestError, BadRequestErrorKeys, ForbiddenError, ForbiddenErrorKeys } from '../../errors';
import { Logger } from '../logger';
import { sendGridApiService } from '../apis/sendGridApiService';
import { getConfig } from '../../config';
import {
  EmailEntryDto,
  EmailRegistrationDto,
  EmailVerificationDto,
} from '../../../db/types/interfaces/entry/emailEntryDto';
import { createInvestor } from '../investor';
import { signEmailToken, verifyEmailToken } from './jwt';
import { generate2FAEntryResponse, generateEntryResponse } from './jwt';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';
import { googleUserModel } from '../../../db/models/googleUserModel';
import { validateReferralCode } from '../referralProfile';
import { taskProgressModel } from '../../../db/models';
import { verifyReCaptcha } from '../recaptcha';
import { addInvestorToInviteByEmail } from '../loyalty/partnerProject';
import { getUpperCaseEntryType } from '../../helpers/entryValidator';
import { EntryTypesEnum } from '../../../db/types/interfaces/entry';
import { ExperienceTaskType } from '../../../db/types/interfaces/ExperienceDto';
import { addExperience } from '../experience';
import { NotificationsServerService } from '../notifications.service';
const logger = new Logger();

const { FRONTEND_DOMAIN, DISABLE_CAPTCHA } = getConfig();

const log = new Logger();

export const registrationEmailEntryService = async (emailEntryDto: EmailRegistrationDto) => {
  let emailUser = await emailUserModel.getByEmail(emailEntryDto.email);

  if (emailUser && emailUser.confirmed) {
    throw new BadRequestError(BadRequestErrorKeys.UserAlreadyExist);
  }

  if (!DISABLE_CAPTCHA && emailEntryDto.reCaptchaToken && !(await verifyReCaptcha(emailEntryDto.reCaptchaToken))) {
    throw new BadRequestError(BadRequestErrorKeys.ReCaptchaTokenInvalid);
  }

  // if (googleUser) {
  //   throw new BadRequestError(BadRequestErrorKeys.UserAlreadyExist);
  // }
  if (!emailUser) {
    const password = await bcrypt.hash(emailEntryDto.password, 10);
    emailUser = await emailUserModel.create({
      email: emailEntryDto.email,
      password,
    });
  }

  log.info(`create new account via email, emailUserId: ${emailUser.id}`);

  const isValidReferralCode = await validateReferralCode(emailEntryDto.referralCode);
  const isValidInviteCode = await taskProgressModel.getByInviteCode(emailEntryDto.referralCode);

  if (emailEntryDto.referralCode && !isValidReferralCode && !isValidInviteCode) {
    logger.warn(`Wrong referral code ${emailEntryDto}`);
  }

  const emailSignToken = signEmailToken(emailUser.id);
  log.info(`send verification email to investor: ${emailUser.id}`);
  try {
    await sendGridApiService.sendToken(
      emailEntryDto.email,
      emailSignToken,
      FRONTEND_DOMAIN,
      emailEntryDto.referralCode,
      emailEntryDto.redirect,
      isValidReferralCode,
    );
    return {
      flow: 'create',
      email: emailEntryDto.email,
      investorId: emailUser.investorId,
    };
  } catch (error) {
    log.error(`ERROR with sending verification email, investor: ${emailUser.id}: ${error}`);
  }
};

export const loginEmailEntryService = async (emailEntryDto: EmailEntryDto) => {
  const existedEmailUser = await emailUserModel.getByEmail(emailEntryDto.email);

  if (existedEmailUser && existedEmailUser.investor && existedEmailUser.investorId) {
    const isPasswordMatch = await bcrypt.compare(emailEntryDto.password, existedEmailUser.password);
    if (isPasswordMatch && existedEmailUser.investor.twoFactorAuth?.confirmed) {
      return generate2FAEntryResponse(
        existedEmailUser.investorId,
        '', // TODO: username not exist, refactor generate function
        existedEmailUser.investor.twoFactorAuth.phoneNumber,
      );
    }

    if (isPasswordMatch) {
      return generateEntryResponse(existedEmailUser.investorId, EntryFlowEnum.Login);
    }
  }

  throw new ForbiddenError(ForbiddenErrorKeys.NotCorrectCredentials);
};

export const registrationEmailConfirmEntryService = async (emailVerificationDto: EmailVerificationDto) => {
  if (!emailVerificationDto.emailToken) return { success: false };
  const { emailUserId } = verifyEmailToken(emailVerificationDto.emailToken);

  const emailUser = await emailUserModel.getOneById(emailUserId);

  if (!emailUser) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, `email user with id ${emailUserId} not found`);
  }

  if (emailUser && !emailUser.confirmed) {
    const googleUser = await googleUserModel.getByEmail(emailUser?.email as string);
    const investor = await createInvestor();
    await addInvestorToInviteByEmail(emailUser.email, investor.id);
    log.info(`create investor and referral profile  ${investor.id}`);

    emailUser.confirmed = true;
    emailUser.investor = googleUser ? googleUser.investor : investor;
    emailUser.investorId = googleUser ? googleUser.investorId : investor.id;
    await emailUserModel.update(emailUser);
    log.info(`created investor: ${investor.id} for emailUserId: ${emailUserId}`);

    return generateEntryResponse(emailUser.investorId, EntryFlowEnum.Create);
  } else {
    log.error(`email user with id ${emailUserId} not found`);
    return { success: false };
  }
};

export const registrationEmailWithConfirmEntryService = async (emailEntryDto: EmailRegistrationDto) => {
  let emailUser = await emailUserModel.getByEmail(emailEntryDto.email);

  if (emailUser && emailUser.confirmed) {
    throw new BadRequestError(BadRequestErrorKeys.UserAlreadyExist);
  }

  if (!emailUser) {
    const password = await bcrypt.hash(emailEntryDto.password, 10);
    emailUser = await emailUserModel.create({
      email: emailEntryDto.email,
      password,
    });
  }

  log.info(`create new account via email, emailUserId: ${emailUser.id}`);

  if (emailEntryDto.referralCode) {
    const isValidReferralCode = await validateReferralCode(emailEntryDto.referralCode);
    const isValidInviteCode = await taskProgressModel.getByInviteCode(emailEntryDto.referralCode);

    if (emailEntryDto.referralCode && !isValidReferralCode && !isValidInviteCode) {
      logger.warn(`Wrong referral code ${emailEntryDto}`);
    }
  }

  const googleUser = await googleUserModel.getByEmail(emailUser?.email as string);
  const investor = await createInvestor();
  await addInvestorToInviteByEmail(emailUser.email, investor.id);
  log.info(`create investor and referral profile  ${investor.id}`);

  emailUser.confirmed = true;
  emailUser.investor = googleUser ? googleUser.investor : investor;
  emailUser.investorId = googleUser ? googleUser.investorId : investor.id;
  await emailUserModel.update(emailUser);
  log.info(`created investor: ${investor.id} for emailUserId: ${emailUser.id}`);

  const upperCaseEntryType = getUpperCaseEntryType(EntryTypesEnum.Email);
  const experienceTaskType: ExperienceTaskType = `registerWith${upperCaseEntryType}`;
  await addExperience(investor.id, { experienceType: experienceTaskType });
  await NotificationsServerService.addOnBoardingNotification(investor.id);
  await NotificationsServerService.addExperienceNotification(investor.id);

  return generateEntryResponse(emailUser.investorId, EntryFlowEnum.Create);
};

export const loginEmailWithConfirmEntryService = async (emailEntryDto: EmailEntryDto) => {
  const emailUser = await emailUserModel.getByEmail(emailEntryDto.email);

  if (!emailUser || !emailUser.confirmed) {
    throw new BadRequestError(
      BadRequestErrorKeys.UserDoesNotExist,
      `email user with email ${emailEntryDto.email} not found`,
    );
  }

  await addExperience(emailUser.investorId as number, { experienceType: 'dailyLogin' });

  return generateEntryResponse(emailUser.investorId as number, EntryFlowEnum.Login);
};
