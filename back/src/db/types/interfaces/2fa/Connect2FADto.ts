import { Expose } from 'class-transformer';
import { IsDefined, Matches } from 'class-validator';

export class Connect2FADto {
  @Expose()
  @IsDefined()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber!: string;
}
