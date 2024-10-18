import { getManager, getRepository } from 'typeorm';
import { ExperienceLevel, Investor } from '../entity';
import { walletUserModel } from './walletUserModel';
import { GameSession } from '../types/interfaces/investor';
import { InvestorQueries } from '../queries/investorQueries';

interface CreateInvestorData {
  username: string;
}

export class InvestorModel {
  getByWallet(wallet: string) {
    return getRepository(Investor).findOne({
      where: { walletUser: { address: wallet.toLowerCase() } },
      relations: ['walletUser'],
    });
  }
  getByInvestorId(investorId: number | undefined) {
    if (!investorId) return undefined;
    return getRepository(Investor).findOne(investorId, { relations: ['walletUser'] });
  }

  getByInvestorIdOrFail(investorId: number) {
    return getRepository(Investor).findOneOrFail(investorId, { relations: ['walletUser'] });
  }
  getByInvestorIdOrFailWithRelations(investorId: number, relations: string[]) {
    return getRepository(Investor).findOneOrFail({
      where: {
        id: investorId,
      },
      relations,
    });
  }

  getInvestorAnalyticsInfo(investorId: number) {
    return getRepository(Investor)
      .createQueryBuilder('investor')
      .leftJoinAndSelect('investor.tokensStorage', 'tokensStorage')
      .leftJoinAndSelect('investor.walletUser', 'walletUser')
      .leftJoinAndSelect('tokensStorage.tokensStorageHistory', 'tokensStorageHistory')
      .leftJoinAndSelect('tokensStorageHistory.loyaltyProject', 'loyaltyProject')
      .where(`investor.id = ${investorId}`)
      .getOneOrFail();
  }
  getInvestorProfileInfo(investorId: number) {
    return getRepository(Investor)
      .createQueryBuilder('investor')
      .leftJoinAndSelect('investor.twitterUsers', 'twitterUsers')
      .leftJoinAndSelect('investor.discordTokens', 'discordTokens')
      .leftJoinAndSelect('investor.telegramUser', 'telegramUser')
      .leftJoinAndSelect('investor.tokensStorage', 'tokensStorage')
      .leftJoinAndSelect('investor.walletUser', 'walletUser')
      .leftJoinAndSelect('investor.twoFactorAuth', 'twoFactorAuth')
      .leftJoinAndSelect('investor.googleUser', 'googleUser')
      .leftJoinAndSelect('investor.emailUser', 'emailUser')
      .leftJoinAndSelect('investor.phoneUser', 'phoneUser')
      .leftJoinAndSelect('tokensStorage.tokensStorageHistory', 'tokensStorageHistory')
      .leftJoinAndSelect('tokensStorageHistory.loyaltyProject', 'loyaltyProject')
      .where(`investor.id = ${investorId}`)
      .getOneOrFail();
  }

  getByUsername(username: string) {
    return getRepository(Investor).findOne({ where: { username } });
  }

  getInvestorsWithGamesSessions() {
    return getRepository(Investor)
      .createQueryBuilder('investor')
      .where(`jsonb_array_length("investor".gamesSessions) > 0`)
      .getMany();
  }

  async getByInvestorIdAndSessionId(sessionId: number, investorId: number) {
    return getRepository(Investor)
      .createQueryBuilder('investor')
      .where('investor.id = :id', { id: investorId })
      .andWhere(`("investor"."gamesSessions" @> '[{ "sessionId": ${Number(sessionId)} }]'::jsonb)`)
      .getOne();
  }

  async addSession(sessionId: number, investorId: number) {
    const investor = await this.getByInvestorId(investorId);
    if (!investor) return;

    return getRepository(Investor).save({
      ...investor,
      gamesSessions: [
        ...investor.gamesSessions.filter((item) => item.sessionId !== sessionId),
        { sessionId, creationTime: new Date().getTime() },
      ],
    });
  }

  async setGamesSessions(gamesSessions: GameSession[], investorId: number) {
    const investor = await this.getByInvestorId(investorId);
    if (!investor) return;

    return getRepository(Investor).save({
      ...investor,
      gamesSessions: [...gamesSessions],
    });
  }

  async create(createInvestorData: CreateInvestorData) {
    const investor = getRepository(Investor).create(createInvestorData);
    return getRepository(Investor).save(investor);
  }

  async update(investor: Investor) {
    return getRepository(Investor).save(investor);
  }

  async getByWalletOrCreate(wallet: string) {
    const investor = await this.getByWallet(wallet.toLocaleLowerCase());
    if (investor) return investor;

    const newInvestor = await getRepository(Investor).save({});

    await walletUserModel.create({ investorId: newInvestor.id, address: wallet });

    return newInvestor;
  }

  delete(investor: Investor) {
    return getRepository(Investor).remove(investor);
  }

  updateLastActivity(id: number) {
    return getRepository(Investor).update(
      {
        id,
      },
      { lastActivity: new Date() },
    );
  }

  getWithRecentActivity(investorIDs): Promise<Investor[]> {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 14);

    const entityManager = getManager();
    return entityManager.query(InvestorQueries.getWithRecentActivity(investorIDs), [currentDate]);
  }

  async getExpLevelById(investorId: number): Promise<ExperienceLevel | undefined> {
    const investor = await getRepository(Investor).findOne({
      where: { id: investorId },
      relations: ['experienceLevel'],
    });

    return investor?.experienceLevel;
  }

  findOneByParams(params: any, relations?: string[]) {
    return getRepository(Investor).findOne({
      where: { ...params },
      relations,
    });
  }
}

export const investorModel = new InvestorModel();
