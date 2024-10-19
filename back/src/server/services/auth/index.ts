import { emailUserModel, phoneUserModel, twitterUserModel, walletUserModel } from '../../../db/models';
import { googleUserModel } from '../../../db/models/googleUserModel';
import { EntryTypesEnum } from '../../../db/types/interfaces/entry';
import { ChangePasswordDto } from '../../../db/types/interfaces/entry/changePasswordDto';
import { DiscordEntryDto } from '../../../db/types/interfaces/entry/discordDto';
import { EmailVerificationDto } from '../../../db/types/interfaces/entry/emailEntryDto';
import { GoogleEntryDto } from '../../../db/types/interfaces/entry/googleDto';
import { PhoneVerificationDto } from '../../../db/types/interfaces/entry/phoneEntryDto';
import { TelegramEntryDto } from '../../../db/types/interfaces/entry/telegramDto';
import { WalletEntryDto } from '../../../db/types/interfaces/entry/walletEntryDto';
import { SocialTypesEnum, TwitterEntryDto } from '../../../db/types/interfaces/socials';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { bodyValidator } from '../../helpers';
import { registrationEmailConfirmEntryService } from '../entry/emailEntryService';
import { sendPhoneVerificationCode, verifyPhoneEntryService } from '../entry/phoneEntryService';
import { discordAccessTokenService, discordDisconnectUserService, discordLoginService } from './discord';
import { emailChangePasswordService, emailDisconnectUserService } from './email';
import { googleAccessTokenService, googleDisconnectUserService, googleLoginService } from './google';
import { phoneChangePasswordService, phoneDisconnectUserService } from './phone';
import { telegramAccessTokenService, telegramDisconnectUserService, telegramLoginService } from './telegram';
import { twitterDisconnectUserService, twitterGetAuthTokenAndUserService, twitterGetLoginUrlService } from './twitter';
import { connectWallet, walletDisconnectUserService } from './wallet';
import { TelegramMiniDto } from '../../../db/types/interfaces/entry/telegramMiniDto';

/* Social connect flow methods */

export const connectSocials = async (socialsType: SocialTypesEnum, investorId: number) => {
  switch (socialsType) {
    case SocialTypesEnum.Discord:
      return discordLoginService();
    case SocialTypesEnum.Telegram:
      return telegramLoginService(investorId);
    default:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `сonnectSocials, socialsType: ${socialsType} is not implemented`,
      );
  }
};

export const confirmSocials = async (socialsType: SocialTypesEnum, body, investorId?: number, apiKey?: string) => {
  switch (socialsType) {
    case SocialTypesEnum.Discord:
      if (!investorId) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
      return discordAccessTokenService(body, investorId);
    case SocialTypesEnum.Telegram:
      return telegramAccessTokenService(body, apiKey);
    default:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `confirmSocials: ${socialsType} is not implemented`,
      );
  }
};

export const disconnectSocials = async (socialsType: SocialTypesEnum, investorId) => {
  switch (socialsType) {
    case SocialTypesEnum.Discord:
      return await discordDisconnectUserService(investorId);
    case SocialTypesEnum.Telegram:
      return await telegramDisconnectUserService(investorId);
    default:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `disconnectSocials: ${socialsType} is not implemented`,
      );
  }
};

export const socialsBodyValidator = (socialsType: SocialTypesEnum, body) => {
  switch (socialsType) {
    case SocialTypesEnum.Discord:
      return bodyValidator(DiscordEntryDto, body);
    case SocialTypesEnum.Telegram:
      return bodyValidator(TelegramEntryDto, body);

    default:
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `socialsBodyValidator: ${socialsType} is not implemented`);
  }
};

/* Auth connect flow methods */

export const сonnectAuth = async (entryType: EntryTypesEnum) => {
  switch (entryType) {
    case EntryTypesEnum.Google:
      return googleLoginService();
    case EntryTypesEnum.Twitter:
      return twitterGetLoginUrlService();
    default:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `сonnectAuth: ${entryType} is not implemented`,
      );
  }
};

export const confirmAuth = async (entryType: EntryTypesEnum, body, investorId) => {
  switch (entryType) {
    case EntryTypesEnum.Google:
      return googleAccessTokenService(body, investorId);
    case EntryTypesEnum.Twitter:
      return twitterGetAuthTokenAndUserService(body, investorId);
    case EntryTypesEnum.Wallet:
      return connectWallet(body, investorId);
    default:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `сonnectAuth: ${entryType} is not implemented`,
      );
  }
};

export const disconnectAuth = async (entryType: EntryTypesEnum, investorId: number) => {
  switch (entryType) {
    case EntryTypesEnum.Google:
      return googleDisconnectUserService(investorId);
    case EntryTypesEnum.Twitter:
      return twitterDisconnectUserService(investorId);
    case EntryTypesEnum.Wallet:
      return walletDisconnectUserService(investorId);
    case EntryTypesEnum.Email:
      return emailDisconnectUserService(investorId);
    case EntryTypesEnum.Phone:
      return phoneDisconnectUserService(investorId);
    default:
      throw new BadRequestError(
        BadRequestErrorKeys.NotValidDataProvided,
        `disconnectAuth: ${entryType} is not implemented`,
      );
  }
};

export const bodyValidatorAuth = (entryType: EntryTypesEnum, body) => {
  switch (entryType) {
    case EntryTypesEnum.Google:
      return bodyValidator(GoogleEntryDto, body);
    case EntryTypesEnum.Twitter:
      return bodyValidator(TwitterEntryDto, body);
    case EntryTypesEnum.Wallet:
      return bodyValidator(WalletEntryDto, body);
    case EntryTypesEnum.Telegram:
      return bodyValidator(TelegramMiniDto, body);
    default:
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `bodyValidatorAuth: ${entryType} is not implemented`);
  }
};

/* email/phone methods */
export const authVerifyCode = async (entryType: EntryTypesEnum, body) => {
  switch (entryType) {
    case EntryTypesEnum.Email:
      return registrationEmailConfirmEntryService(body);
    case EntryTypesEnum.Phone:
      return verifyPhoneEntryService(body);
    default:
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `authVerifyCode: ${entryType} is not implemented`);
  }
};

export const authVerifyCodeResend = async (entryType: EntryTypesEnum, body) => {
  switch (entryType) {
    case EntryTypesEnum.Email:
      return {
        confirmToken: null,
        flow: 'create',
        email: null,
      };
    case EntryTypesEnum.Phone:
      return sendPhoneVerificationCode(body);
    default:
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `authVerifyCodeResend: ${entryType} is not implemented`);
  }
};

export const bodyValidatorVerifyCode = (entryType: EntryTypesEnum, body) => {
  switch (entryType) {
    case EntryTypesEnum.Email:
      return bodyValidator(EmailVerificationDto, body);
    case EntryTypesEnum.Phone:
      return bodyValidator(PhoneVerificationDto, body);
    default:
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `bodyValidatorVerifyCode: ${entryType} is not implemented`);
  }
};

export const authChangePassword = async (
  entryType: EntryTypesEnum,
  changePasswordDto: ChangePasswordDto,
  investorId: number,
) => {
  switch (entryType) {
    case EntryTypesEnum.Email:
      return emailChangePasswordService(changePasswordDto, investorId);
    case EntryTypesEnum.Phone:
      return phoneChangePasswordService(changePasswordDto, investorId);
    default:
      throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }
};

/* Common methods */

export const countLoginConnections = async (investorId: number) => {
  const [twitterUser, walletUser, googleUser, emailUser, phoneUser] = await Promise.all([
    await twitterUserModel.getByInvestorId(investorId),
    await walletUserModel.getByInvestorId(investorId),
    await googleUserModel.getByInvestorId(investorId),
    await emailUserModel.getByInvestorId(investorId),
    await phoneUserModel.getByInvestorId(investorId),
  ]);

  const truthyValues = [twitterUser, walletUser, googleUser, emailUser, phoneUser].filter(Boolean);
  return truthyValues.length;
};
