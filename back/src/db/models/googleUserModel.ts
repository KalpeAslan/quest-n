import { getRepository } from 'typeorm';

import { GoogleUser } from '../entity';

interface CreateGoogleUserDto {
  googleId: string;
  googleUsername: string;
  email: string;
  investorId: number;
}

class GoogleUserModel {
  getByGoogleId(googleId: string) {
    return getRepository(GoogleUser).findOne({
      where: { googleId },
      relations: ['investor', 'investor.twoFactorAuth'],
    });
  }

  create(createGoogleUserData: CreateGoogleUserDto) {
    const googleUser = getRepository(GoogleUser).create(createGoogleUserData);
    return getRepository(GoogleUser).save(googleUser);
  }

  getByEmail(email: string) {
    return getRepository(GoogleUser).findOne({
      where: { email },
    });
  }

  getByInvestorId(investorId: number) {
    return getRepository(GoogleUser).findOne({ investorId });
  }

  deleteByInvestorId(investorId: number) {
    return getRepository(GoogleUser).delete({ investorId });
  }

  update(discordToken: GoogleUser) {
    return getRepository(GoogleUser).save(discordToken);
  }
}

export const googleUserModel = new GoogleUserModel();
