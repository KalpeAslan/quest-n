import { SuggestionStatus } from '../loyalty';

export interface EmailTaskProgressBody {
  email: string;
  status: SuggestionStatus | null;
}
