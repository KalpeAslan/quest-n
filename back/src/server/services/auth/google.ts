import { BadRequestError, BadRequestErrorKeys, ConflictError, ConflictErrorKeys } from '../../errors';
import { GoogleEntryDto } from '../../../db/types/interfaces/entry/googleDto';
import { googleApiService } from '../apis/googleApiService';
import { googleUserModel } from '../../../db/models';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { countLoginConnections } from '.';
import { addInvestorToInviteByEmail } from '../loyalty/partnerProject';

export const googleLoginService = () => {
  return googleApiService.getAuthUrl();
};

export const googleAccessTokenService = async (googleOauthDto: GoogleEntryDto, investorId: number) => {
  const googleOauthData = await googleApiService.fetchAccessTokenAndUser(googleOauthDto.code);

  const existedGoogleUser = await googleUserModel.getByGoogleId(googleOauthData.id);

  if (existedGoogleUser) {
    throw new ConflictError(ConflictErrorKeys.AccountAlreadyExists, googleOauthData.email);
  }

  await addInvestorToInviteByEmail(googleOauthData.email, investorId);
  return await googleUserModel.create({
    investorId: investorId,
    googleId: googleOauthData.id,
    googleUsername: googleOauthData.name,
    email: googleOauthData.email,
  });
};

export const googleDisconnectUserService = async (investorId: number) => {
  const googleUser = await googleUserModel.getByInvestorId(investorId);
  if (!googleUser) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have google data');

  const countConnections = await countLoginConnections(investorId);
  if (countConnections === 1) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'You cannot disable the only login method');
  }

  await googleUserModel.deleteByInvestorId(investorId);
};
