import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsNumber, IsUrl } from 'class-validator';

export class CreatePartnerProjectDto {
  @Expose()
  @IsString()
  name!: string;

  @Expose()
  @IsString()
  linkTitle!: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  logo?: string | null;

  @Expose()
  @IsOptional()
  @IsBoolean()
  verificationIcon?: boolean | null;

  @Expose()
  @IsOptional()
  @IsString()
  localizationId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Expose()
  @IsOptional()
  @IsString()
  projectDescription?: string;

  @Expose()
  @IsOptional()
  @IsString()
  socialDescription?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  investorId?: number;
}

export class UpdatePartnerProjectDto {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsUrl()
  logo?: string | null;

  @Expose()
  @IsOptional()
  @IsString()
  linkTitle?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  verificationIcon?: boolean | null;

  @Expose()
  @IsOptional()
  @IsString()
  localizationId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Expose()
  @IsOptional()
  @IsString()
  projectDescription?: string;

  @Expose()
  @IsOptional()
  @IsString()
  socialDescription?: string;

  @Expose()
  @IsOptional()
  @IsString()
  investorId?: string;
}
