import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class EmailEntryDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  password!: string;
}

export class EmailRegistrationDto {
  @Expose()
  @IsString()
  email!: string;

  @Expose()
  @IsString()
  password!: string;

  @Expose()
  @IsString()
  referralCode!: string;

  @Expose()
  @IsString()
  redirect!: string;

  @Expose()
  @IsString()
  @IsOptional()
  reCaptchaToken?: string;
}

export class EmailVerificationDto {
  @Expose()
  @IsString()
  emailToken!: string;
}
