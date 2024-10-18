import { LoyaltyTask } from '../../../../../db/entity';
import { DailyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { DailyTaskProgressBody } from '../../../../../db/types/interfaces/taskProgress/dailyTask.types';

export const isDailyLoyaltyTask = async (loyaltyTask: LoyaltyTask, requestBody: DailyTaskProgressBody, investorId) => {
  const subTask = (loyaltyTask.body as DailyTaskBody).subTasks.find((subTask) => subTask.id === requestBody.id);

  if (subTask?.regex) {
    return {
      status: new RegExp(subTask.regex).test(requestBody.answer),
      json: {
        subTaskPoints: subTask?.points,
      },
    };
  }

  return {
    status: true,
    json: {
      subTaskPoints: subTask?.points,
    },
  };
};
