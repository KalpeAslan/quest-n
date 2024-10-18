import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class RefreshEntryDto {
  @Expose()
  @IsString()
  refreshToken!: string;
}
