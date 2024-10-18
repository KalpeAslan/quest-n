export class createShortLinkDto {
  shortLink!: string;
  source!: string;
}

export class updateShortLinkDto {
  shortLink?: string;
  source?: string;
}
