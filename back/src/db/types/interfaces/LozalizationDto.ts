export class CreateLocalizationDto {
  body: string | null | undefined;
  objId!: string;
  fieldType!: string;
  language!: string;
}
