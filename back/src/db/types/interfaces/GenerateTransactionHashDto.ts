import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class GenerateTransactionHashDto {
  @Expose()
  @IsString()
  wallet!: string;

  @Expose()
  @IsNumber()
  amount!: number;
}
