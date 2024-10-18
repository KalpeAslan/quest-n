import { AdditionalProgram, LoyaltyTaskType } from '..';
import { CreatingLoyaltyTaskDto, UpdatingLoyaltyTaskDto } from './loyaltyTask';

// FollowTwitter ------- START
export class CreateFollowTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.FollowTwitter;
  username!: string;
  userId?: string | null;
  description!: string;
}

export class UpdateFollowTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.FollowTwitter;
  username?: string | null;
  userId?: string | null;
  description?: string;
}
// FollowTwitter --------- END

// MentionTwitter ------- START
export class CreateMentionTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.MentionTwitter;
  description!: string;
  mentionUserName!: string;
  mentionUserId?: string | null;
  additionalProgram?: AdditionalProgram | null;
}

export class UpdateMentionTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.MentionTwitter;
  description?: string;
  mentionUserId?: string | null;
  mentionUserName?: string | null;
  additionalProgram?: AdditionalProgram | null;
}
// MentionTwitter --------- END

// TweetTwitter ------- START
export class CreateTweetTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.TweetTwitter;
  tweetText!: string;
  description!: string;
}

export class UpdateTweetTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.TweetTwitter;
  tweetText?: string;
  description?: string;
}
// TweetTwitter --------- END

// ReTweetTwitter ------- START
export class CreateReTweetTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.ReTweetTwitter;
  tweetId!: string;
  tweetLink?: string;
  description!: string;
}

export class UpdateReTweetTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.ReTweetTwitter;
  tweetId?: string;
  tweetLink?: string;
  description?: string;
}
// ReTweetTwitter --------- END
// ReTweetQuoteTwitter ------- START
export class CreateReTweetQuoteTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.ReTweetQuoteTwitter;
  tweetId!: string;
  tweetLink?: string;
  description!: string;
  additionalProgram?: AdditionalProgram | null;
}

export class UpdateReTweetQuoteTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.ReTweetQuoteTwitter;
  tweetId?: string;
  tweetLink?: string;
  description?: string;
  additionalProgram?: AdditionalProgram | null;
}

export class CreateLikeTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.LikeTweetTwitter;
  tweetId!: string;
  tweetLink?: string;
  description!: string;
  additionalProgram?: AdditionalProgram | null;
}

export class UpdateLikeTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.LikeTweetTwitter;
  tweetId?: string;
  tweetLink?: string;
  description?: string;
  additionalProgram?: AdditionalProgram | null;
}

export class CreateCommentTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.CommentTweetTwitter;
  tweetId!: string;
  tweetLink?: string;
  description!: string;
}

export class UpdateCommentTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.CommentTweetTwitter;
  tweetId?: string;
  tweetLink?: string;
  description?: string;
}
// ReTweetQuoteTwitter --------- END

// CheckSpaceTwitter ------- START
export class CreateCheckSpaceTwitterLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.CheckSpaceTwitter;
  description!: string;
  redirectLink!: string;
}

export class UpdateCheckSpaceTwitterLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.CheckSpaceTwitter;
  description?: string;
  redirectLink?: string;
}
// CheckSpaceTwitter --------- END

// JoinDiscord ------- START
export class CreateJoinDiscordLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.JoinDiscord;
  /**
   *
   * @minLength 1
   */
  serverId!: string;
  inviteLink!: string;
  description!: string;
}

export class UpdateJoinDiscordLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.JoinDiscord;
  /**
   *
   * @minLength 1
   */
  serverId?: string;
  inviteLink?: string;
  description?: string;
}
// JoinDiscord --------- END

// RoleDiscord ------- START
export class CreateRoleDiscordLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.RoleDiscord;
  /**
   *
   * @minLength 1
   */
  serverId!: string;
  roleId!: string;
  roleName!: string;
  description!: string;
  inviteLink?: string;
}

export class UpdateRoleDiscordLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.RoleDiscord;
  /**
   *
   * @minLength 1
   */
  serverId?: string;
  roleId?: string;
  roleName?: string;
  description?: string;
  inviteLink?: string;
}
// RoleDiscord --------- END

// Medium ---------- START
export class CreateMediumLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.Medium;
  link!: string;
  description!: string;
}

export class UpdateMediumLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.Medium;
  link?: string;
  description?: string;
}
// Medium ------------ END

// JoinTelegram ------- START
export class CreateJoinTelegramLoyaltyTaskDto extends CreatingLoyaltyTaskDto {
  type!: LoyaltyTaskType.JoinTelegram;
  description!: string;
  chatId!: string;
  inviteLink!: string;
}

export class UpdateJoinTelegramLoyaltyTaskDto extends UpdatingLoyaltyTaskDto {
  type?: LoyaltyTaskType.JoinTelegram;
  description?: string;
  chatId?: string;
  inviteLink?: string;
}
// JoinTelegram --------- END
