import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class Confirm2FADto {
  @Expose()
  @Length(6)
  @IsString()
  code!: string;
}
