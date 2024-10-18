import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class PhoneEntryDto {
  @Expose()
  @IsString()
  phone!: string;

  @Expose()
  @IsString()
  password!: string;
}

export class PhoneRegistrationDto {
  @Expose()
  @IsString()
  phone!: string;

  @Expose()
  @IsString()
  password!: string;

  @Expose()
  @IsString()
  @IsOptional()
  reCaptchaToken?: string;
}

export class PhoneVerificationDto {
  @Expose()
  @IsString()
  code!: string;

  @Expose()
  @IsString()
  confirmToken!: string;
}

export class ConfirmTokenDto {
  @Expose()
  @IsString()
  confirmToken!: string;
}
