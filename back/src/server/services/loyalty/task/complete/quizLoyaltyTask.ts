import { LoyaltyTask } from '../../../../../db/entity';
import { QuizLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';

export const isQuizLoyaltyTask = async (investorId: number, loyaltyTask: LoyaltyTask, requestBody) => {
  const isValid = (loyaltyTask.body as QuizLoyaltyTaskBody).answers
    .map((a) => a.toLowerCase())
    .includes(requestBody.answer.toLowerCase());

  if (isValid) {
    return { status: true, answer: requestBody.answer };
  }

  return {
    status: false,
    answer: requestBody.answer,
  };
};
