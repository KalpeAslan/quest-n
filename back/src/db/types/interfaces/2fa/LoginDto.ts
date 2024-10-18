import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class Login2FADto {
  @Expose()
  @IsString()
  twoFactorAuthToken!: string;
}
