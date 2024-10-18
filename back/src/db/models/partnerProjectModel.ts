import { FindConditions, getRepository, In, ObjectLiteral } from 'typeorm';
import { LoyaltyProject, PartnerProject } from '../../db/entity';

class PartnerProjectModel {
  getAll() {
    return getRepository(PartnerProject).find();
  }

  getById(id: number) {
    return getRepository(PartnerProject).findOne({
      id,
    });
  }

  getByLinkTitle(linkTitle: string) {
    return getRepository(PartnerProject)
      .createQueryBuilder('partnerProject')
      .leftJoinAndSelect('partnerProject.loyaltyProjects', 'loyaltyProjects')
      .where('partnerProject.linkTitle = :linkTitle', { linkTitle })
      .getOneOrFail();
  }

  getByLinkTitleAndInvestorId(linkTitle: string, investorId: number) {
    return getRepository(PartnerProject)
      .createQueryBuilder('partnerProject')
      .where('partnerProject.linkTitle = :linkTitle', { linkTitle })
      .andWhere('partnerProject.investorId = :investorId', { investorId })
      .getOne();
  }

  getByInvestorId(investorId: number) {
    return getRepository(PartnerProject)
      .createQueryBuilder('partnerProject')
      .leftJoinAndSelect('partnerProject.loyaltyProjects', 'loyaltyProjects')
      .where('partnerProject.investorId = :investorId', { investorId })
      .getMany();
  }

  getByIds(ids: number[]) {
    return getRepository(PartnerProject).find({
      where: {
        id: In(ids),
      },
    });
  }

  create(partnerProject: PartnerProject) {
    return getRepository(PartnerProject).save(partnerProject);
  }

  update(partnerProject: PartnerProject) {
    return getRepository(PartnerProject).save(partnerProject);
  }

  delete(id: number) {
    return getRepository(PartnerProject).delete({
      id,
    });
  }

  async getByParams(
    criteria: string | ObjectLiteral | FindConditions<LoyaltyProject> | FindConditions<LoyaltyProject>[],
  ) {
    return await getRepository(PartnerProject).find({
      where: criteria,
    });
  }
}

export const partnerProjectModel = new PartnerProjectModel();
