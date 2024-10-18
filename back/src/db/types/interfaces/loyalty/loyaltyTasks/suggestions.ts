import { LoyaltyTaskType } from '..';
import { CreatingLoyaltyTaskDto, UpdatingLoyaltyTaskDto } from './loyaltyTask';

// Suggestion ------- START
export class CreateSuggestionLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.Suggestion;
  description!: string;
  regex?: string;
  uniqueOnly?: boolean;
}

export class UpdateSuggestionLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.Suggestion;
  description?: string;
  uniqueOnly?: boolean;
}
// Suggestion --------- END

// Email ------- START
export class CreateEmailLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.Email;
  description!: string;
}

export class UpdateEmailLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.Email;
  description?: string;
}
// Email --------- END
