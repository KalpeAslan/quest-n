import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class DiscordEntryDto {
  @Expose()
  @IsString()
  code!: string;
}
