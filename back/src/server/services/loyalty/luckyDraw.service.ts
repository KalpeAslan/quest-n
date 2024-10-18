import { luckyDrawProgressModel } from '../../../db/models/luckyDrawProgress.model';
import { StickyMenuInvestorInfoLuckDraw } from '../../../db/types/interfaces/loyalty';
import { taskProgressModel } from '../../../db/models';

export const getUserLuckyDrawInfo = async (
  investorId: number,
  endAt: Date | null,
  completed: boolean,
  id: number,
  threshold: number,
): Promise<StickyMenuInvestorInfoLuckDraw> => {
  const earnedPoints = await taskProgressModel.getEarnedPoints(id, investorId);

  return {
    requiredPoints: computeLuckyDrawRequiredPoints(threshold, earnedPoints),
    status: await computeLuckyDrawStatus(endAt, completed, id, threshold, earnedPoints, investorId),
  };
};

export const computeLuckyDrawStatus = async (
  endAt: Date | null,
  completed: boolean,
  id: number,
  threshold: number,
  earnedPoints: number,
  investorId: number,
): Promise<StickyMenuInvestorInfoLuckDraw['status']> => {
  if (endAt && new Date().getTime() >= new Date(endAt).getTime() && completed) {
    const winner = await luckyDrawProgressModel.getByInvestorIdAndLoyaltyProjectId(investorId, id);
    return winner ? 'winner' : 'loser';
  }

  return computeLuckyDrawRequiredPoints(threshold, earnedPoints) ? 'notEligible' : 'eligible';
};

const computeLuckyDrawRequiredPoints = (threshold: number, earnedPoints: number): number => {
  if (earnedPoints >= threshold) return 0;

  return threshold - earnedPoints;
};
