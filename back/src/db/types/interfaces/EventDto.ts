export class CreateEventDto {
  title!: string | null;
  description!: string;
  link!: string;
  isBanner?: boolean | null;
}

export class UpdateEventDto {
  title?: string | null;
  description?: string | null;
  link?: string | null;
  isBanner?: boolean | null;
}
