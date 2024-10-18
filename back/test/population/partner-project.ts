import { getRepository } from 'typeorm';
import { PartnerProject } from '../../src/db/entity';
import { investorModel, partnerProjectModel } from '../../src/db/models';

export const populatePartnerProject = async () => {
  const partnerProjectRepository = getRepository(PartnerProject);
  const investor = await investorModel.findOneByParams({ username: 'username1' });

  const partnerProjects = [
    {
      id: 1,
      linkTitle: 'partnerProject-one',
      name: 'partnerProject-one',
      logo: 'string',
      verificationIcon: false,
      shortDescription: 'partnerProject 1st investor is an owner',
      projectDescription: 'partnerProject 1st investor is an owner',
      socialDescription: 'partnerProject',
      loyaltyProjects: [],
      investorId: investor?.id,
    },
  ];

  for (const elem of partnerProjects) {
    const partnerProject = await partnerProjectModel.create(elem as PartnerProject);
    await partnerProjectRepository.save(partnerProject);
  }
};
