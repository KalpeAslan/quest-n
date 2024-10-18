export class CreatePartnerDto {
  title!: string;
  description!: string;
  image!: string;
  link!: string;
  status?: boolean | null;
  priorityNumber!: number;
}

export class UpdatePartnerDto {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  status?: boolean | null;
  priorityNumber?: number | null;
}
