import { getRepository } from 'typeorm';

import { EmailUser } from '../entity';

interface CreateEmailUserDto {
  email: string;
  password: string;
}

class EmailUserModel {
  async getByEmailJoinedWithTwoFactorAuth(email: string) {
    const emailUsers: EmailUser[] = await getRepository(EmailUser)
      .createQueryBuilder('emailUser')
      .leftJoinAndSelect('emailUser.investor', 'investor')
      .leftJoinAndSelect('investor.twoFactorAuth', 'twoFactorAuth')
      .getMany();

    const emailUser = emailUsers.filter((emailUser) => emailUser.email === email)[0];
    return emailUser;
  }

  getByEmail(email: string) {
    return getRepository(EmailUser).findOne({
      where: { email },
      relations: ['investor', 'investor.twoFactorAuth'],
    });
  }

  async setPassword(id: number, password: string) {
    const emailUser = await getRepository(EmailUser).findOne({ where: { id } });

    if (emailUser) {
      emailUser.password = password;
      return getRepository(EmailUser).save(emailUser);
    } else {
      throw new Error('emailUser by id not found');
    }
  }

  getOneById(id: number) {
    return getRepository(EmailUser).findOne({
      where: { id },
      relations: ['investor', 'investor.twoFactorAuth'],
    });
  }

  create(createEmailUserData: CreateEmailUserDto) {
    const emailUser = getRepository(EmailUser).create(createEmailUserData);
    return getRepository(EmailUser).save(emailUser);
  }

  update(emailUser: EmailUser) {
    return getRepository(EmailUser).save(emailUser);
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(EmailUser).delete({ investorId });
  }

  async deleteAll() {
    return getRepository(EmailUser).delete({});
  }

  getByInvestorId(investorId: number) {
    return getRepository(EmailUser).findOne({ investorId });
  }
}

export const emailUserModel = new EmailUserModel();
