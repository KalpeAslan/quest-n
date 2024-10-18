import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { TokenType } from './loyalty';
import { Expose } from 'class-transformer';

export class CreateContractDto {
  @Expose()
  @IsNumber()
  @IsOptional()
  investorId?: number;

  @Expose()
  @IsString()
  @IsOptional()
  chainId?: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  symbol!: string;

  @Expose()
  @IsString()
  @IsOptional()
  address?: string;

  @Expose()
  @IsString()
  @IsOptional()
  logo?: string;

  @Expose()
  @IsString()
  @IsOptional()
  standard?: TokenStandardDto;

  @Expose()
  @IsBoolean()
  transferable?: boolean;

  @Expose()
  @IsNumber()
  @IsOptional()
  decimals?: number;

  @Expose()
  @IsString()
  type!: TokenType;
}

export class CreateTokenContractDto {
  @Expose()
  @IsString()
  chainId: string;

  @Expose()
  @IsString()
  address: string;

  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  symbol?: string;
}

export enum TokenStandardDto {
  ERC20 = 'erc20',
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
}
