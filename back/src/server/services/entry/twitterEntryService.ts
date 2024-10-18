import { twitterUserModel } from '../../../db/models/twitterUserModel';
import { TwitterEntryDto } from '../../../db/types/interfaces/entry/twitterDto';
import { twitterApiService } from '../../services/apis/twitterApiService';
import { generate2FAEntryResponse, generateEntryResponse } from './jwt';
import { createInvestor } from '../investor';
import { ConflictError, ConflictErrorKeys } from '../../errors';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';

export const twitterEntryService = async (twitterEntryDto: TwitterEntryDto) => {
  const twitterOathData = await twitterApiService.fetchAuthData(twitterEntryDto);

  const existedTwitterUser = await twitterUserModel.getByTwitterId(twitterOathData.results.user_id);
  if (existedTwitterUser) {
    if (existedTwitterUser.investor.twoFactorAuth?.confirmed) {
      return generate2FAEntryResponse(
        existedTwitterUser.investorId,
        existedTwitterUser.twitterUsername,
        existedTwitterUser.investor.twoFactorAuth.phoneNumber,
      );
    }
    return generateEntryResponse(
      existedTwitterUser.investorId,
      EntryFlowEnum.Login,
      existedTwitterUser.twitterUsername,
    );
  }

  const isTwitterAccountUsed = await twitterUserModel.getAllByTwitterId(twitterOathData.results.user_id);
  if (isTwitterAccountUsed.length > 0) {
    // error only for new users
    const newAccount = isTwitterAccountUsed.find((acc) => acc.investor?.username); // old users don't have a username
    if (newAccount)
      throw new ConflictError(ConflictErrorKeys.AccountAlreadyExists, twitterOathData.results.screen_name);
  }

  const investor = await createInvestor();

  const twitterUser = await twitterUserModel.create({
    investorId: investor.id,
    twitterId: twitterOathData.results.user_id,
    twitterUsername: twitterOathData.results.screen_name,
    oauthAccessToken: twitterOathData.oauthAccessToken,
    oauthAccessTokenSecret: twitterOathData.oauthAccessTokenSecret,
  });

  return generateEntryResponse(twitterUser.investorId, EntryFlowEnum.Create, twitterUser.twitterUsername);
};
