import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class GoogleEntryDto {
  @Expose()
  @IsString()
  code!: string;
}
