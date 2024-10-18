import { DiscordEntryDto } from './discordDto';
import { GoogleEntryDto } from './googleDto';
import { TwitterEntryDto } from './twitterDto';
import { EmailEntryDto, EmailRegistrationDto } from './emailEntryDto';
import { PhoneEntryDto, PhoneRegistrationDto } from './phoneEntryDto';
import { WalletEntryDto } from './walletEntryDto';

export type EntryDto =
  | TwitterEntryDto
  | DiscordEntryDto
  | GoogleEntryDto
  | EmailEntryDto
  | PhoneEntryDto
  | EmailRegistrationDto
  | PhoneRegistrationDto
  | WalletEntryDto;
