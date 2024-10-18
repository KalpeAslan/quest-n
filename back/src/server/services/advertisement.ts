import { getRepository } from 'typeorm';

import { Advertisement } from '../../db/entity';

export const getAdvertisementById = async (advertisementId: string): Promise<Advertisement> => {
  const advertisement = await getRepository(Advertisement).findOneOrFail({
    where: {
      id: advertisementId,
    },
  });

  return advertisement;
};

export const getAdvertisements = async (): Promise<Advertisement[]> => {
  const advertisements = await getRepository(Advertisement).find();

  return advertisements;
};
