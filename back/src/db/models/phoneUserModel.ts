import { getRepository } from 'typeorm';

import { PhoneUser } from '../entity';

interface CreatePhoneUserDto {
  phone: string;
  password: string;
  investorId?: number;
}

class PhoneUserModel {
  getByPhone(phone: string) {
    return getRepository(PhoneUser).findOne({
      where: { phone },
      relations: ['investor', 'investor.twoFactorAuth'],
    });
  }

  create(createPhoneUserData: CreatePhoneUserDto) {
    const phoneUser = getRepository(PhoneUser).create(createPhoneUserData);
    return getRepository(PhoneUser).save(phoneUser);
  }

  getOneById(id: number) {
    return getRepository(PhoneUser).findOne({ where: { id } });
  }

  update(phoneUser: PhoneUser) {
    return getRepository(PhoneUser).save(phoneUser);
  }

  async setPassword(id: number, password: string) {
    const phoneUser = await getRepository(PhoneUser).findOne({ where: { id } });

    console.log(phoneUser);

    if (phoneUser) {
      phoneUser.password = password;
      return getRepository(PhoneUser).save(phoneUser);
    } else {
      throw new Error('phoneUser by id not found');
    }
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(PhoneUser).delete({ investorId });
  }

  async deleteAll() {
    return await getRepository(PhoneUser).delete({});
  }

  getByInvestorId(investorId: number) {
    return getRepository(PhoneUser).findOne({ investorId });
  }
}

export const phoneUserModel = new PhoneUserModel();
