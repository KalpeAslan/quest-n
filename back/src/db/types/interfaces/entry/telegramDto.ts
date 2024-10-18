import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class TelegramEntryDto {
  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsString()
  @IsOptional()
  username?: string;

  @Expose()
  @IsString()
  @IsOptional()
  first_name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  last_name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  photo_url?: string;

  @Expose()
  @IsString()
  tempCode!: string;
}
