export interface QuizProgressBody {
  id: number;
  answer: string;
  completedAt: Date;
  status: QuizTypesStatus;
}

export enum QuizTypesStatus {
  COMPLETED = 'completed',
  INVALID = 'invalid',
}
