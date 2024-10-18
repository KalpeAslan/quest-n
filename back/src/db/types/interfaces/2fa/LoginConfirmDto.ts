import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class LoginConfirm2FADto {
  @Expose()
  @Length(6)
  @IsString()
  code!: string;

  @Expose()
  @IsString()
  twoFactorAuthToken!: string;
}
