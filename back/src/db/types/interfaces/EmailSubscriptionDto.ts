import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class EmailSubscriptionDto {
  @Expose()
  @IsString()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  reCaptchaToken!: string;
}
