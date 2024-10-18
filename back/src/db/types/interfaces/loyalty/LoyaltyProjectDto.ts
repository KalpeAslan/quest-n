import { CreateLoyaltyTaskDto } from './LoyaltyTaskDto';
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { QuestStatus, QuestType } from '.';
import { Type } from 'class-transformer';

export class CreateLoyaltyProjectDto {
  @IsString()
  projectName!: string;

  @IsString()
  description!: string;

  @IsString()
  socialDescription!: string;

  @IsDate()
  @Type(() => Date)
  startAt!: Date;

  @IsDate()
  @Type(() => Date)
  endAt!: Date;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsDate()
  @IsOptional()
  claimingStartAt?: Date;

  @IsDate()
  @IsOptional()
  claimingEndAt?: Date;

  @IsString()
  linkTitle!: string;

  @IsOptional()
  @IsArray()
  languages?: string[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  tokensAmount?: number;

  @IsOptional()
  @IsArray()
  loyaltyTasks?: CreateLoyaltyTaskDto[];

  @IsOptional()
  @IsArray()
  partnerIds!: number[];

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsString()
  preview_img?: string;

  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @IsOptional()
  @IsString()
  previewImage?: string;

  @IsOptional()
  @IsString()
  projectType?: QuestType;

  @IsOptional()
  @IsNumber()
  eligibleUsersCount?: number;

  @IsOptional()
  @IsString()
  partnerLinkTitle!: string;

  @IsOptional()
  @IsNumber()
  threshold?: number;

  @IsOptional()
  @IsString()
  questStatus?: QuestStatus;
}

export class UpdateLoyaltyProjectDto {
  @IsOptional()
  @IsString()
  projectName?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsString()
  @IsOptional()
  socialDescription?: string;

  @IsOptional()
  @IsString()
  startAt?: Date | null;

  @IsOptional()
  @IsString()
  endAt?: Date | null;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsString()
  @IsOptional()
  claimingStartAt?: Date;

  @IsString()
  @IsOptional()
  claimingEndAt?: Date;

  @IsOptional()
  @IsNumber()
  minTokenAmount?: number;

  @IsOptional()
  @IsString()
  linkTitle?: string | null;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  partnerIds?: number[];

  // Assuming QuestType is an enum or a custom type for the projectType property
  @IsOptional()
  @IsOptional()
  projectType?: QuestType;

  @IsOptional()
  @IsNumber()
  threshold?: number;

  @IsOptional()
  @IsNumber()
  eligibleUsersCount?: number;

  @IsOptional()
  @IsBoolean()
  visible?: boolean;

  @IsOptional()
  @IsString()
  previewImage?: string;

  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @IsOptional()
  @IsString()
  preview_img?: string;

  @IsOptional()
  @IsString()
  questStatus?: QuestStatus;
}

export class ClaimDto {
  @IsNumber()
  rewardId: number;
}

export class ClaimConfirmDto {
  @IsNumber()
  rewardId: number;

  @IsString()
  transactionHash: string;
}
