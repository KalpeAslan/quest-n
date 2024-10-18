export class CreateLoyaltyEventDto {
  title!: string | null;
  description!: string;
  status?: boolean | null;
}

export class UpdateLoyaltyEventDto {
  title?: string | null;
  description?: string | null;
  status?: boolean | null;
}
