export interface TwitterTaskProgressBody {
  tweetId: string;
  unlimitedEarnedPoints: number | null;
  unlimitedLikesCount: number | null;
  unlimitedReTweetsCount: number | null;
  unlimitedEndAt: Date | null;
}
