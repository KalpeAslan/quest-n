import { LuckyDrawProgress } from '../entity';
import { getRepository, Repository } from 'typeorm';
import { GET_LUCKY_DRAW_WINNERS } from '../queries/taskProgressQueries';

interface IGetLuckDrawWinners {
  investorId: number;
  username: string;
  image: string;
}

export class LuckyDrawProgressModel {
  async add(loyaltyProjectId: number, investorId: number) {
    const repository: Repository<LuckyDrawProgress> = getRepository(LuckyDrawProgress);
    const luckyDrawProgress = await this.getByInvestorIdAndLoyaltyProjectId(investorId, loyaltyProjectId);
    if (luckyDrawProgress) {
      return luckyDrawProgress;
    }
    return repository.save({
      investorId,
      loyaltyProjectId,
    });
  }

  async getCountOfLuckyDrawProgressByLoyaltyProjectId(loyaltyProjectId: number) {
    return await getRepository(LuckyDrawProgress).find({
      loyaltyProjectId,
    });
  }

  getByInvestorIdAndLoyaltyProjectId(investorId: number, loyaltyProjectId: number) {
    const repository: Repository<LuckyDrawProgress> = getRepository(LuckyDrawProgress);
    return repository.findOne({
      investorId,
      loyaltyProjectId,
    });
  }

  getInvestorsIdsByLoyaltyProjectId(loyaltyProjectId: number): Promise<number[]> {
    const repository: Repository<LuckyDrawProgress> = getRepository(LuckyDrawProgress);
    return repository
      .find({
        loyaltyProjectId,
      })
      .then((luckyDrawProgresses) => luckyDrawProgresses.map((luckyDrawProgress) => luckyDrawProgress.investorId));
  }

  async getByParams(criteria: Partial<LuckyDrawProgress>) {
    return await getRepository(LuckyDrawProgress).find({
      where: criteria,
    });
  }

  async getLuckDrawWinners(loyaltyProjectId: number): Promise<IGetLuckDrawWinners> {
    const manager = getRepository(LuckyDrawProgress).manager;
    return await manager.query(GET_LUCKY_DRAW_WINNERS, [loyaltyProjectId]);
  }
}

export const luckyDrawProgressModel = new LuckyDrawProgressModel();
