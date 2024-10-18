import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class WalletEntryDto {
  @Expose()
  @IsString()
  address!: string;

  @Expose()
  @IsString()
  signature!: string;
}
