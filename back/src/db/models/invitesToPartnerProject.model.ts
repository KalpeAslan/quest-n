import { BaseRepositoryService } from './BaseRepository';
import { InvitesToPartnerProject } from '../entity';
import { In } from 'typeorm';
import { InvitesToPartnerProjectTypes } from '../types/interfaces/invitesToPartnerProject.types';

export class InvitesToPartnerProjectModel extends BaseRepositoryService<InvitesToPartnerProject> {
  constructor() {
    super(InvitesToPartnerProject);
  }

  getByEmail(email: string) {
    const query = this.repository
      .createQueryBuilder('invitesToPartnerProject')
      .where('LOWER(invitesToPartnerProject.email) = :email', { email: email.toLowerCase() });
    return query.getOne();
  }

  getFullInfoById(id: number) {
    const query = this.repository
      .createQueryBuilder('invitesToPartnerProject')
      .where('invitesToPartnerProject.id = :id', { id })
      .leftJoinAndSelect('invitesToPartnerProject.partnerProject', 'partnerProject')
      .leftJoinAndSelect('invitesToPartnerProject.investor', 'investor')
      .leftJoinAndSelect('investor.emailUser', 'emailUser')
      .leftJoinAndSelect('investor.googleUser', 'googleUser');
    return query.getOne();
  }

  getActiveInvitedInvestorsByProjectLinkTitle(partnerProjectId: number) {
    return this.repository.find({
      where: {
        partnerProject: {
          id: partnerProjectId,
        },
        status: In(['pending', 'accepted'] as InvitesToPartnerProjectTypes.status[]),
      },
    });
  }

  async getPartnerProjectsByInvestorId(investorId: number) {
    return await this.repository
      .createQueryBuilder('invitesToPartnerProject')
      .where('invitesToPartnerProject.investorId = :investorId AND status = :status', {
        investorId,
        status: 'accepted',
      })
      .leftJoinAndSelect('invitesToPartnerProject.partnerProject', 'partnerProject')
      .leftJoinAndSelect('partnerProject.loyaltyProjects', 'loyaltyProjects')
      .getMany();
  }
}

export const invitesToPartnerProjectModel = new InvitesToPartnerProjectModel();
