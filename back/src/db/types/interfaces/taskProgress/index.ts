import { DailyTaskProgressBody } from './dailyTask.types';
import { QuizProgressBody } from './quiz.types';
import { ImageUploadTaskProgressBody } from './imageUploadTask.types';
import { SuggestionTaskProgressBody } from './suggestion.types';
import { TwitterTaskProgressBody } from './twitterUnlimited.types';
import { OnChainTaskProgressBody } from './onChainTask.type';
import { InviteTaskProgressBody } from './inviteTask.types';
import { EmailTaskProgressBody } from './email.types';
import { CustomWebhookTaskProgressBody } from './customWebhook.types';
import { GitCoinTaskProgressBody } from './gitCoinTaskProgressBody';

export type TaskProgressBody =
  | DailyTaskProgressBody[]
  | QuizProgressBody[]
  | ImageUploadTaskProgressBody
  | SuggestionTaskProgressBody
  | EmailTaskProgressBody
  | TwitterTaskProgressBody
  | OnChainTaskProgressBody
  | InviteTaskProgressBody
  | CustomWebhookTaskProgressBody
  | GitCoinTaskProgressBody;
