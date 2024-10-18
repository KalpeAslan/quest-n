import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export enum SocialTypesEnum {
  Telegram = 'telegram',
  Discord = 'discord',
}

export class DiscordEntryDto {
  @Expose()
  @IsString()
  oauthVerifier!: string;

  @Expose()
  @IsString()
  oauthRequestToken!: string;

  @Expose()
  @IsString()
  oauthRequestTokenSecret!: string;
}

export class TwitterEntryDto {
  @Expose()
  @IsString()
  oauthVerifier!: string;

  @Expose()
  @IsString()
  oauthRequestToken!: string;

  @Expose()
  @IsString()
  oauthRequestTokenSecret!: string;
}
