import { Expose } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class AddCandidateToWhitelistDto {
  @Expose()
  @IsNumber()
  projectId!: number;

  @Expose()
  @IsString()
  fullName!: string;

  @Expose()
  @IsString()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  wallet!: string;

  @Expose()
  @IsString()
  twitter!: string;

  @Expose()
  @IsString()
  telegram!: string;

  @Expose()
  @IsString()
  reCaptchaToken!: string;
}

export class CheckCandidateInWhitelistDto {
  @Expose()
  @IsNumber()
  projectId!: number;

  @Expose()
  @IsString()
  wallet!: string;
}
