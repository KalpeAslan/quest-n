import { googleUserModel } from '../../../db/models/googleUserModel';
import { GoogleEntryDto } from '../../../db/types/interfaces/entry/googleDto';
import { googleApiService } from '../apis/googleApiService';
import { generate2FAEntryResponse, generateEntryResponse } from './jwt';
import { createInvestor } from '../investor';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';
import { emailUserModel } from '../../../db/models/emailUserModel';
import { addInvestorToInviteByEmail } from '../loyalty/partnerProject';

export const googleEntryService = async (googleEntryDto: GoogleEntryDto) => {
  const googleOauthData = await googleApiService.fetchAccessTokenAndUser(googleEntryDto.code);
  const emailUser = await emailUserModel.getByEmail(googleOauthData.email);
  const existedGoogleUser = await googleUserModel.getByGoogleId(googleOauthData.id);

  // if (
  //   !existedGoogleUser &&
  //   emailUser?.confirmed &&
  //   emailUser?.investor?.twoFactorAuth?.confirmed &&
  //   emailUser?.investorId
  // ) {
  //   return generate2FAEntryResponse(
  //     emailUser.investorId,
  //     '', // TODO: username not exist, refactor generate function
  //     emailUser.investor.twoFactorAuth.phoneNumber,
  //   );
  // } else if (!existedGoogleUser && emailUser?.confirmed && emailUser?.investorId) {
  //   return generateEntryResponse(emailUser.investorId, EntryFlowEnum.Login);
  // }

  if (!existedGoogleUser && emailUser?.confirmed && emailUser?.investorId) {
    const googleUser = await googleUserModel.create({
      investorId: emailUser.investorId,
      googleId: googleOauthData.id,
      googleUsername: googleOauthData.name,
      email: googleOauthData.email,
    });

    return generateEntryResponse(googleUser.investorId, EntryFlowEnum.Create, googleUser.googleUsername);
  }

  if (existedGoogleUser) {
    if (existedGoogleUser.investor.twoFactorAuth?.confirmed) {
      return generate2FAEntryResponse(
        existedGoogleUser.investorId,
        existedGoogleUser.googleUsername,
        existedGoogleUser.investor.twoFactorAuth.phoneNumber,
      );
    }
    return generateEntryResponse(existedGoogleUser.investorId, EntryFlowEnum.Login, existedGoogleUser.googleUsername);
  }

  const investor = await createInvestor();

  await addInvestorToInviteByEmail(googleOauthData.email, investor.id);

  const googleUser = await googleUserModel.create({
    investorId: investor.id,
    googleId: googleOauthData.id,
    googleUsername: googleOauthData.name,
    email: googleOauthData.email,
  });

  return generateEntryResponse(googleUser.investorId, EntryFlowEnum.Create, googleUser.googleUsername);
};
