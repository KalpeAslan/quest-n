import { LoyaltyTask } from '../../../../../db/entity';
import { LoyaltyTaskType } from '../../../../../db/types/interfaces/loyalty';
import { walletUserModel } from '../../../../../db/models';
import { isTokenLoyaltyTask } from './tokenLoyaltyTask';
import { isNftLoyaltyTask } from './nftLoyaltyTask';
import { isBlockchainUserLoyaltyTask } from './blockchainUserLoyaltyTask';
import { isValueHolderLoyaltyTask } from './valueHolderLoyaltyTask';
import { isNativeHolderLoyaltyTask } from './nativeHolderLoyaltyTask';
import { isDEXLoyaltyTaskLiquidityProvider } from './isDEXLoyaltyTaskLiquidityProvider';
import { isBridgeLoyaltyTask } from './isBridgeLoyaltyTask';
import { isGitCoinLoyaltyTask } from './isGitCoinLoyaltyTask';
import { isSuggestionLoyaltyTask } from './suggestionLoyaltyTask';
import { isEmailLoyaltyTask } from './emailLoyaltyTask';
import { isDailyLoyaltyTask } from './dailyLoyaltyTask';
import { isCustomWebhookLoyaltyTask } from './isCustomWebhookLoyaltyTask';
import { isQuizLoyaltyTask } from './quizLoyaltyTask';
import { isImageLoyaltyTask } from './isImageLoyaltyTask';
import { isInviteLoyaltyTask } from './isInviteLoyaltyTask';
import { isJoinDiscordLoyaltyTask } from './joinDiscordLoyaltyTask';
import { isRoleDiscordLoyaltyTask } from './roleDiscordLoyaltyTask';
import { isJoinTelegramLoyaltyTask } from './joinTelegramLoyaltyTask';
import { isPartnerLoyaltyTask } from './partnerLoyaltyTask';
import { isOnChainEventLoyaltyTask } from './isOnChainEventLoyaltyTask';
import { isLikeTweetLoyaltyTask } from './isLikeTweetLoyaltyTask';
import { isReTweetLoyaltyTask } from './isReTweetLoyaltyTask';
import { isMentionLoyaltyTask } from './isMentionLoyaltyTask';
import { isReTweetQuoteLoyaltyTask } from './isQuoteReTweetLoyaltyTask';

export const isTaskCompleted = async (
  investorId: number,
  loyaltyTask: LoyaltyTask,
  requestBody: any | undefined,
  language,
) => {
  let result: {
    status: boolean;
    json?: any;
  };

  switch (loyaltyTask.type) {
    case LoyaltyTaskType.Token: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isTokenLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.NFT: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isNftLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.BlockchainUser: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isBlockchainUserLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.ValueHolder: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isValueHolderLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.NativeHolder: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isNativeHolderLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.DEXLiquidityProvider: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isDEXLoyaltyTaskLiquidityProvider(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.Bridge: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isBridgeLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.GitCoin: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isGitCoinLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.OnChainEvent: {
      const wallet = await walletUserModel.getByInvestorId(investorId);
      result = await isOnChainEventLoyaltyTask(wallet?.address as string, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.Suggestion: {
      result = await isSuggestionLoyaltyTask(requestBody, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.Email: {
      result = await isEmailLoyaltyTask(requestBody, loyaltyTask);
      break;
    }
    case LoyaltyTaskType.Daily: {
      result = await isDailyLoyaltyTask(loyaltyTask, requestBody, investorId);
      break;
    }
    case LoyaltyTaskType.CustomWebhook: {
      result = await isCustomWebhookLoyaltyTask(requestBody, loyaltyTask, investorId);
      break;
    }
    case LoyaltyTaskType.Quiz: {
      result = await isQuizLoyaltyTask(investorId, loyaltyTask, requestBody);
      break;
    }
    case LoyaltyTaskType.ImageUpload: {
      result = await isImageLoyaltyTask(requestBody);
      break;
    }
    case LoyaltyTaskType.Invite: {
      result = await isInviteLoyaltyTask(requestBody);
      break;
    }
    // always return { status: true }, because of Twitter API limitations
    case LoyaltyTaskType.LikeTweetTwitter:
      result = await isLikeTweetLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.ReTweetQuoteTwitter:
      result = await isReTweetQuoteLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.ReTweetTwitter:
      result = await isReTweetLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.MentionTwitter:
      result = await isMentionLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.CommentTweetTwitter:
    case LoyaltyTaskType.FollowTwitter:
    case LoyaltyTaskType.TweetTwitter:
    case LoyaltyTaskType.CheckSpaceTwitter:
      result = { status: true };
      break;
    case LoyaltyTaskType.JoinDiscord:
      result = await isJoinDiscordLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.RoleDiscord:
      result = await isRoleDiscordLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.JoinTelegram:
      result = await isJoinTelegramLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.Partner:
      result = await isPartnerLoyaltyTask(investorId, loyaltyTask);
      break;
    case LoyaltyTaskType.VisitLink:
    case LoyaltyTaskType.Medium:
    case LoyaltyTaskType.ReferralLink:
    case LoyaltyTaskType.SignUp:
    case LoyaltyTaskType.WatchVideo:
    case LoyaltyTaskType.CompletedOnboarding:
      result = { status: true };
      break;
  }

  return result;
};
