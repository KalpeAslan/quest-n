import { Expose } from 'class-transformer';
import { IsNumber, Min, IsString, IsOptional } from 'class-validator';

export class SaveFulfilledAllocationForSaleDto {
  @Expose()
  @Min(0)
  @IsNumber()
  @IsOptional()
  fulfilledAllocation!: number;

  @Expose()
  @IsString()
  transactionToken!: string;
}
