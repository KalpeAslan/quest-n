import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';
import { EntryTypesEnum } from '../../db/types/interfaces/entry';
import { EmailEntryDto, EmailRegistrationDto } from '../../db/types/interfaces/entry/emailEntryDto';
import { GoogleEntryDto } from '../../db/types/interfaces/entry/googleDto';
import { PhoneEntryDto, PhoneRegistrationDto } from '../../db/types/interfaces/entry/phoneEntryDto';
import { TwitterEntryDto } from '../../db/types/interfaces/entry/twitterDto';
import { WalletEntryDto } from '../../db/types/interfaces/entry/walletEntryDto';
import { EntryFlowEnum } from '../../db/types/interfaces/interface-index';
import { bodyValidator } from './bodyValidator';

export const entryValidator = (entryType: EntryTypesEnum, body, flow: EntryFlowEnum) => {
  switch (entryType) {
    case EntryTypesEnum.Twitter:
      return bodyValidator(TwitterEntryDto, body);
    case EntryTypesEnum.Google:
      return bodyValidator(GoogleEntryDto, body);
    case EntryTypesEnum.Email:
      return bodyValidator(flow === EntryFlowEnum.Login ? EmailEntryDto : EmailRegistrationDto, body);
    case EntryTypesEnum.Phone:
      return bodyValidator(flow === EntryFlowEnum.Login ? PhoneEntryDto : PhoneRegistrationDto, body);
    case EntryTypesEnum.Wallet:
      return bodyValidator(WalletEntryDto, body);

    default:
      throw new NotFoundError(NotFoundErrorKeys.NotFound, `entryType: ${entryType} is not implemented`);
  }
};

export const getUpperCaseEntryType = (entryType: EntryTypesEnum) => {
  const upperCaseEntryType = (entryType.charAt(0).toUpperCase() + entryType.slice(1)) as
    | 'Twitter'
    | 'Google'
    | 'Wallet'
    | 'Discord';

  return upperCaseEntryType;
};
