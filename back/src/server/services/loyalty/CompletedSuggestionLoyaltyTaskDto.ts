import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CompletedSuggestionLoyaltyTaskDto {
  @Expose()
  @IsString()
  description!: string;
}
