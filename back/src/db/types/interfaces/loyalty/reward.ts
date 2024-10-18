import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { TokenType } from './index';
import { Expose, Type } from 'class-transformer';

export class CreateLoyaltyRewardDto {
  @IsNumber()
  id?: number;

  @IsNumber()
  amount!: number;

  @IsBoolean()
  isClaimable!: boolean;

  @IsString()
  description!: string;

  @IsNumber()
  @IsOptional()
  startPlace?: number;

  @IsNumber()
  @IsOptional()
  endPlace?: number;

  @IsNumber()
  @IsOptional()
  loyaltyProjectId?: number | null;

  @IsNumber()
  @IsOptional()
  contractId!: number | null;

  @IsString()
  @IsEnum(TokenType)
  type: TokenType;

  @IsString()
  @IsOptional()
  whiteListingName?: string;
}

export class CreateNftRewardDto {
  @Expose()
  @IsOptional()
  @IsString()
  name!: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  contractId!: number;

  @Expose()
  @Type(() => Reward)
  rewards!: Reward[];

  @Expose()
  @IsOptional()
  @IsNumber()
  loyaltyProjectId!: number;

  @Expose()
  @IsOptional()
  @IsString()
  image?: string;
}

export class CreateWhitelistRewardDto {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number;

  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  description!: string;

  @Expose()
  @IsNumber()
  @Min(1)
  startPlace!: number;

  @Expose()
  @IsNumber()
  @Min(1)
  @ValidateIf((detail) => detail.endPlace >= detail.startPlace)
  endPlace!: number;

  @Expose()
  @IsNumber()
  loyaltyProjectId!: number;
}

export class CreateTokenRewardDto {
  @Expose()
  @IsNumber()
  contractId!: number;

  @Expose()
  @Type(() => Reward)
  rewards!: Reward[];

  @Expose()
  @IsNumber()
  loyaltyProjectId!: number;
}

class Reward {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number;

  @Expose()
  @IsNumber()
  amount!: number;

  @Expose()
  @IsNumber()
  @Min(1)
  startPlace!: number;

  @Expose()
  @IsNumber()
  @Min(1)
  @ValidateIf((detail) => detail.endPlace >= detail.startPlace)
  endPlace!: number;

  @Expose()
  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}
