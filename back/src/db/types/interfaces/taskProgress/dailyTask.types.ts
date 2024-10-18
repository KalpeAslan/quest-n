export interface DailyTaskProgressBody {
  id: number;
  answer: string;
  day: number;
  status: DailyStatus;
}

export enum DailyStatus {
  OnReview = 'onReview',
  Confirmed = 'confirmed',
  Rejected = 'rejected',
  Expired = 'expired',
  Active = 'active',
}
