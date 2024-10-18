import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class UpdateClaimedAllocationDto {
  @Expose()
  @IsString()
  wallet!: string;

  @Expose()
  @IsNumber()
  saleId!: number;
}
