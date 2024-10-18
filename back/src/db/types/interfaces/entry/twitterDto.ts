import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

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
