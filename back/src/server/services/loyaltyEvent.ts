import { getRepository } from 'typeorm';

import { LoyaltyEvent } from '../../db/entity';
import { GetLoyaltyEvent } from '../../db/types/interfaces/loyalty';

import { getConfig } from '../config';

const { S3_BUCKET } = getConfig();

export const getLoyaltyEvent = async (): Promise<GetLoyaltyEvent> => {
  const loyaltyEvent = await getRepository(LoyaltyEvent).findOneOrFail({
    where: {
      status: true,
    },
  });

  return responseLoyaltyEvent(loyaltyEvent);
};

const responseLoyaltyEvent = (event: LoyaltyEvent) => {
  return {
    title: event.title,
    description: event.description,
    bucket: S3_BUCKET,
  };
};
