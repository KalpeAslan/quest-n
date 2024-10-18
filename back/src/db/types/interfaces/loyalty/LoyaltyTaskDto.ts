import {
  CreateCompletedOnboardingLoyaltyTaskDto,
  CreateQuizLoyaltyTaskDto,
  CreateNFTLoyaltyTaskDto,
  CreatePartnerLoyaltyTaskDto,
  CreateReferralLinkLoyaltyTaskDto,
  CreateSignUpLoyaltyTaskDto,
  CreateTokenLoyaltyTaskDto,
  CreateVisitLinkLoyaltyTaskDto,
  CreateWatchVideoLoyaltyTaskDto,
  UpdateCompletedOnboardingLoyaltyTaskDto,
  UpdateQuizLoyaltyTaskDto,
  UpdateNFTLoyaltyTaskDto,
  UpdatePartnerLoyaltyTaskDto,
  UpdateReferralLinkLoyaltyTaskDto,
  UpdateSignUpLoyaltyTaskDto,
  UpdateTokenLoyaltyTaskDto,
  UpdateVisitLinkLoyaltyTaskDto,
  UpdateWatchVideoLoyaltyTaskDto,
  CreateNativeHolderLoyaltyTaskDto,
  CreateValueHolderLoyaltyTaskDto,
  CreateBlockchainUserLoyaltyTaskDto,
  UpdateBlockchainUserLoyaltyTaskDto,
  UpdateValueHolderLoyaltyTaskDto,
  UpdateNativeHolderLoyaltyTaskDto,
  CreateDailyTasksDto,
  UpdateDailyTasksDto,
  CreateCustomWebhookTaskDto,
  UpdateCustomWebhookTaskDto,
  CreateDEXLiquidityProviderTaskDTO,
  UpdateDEXLiquidityProviderTaskDTO,
  CreateImageUploadTaskDTO,
  UploadImageUploadTaskDTO,
  CreateInviteTaskDTO,
  UpdateInviteTaskDTO,
  CreateBridgeTaskDTO,
  UpdateBridgeTaskDTO,
  CreateOnChainEventTaskDTO,
  UpdateOnChainEventTaskDTO,
} from './loyaltyTasks/loyaltyTask';
import {
  CreateCheckSpaceTwitterLoyaltyTaskDto,
  CreateFollowTwitterLoyaltyTaskDto,
  CreateJoinDiscordLoyaltyTaskDto,
  CreateJoinTelegramLoyaltyTaskDto,
  CreateMediumLoyaltyTaskDto,
  CreateMentionTwitterLoyaltyTaskDto,
  CreateReTweetQuoteTwitterLoyaltyTaskDto,
  CreateLikeTwitterLoyaltyTaskDto,
  CreateCommentTwitterLoyaltyTaskDto,
  CreateReTweetTwitterLoyaltyTaskDto,
  CreateRoleDiscordLoyaltyTaskDto,
  CreateTweetTwitterLoyaltyTaskDto,
  UpdateCheckSpaceTwitterLoyaltyTaskDto,
  UpdateFollowTwitterLoyaltyTaskDto,
  UpdateJoinDiscordLoyaltyTaskDto,
  UpdateJoinTelegramLoyaltyTaskDto,
  UpdateMediumLoyaltyTaskDto,
  UpdateMentionTwitterLoyaltyTaskDto,
  UpdateReTweetQuoteTwitterLoyaltyTaskDto,
  UpdateLikeTwitterLoyaltyTaskDto,
  UpdateCommentTwitterLoyaltyTaskDto,
  UpdateReTweetTwitterLoyaltyTaskDto,
  UpdateRoleDiscordLoyaltyTaskDto,
  UpdateTweetTwitterLoyaltyTaskDto,
} from './loyaltyTasks/socialTasks';
import {
  CreateEmailLoyaltyTaskDto,
  CreateSuggestionLoyaltyTaskDto,
  UpdateEmailLoyaltyTaskDto,
  UpdateSuggestionLoyaltyTaskDto,
} from './loyaltyTasks/suggestions';

export type CreateLoyaltyTaskDto =
  | CreateBlockchainUserLoyaltyTaskDto
  | CreateCheckSpaceTwitterLoyaltyTaskDto
  | CreateCompletedOnboardingLoyaltyTaskDto
  | CreateEmailLoyaltyTaskDto
  | CreateFollowTwitterLoyaltyTaskDto
  | CreateQuizLoyaltyTaskDto
  | CreateJoinDiscordLoyaltyTaskDto
  | CreateJoinTelegramLoyaltyTaskDto
  | CreateMediumLoyaltyTaskDto
  | CreateMentionTwitterLoyaltyTaskDto
  | CreateNativeHolderLoyaltyTaskDto
  | CreateNFTLoyaltyTaskDto
  | CreatePartnerLoyaltyTaskDto
  | CreateReferralLinkLoyaltyTaskDto
  | CreateReTweetQuoteTwitterLoyaltyTaskDto
  | CreateLikeTwitterLoyaltyTaskDto
  | CreateCommentTwitterLoyaltyTaskDto
  | CreateReTweetTwitterLoyaltyTaskDto
  | CreateRoleDiscordLoyaltyTaskDto
  | CreateSignUpLoyaltyTaskDto
  | CreateSuggestionLoyaltyTaskDto
  | CreateTokenLoyaltyTaskDto
  | CreateTweetTwitterLoyaltyTaskDto
  | CreateValueHolderLoyaltyTaskDto
  | CreateVisitLinkLoyaltyTaskDto
  | CreateWatchVideoLoyaltyTaskDto
  | CreateDailyTasksDto
  | CreateCustomWebhookTaskDto
  | CreateDEXLiquidityProviderTaskDTO
  | CreateImageUploadTaskDTO
  | CreateInviteTaskDTO
  | CreateBridgeTaskDTO
  | CreateOnChainEventTaskDTO;

export type UpdateLoyaltyTaskDto =
  | (
      | UpdateBlockchainUserLoyaltyTaskDto
      | UpdateCheckSpaceTwitterLoyaltyTaskDto
      | UpdateCompletedOnboardingLoyaltyTaskDto
      | UpdateEmailLoyaltyTaskDto
      | UpdateFollowTwitterLoyaltyTaskDto
      | UpdateQuizLoyaltyTaskDto
      | UpdateJoinDiscordLoyaltyTaskDto
      | UpdateJoinTelegramLoyaltyTaskDto
      | UpdateMediumLoyaltyTaskDto
      | UpdateMentionTwitterLoyaltyTaskDto
      | UpdateNativeHolderLoyaltyTaskDto
      | UpdateNFTLoyaltyTaskDto
      | UpdatePartnerLoyaltyTaskDto
      | UpdateReferralLinkLoyaltyTaskDto
      | UpdateReTweetQuoteTwitterLoyaltyTaskDto
      | UpdateReTweetTwitterLoyaltyTaskDto
      | UpdateRoleDiscordLoyaltyTaskDto
      | UpdateSignUpLoyaltyTaskDto
      | UpdateSuggestionLoyaltyTaskDto
      | UpdateTokenLoyaltyTaskDto
      | UpdateTweetTwitterLoyaltyTaskDto
      | UpdateLikeTwitterLoyaltyTaskDto
      | UpdateCommentTwitterLoyaltyTaskDto
      | UpdateValueHolderLoyaltyTaskDto
      | UpdateVisitLinkLoyaltyTaskDto
      | UpdateWatchVideoLoyaltyTaskDto
      | UpdateDailyTasksDto
      | UpdateCustomWebhookTaskDto
      | UpdateDEXLiquidityProviderTaskDTO
      | UploadImageUploadTaskDTO
      | UpdateInviteTaskDTO
      | UpdateBridgeTaskDTO
      | UpdateOnChainEventTaskDTO
    ) & { id?: number };
