import { LoyaltyTask } from '../../../../../db/entity';
import { taskProgressModel } from '../../../../../db/models';
import { PartnerTask } from '../../../../../db/types/interfaces/loyalty';
import { PartnerLoyaltyTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';

export const isPartnerLoyaltyTask = async (investorId: number, loyaltyTask: LoyaltyTask) => {
  const loyaltyTaskBody = loyaltyTask.body as PartnerLoyaltyTaskBody;

  const result = await isCompletedPartnerTasks(investorId, loyaltyTaskBody.partnerTask);
  return { status: result };
};

const isCompletedPartnerTasks = async (investorId: number, partnerTask: PartnerTask) => {
  const countOfCompletedTasks = await taskProgressModel.getCount({
    investorId: investorId,
    loyaltyProjectId: partnerTask.projectId,
  });

  return countOfCompletedTasks >= partnerTask.tasksCount;
};
