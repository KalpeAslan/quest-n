export class CreateAdvertisementDto {
  title!: string;
  icon?: boolean;
  tooltip?: string | null;
  items?: {
    text: string;
    url?: string;
    highlighted?: boolean;
  }[];
}

export class UpdateAdvertisementDto extends CreateAdvertisementDto {}
