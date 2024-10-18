import { getRepository } from 'typeorm';
import { Contract } from '../entity';
import { TokenStandardDto } from '../types/interfaces/contractDto';
import { TokenType } from '../types/interfaces/loyalty';

class ContractModel {
  getAll() {
    return getRepository(Contract).find({
      where: {
        investorId: null,
      },
    });
  }

  getAllWithInvestorId(investorId: number) {
    return getRepository(Contract).find({
      where: [{ investorId: investorId }, { investorId: null }],
    });
  }

  getByConditions(conditions: Partial<Contract>) {
    return getRepository(Contract).find({
      where: conditions,
    });
  }

  getAllWithStandards(standards: string[], investorId: number): Promise<Contract[]> {
    return getRepository(Contract)
      .createQueryBuilder('contract')
      .where('contract.standard IN (:...standards)', { standards })
      .andWhere('contract.isVerified = :isVerified', { isVerified: true })
      .andWhere('(contract.investorId = :investorId OR contract.investorId IS NULL)', {
        investorId: investorId || null,
      })
      .getMany();
  }

  getById(id: number) {
    return getRepository(Contract).findOne({
      id,
    });
  }

  async updateParams(
    contractId: number,
    criteria: {
      name?: string;
      symbol?: string;
      logo?: string;
      chainId?: string;
      isVerified?: boolean;
      address?: string;
      standard?: TokenStandardDto;
      type?: TokenType;
      investorId?: number | null;
    },
  ) {
    return getRepository(Contract).update({ id: contractId }, criteria);
  }

  create(contract: Partial<Contract>) {
    return getRepository(Contract).save(contract);
  }

  update(contract: Partial<Contract>) {
    return getRepository(Contract).save(contract);
  }

  delete(id) {
    return getRepository(Contract).delete({ id });
  }

  getTokensOfInvestor(investorId: number) {
    return getRepository(Contract).find({
      investorId,
    });
  }
}

export const contractModel = new ContractModel();
