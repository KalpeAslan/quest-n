export interface InviteTaskProgressBody {
  inviteCode: string;
  invitedInvestorIds: number[];
  scorePercentage: number;
  username?: string;
}
