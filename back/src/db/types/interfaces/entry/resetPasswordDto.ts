import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ResetPasswordVerificationSendDto {
  @Expose()
  @IsString()
  @IsOptional()
  phone?: string;

  @Expose()
  @IsString()
  @IsOptional()
  email?: string;

  @Expose()
  @IsString()
  type!: 'phone' | 'email';
}

export class ResetPasswordVerificationResendDto {
  @Expose()
  @IsString()
  confirmToken!: string;

  @Expose()
  @IsString()
  type!: 'phone' | 'email';
}

export class ResetPasswordVerificationConfirmDto {
  @Expose()
  @IsString()
  confirmToken!: string;

  @Expose()
  @IsString()
  code!: string;

  @Expose()
  @IsString()
  type!: 'phone' | 'email';
}

export class ResetPasswordDto {
  @Expose()
  @IsString()
  resetToken!: string;

  @Expose()
  @IsString()
  newPassword!: string;

  @Expose()
  @IsString()
  type!: 'phone' | 'email';
}
