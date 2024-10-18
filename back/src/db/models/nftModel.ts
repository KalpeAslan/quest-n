import { getRepository } from 'typeorm';
import { Nft } from '../../db/entity';

class NftModel {
  create(nft) {
    return getRepository(Nft).save(nft);
  }

  async getAll() {
    return await getRepository(Nft).find({});
  }

  async getByParams(criteria: Partial<Nft>) {
    return await getRepository(Nft).findOne({
      where: criteria,
    });
  }
}

export const nftModel = new NftModel();
