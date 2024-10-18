import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AddReferralDto {
  @Expose()
  @IsString()
  code!: string;
}
