import { investorModel } from '../../../../db/models';
import { loyaltyProjectModel } from '../../../../db/models/loyaltyProjectModel';
import { mappingLoyaltyTasks } from '../loyaltyProject';

export const getOnboardingTasks = async (investorId: number | undefined, language: string | undefined) => {
  const investor = await investorModel.getByInvestorId(investorId);
  const loyaltyProject = await loyaltyProjectModel.getByLinkTitle('alphaguilty-onboarding');
  const actualOnboardingLoyaltyTasks =
    loyaltyProject.loyaltyTasks?.filter((aTask) => !!('isOnboardingTask' in aTask.body)) || [];

  if (!investor) {
    return await mappingLoyaltyTasks({ actualLoyaltyTasks: actualOnboardingLoyaltyTasks, language });
  }

  return await mappingLoyaltyTasks({
    actualLoyaltyTasks: actualOnboardingLoyaltyTasks,
    investorId: investor.id,
    language,
  });
};
