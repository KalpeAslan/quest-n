import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ExperienceLevel, InvitesToPartnerProject } from '../../entity';

export class UpdateInvestorDto {
  @Expose()
  @IsString()
  @IsOptional()
  wallet?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  signature?: string | null;

  @Expose()
  @IsString()
  @IsOptional()
  username?: string;
}
export class DeleteInvestorDto {
  @Expose()
  @IsString()
  @IsOptional()
  deleteToken?: string;
}

export interface ResponseInvestorAnalyticsInfoDto {
  analytics_id: string;
  wallet: string | null;
  activeQuests: number;
  totalQuests: number;
  investorCreatingTime: number;
  investorId: number;
  isReferral: boolean;
  username: string | null;
  referrerCode: string | null;
  experienceLevel: ExperienceLevel | null;
  isNewNotificationsExist: boolean;
  pendingInvitesToPartnerProject: InvitesToPartnerProject[];
}

export interface ResponseInvestorProfileDto {
  canBeReferral: boolean;
  connectedAccounts: {
    twitter: string | null;
    discord: string | null;
    telegram: string | null;
    email: string | null;
    phone: string | null;
    google: string | null;
  };
  referralInfo: {
    referralProfit: number;
    claimableReferralProfit: number;
    referralCode: string;
  } | null;
  questInfo: {
    questProfit: number;
    completedQuests: CompletedQuest[];
    completedTasksNumber: number;
  };
  security: {
    twoFactorAuth: boolean;
    phoneNumber: string | null;
  };
}

interface CompletedQuest {
  profit: number;
  title: string;
}
