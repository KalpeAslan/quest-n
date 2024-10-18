import { getRepository } from 'typeorm';

import { GetPartners } from '../../db/types/interfaces/interface-index';
import { Partner } from '../../db/entity/Partner';
import { generateS3Path } from './generateS3Path';

export const getPartners = async (): Promise<GetPartners[]> => {
  const partners = await getRepository(Partner).find({
    order: { priorityNumber: 'ASC' },
  });

  return partners
    .filter((aPartner) => aPartner.status)
    .map((aPartner) => {
      return {
        id: aPartner.id,
        title: aPartner.title,
        description: aPartner.description,
        image: generateS3Path(aPartner.image),
        link: aPartner.link,
        priorityNumber: aPartner.priorityNumber,
      };
    });
};
