import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum EAmbassadorMethods {
  EMAIL = 'email',
  TELEGRAM = 'telegram',
  TWITTER = 'twitter',
}

export class CreateAmbassadorDto {
  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsEnum(EAmbassadorMethods)
  method: EAmbassadorMethods;
}
