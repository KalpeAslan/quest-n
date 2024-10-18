import { EntryTypesEnum } from '../../../db/types/interfaces/entry';
import { EntryDto } from '../../../db/types/interfaces/entry/entryDto';
import { GoogleEntryDto } from '../../../db/types/interfaces/entry/googleDto';
import { TwitterEntryDto } from '../../../db/types/interfaces/entry/twitterDto';
import { googleApiService } from '../apis/googleApiService';
import { twitterApiService } from '../../services/apis/twitterApiService';
import { googleEntryService } from './googleEntryService';
import { twitterEntryService } from './twitterEntryService';
import { RefreshEntryDto } from '../../../db/types/interfaces/entry/refreshDto';
import { BadRequestError, BadRequestErrorKeys, ForbiddenError, ForbiddenErrorKeys } from '../../errors';
import { investorModel } from '../../../db/models/investorModel';
import { generateAccessTokenResponse, verifyRefreshToken } from './jwt';
import { EmailEntryDto, EmailRegistrationDto } from '../../../db/types/interfaces/entry/emailEntryDto';
import {
  loginEmailEntryService,
  loginEmailWithConfirmEntryService,
  registrationEmailEntryService,
  registrationEmailWithConfirmEntryService,
} from './emailEntryService';
import { loginPhoneEntryService } from './phoneEntryService';
import { PhoneEntryDto, PhoneRegistrationDto } from '../../../db/types/interfaces/entry/phoneEntryDto';
import { registrationPhoneEntryService } from './phoneEntryService';
import { walletEntryService } from './walletEntryService';
import { WalletEntryDto } from '../../../db/types/interfaces/entry/walletEntryDto';
import { invitesToPartnerProjectModel } from '../../../db/models/invitesToPartnerProject.model';

export const getEntryUrl = async (entryType: EntryTypesEnum) => {
  switch (entryType) {
    case EntryTypesEnum.Twitter:
      return twitterApiService.fetchAuthUrl();
    case EntryTypesEnum.Google:
      return googleApiService.getAuthUrl();
    default:
      throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }
};

export const entryRefreshToken = async (data: RefreshEntryDto) => {
  try {
    const { investorId } = verifyRefreshToken(data.refreshToken);

    const investor = await investorModel.getByInvestorId(investorId);
    if (!investor) throw new BadRequestError(BadRequestErrorKeys.WrongRefreshToken);
    await investorModel.updateLastActivity(investorId);
    return generateAccessTokenResponse(investorId);
  } catch (error) {
    throw new ForbiddenError(ForbiddenErrorKeys.TokenExpired);
  }
};

export const entryRegistrationAction = async (entryDto: EmailRegistrationDto | PhoneRegistrationDto) => {
  if (entryDto instanceof EmailRegistrationDto) {
    return registrationEmailEntryService(entryDto);
  } else if (entryDto instanceof PhoneRegistrationDto) {
    return registrationPhoneEntryService(entryDto);
  }
};

export const entryLogin = async (entryType: EntryTypesEnum, entryBodyDto: EntryDto) => {
  switch (entryType) {
    case EntryTypesEnum.Twitter:
      return twitterEntryService(entryBodyDto as TwitterEntryDto);

    case EntryTypesEnum.Google:
      return googleEntryService(entryBodyDto as GoogleEntryDto);

    case EntryTypesEnum.Email:
      return loginEmailEntryService(entryBodyDto as EmailEntryDto);

    case EntryTypesEnum.Phone:
      return loginPhoneEntryService(entryBodyDto as PhoneEntryDto);

    case EntryTypesEnum.Wallet:
      return walletEntryService(entryBodyDto as WalletEntryDto);

    default:
      throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }
};

export const entrySignUp = async (entryType: EntryTypesEnum, entryBodyDto: EntryDto) => {
  switch (entryType) {
    case EntryTypesEnum.Twitter:
      return twitterEntryService(entryBodyDto as TwitterEntryDto);

    case EntryTypesEnum.Google:
      return googleEntryService(entryBodyDto as GoogleEntryDto);

    case EntryTypesEnum.Email:
      return registrationEmailEntryService(entryBodyDto as EmailRegistrationDto);

    case EntryTypesEnum.Phone:
      return registrationPhoneEntryService(entryBodyDto as PhoneRegistrationDto);

    case EntryTypesEnum.Wallet:
      return walletEntryService(entryBodyDto as WalletEntryDto);

    default:
      throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided);
  }
};

export const registerByInviteToPartnerProject = async (entryBodyDto: EmailRegistrationDto) => {
  const isInviteByEmailExist = await invitesToPartnerProjectModel.getByEmail(entryBodyDto.email);
  if (!isInviteByEmailExist)
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `No invite was found for email ${entryBodyDto.email}`,
    );

  return await registrationEmailWithConfirmEntryService(entryBodyDto);
};

export const loginByInviteToPartnerProject = async (entryBodyDto: EmailEntryDto) => {
  const isInviteByEmailExist = await invitesToPartnerProjectModel.getByEmail(entryBodyDto.email);
  if (!isInviteByEmailExist)
    throw new BadRequestError(
      BadRequestErrorKeys.NotValidDataProvided,
      `No invite was found for email ${entryBodyDto.email}`,
    );

  return await loginEmailWithConfirmEntryService(entryBodyDto);
};
