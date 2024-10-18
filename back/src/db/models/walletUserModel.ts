import { getRepository } from 'typeorm';
import { WalletUser } from '../entity';

export class WalletUserModel {
  create(data: Partial<WalletUser>) {
    return getRepository(WalletUser).save(data);
  }

  update(id: number, data: Partial<WalletUser>) {
    return getRepository(WalletUser).update({ id }, data);
  }

  deleteById(id: number) {
    return getRepository(WalletUser).delete({ id });
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(WalletUser).delete({ investorId });
  }

  getByWallet(wallet: string) {
    return getRepository(WalletUser).findOne({
      where: { address: wallet },
      relations: ['investor', 'investor.twoFactorAuth'],
    });
  }

  getByInvestorId(investorId: number) {
    return getRepository(WalletUser).findOne({ investorId });
  }
}
export const walletUserModel = new WalletUserModel();
