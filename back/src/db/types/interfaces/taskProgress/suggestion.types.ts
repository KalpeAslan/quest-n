import { SuggestionStatus } from '../loyalty';

export interface SuggestionTaskProgressBody {
  description: string;
  status: SuggestionStatus | null;
}
