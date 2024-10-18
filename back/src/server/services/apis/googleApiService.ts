import axios from 'axios';
import { URLSearchParams } from 'url';

import { getConfig } from '../../config';
import { constants } from '../../config/constants';
import { ConflictError, ConflictErrorKeys, UnauthorizedError, UnauthorizedErrorKeys } from '../../errors';
import { GoogleEntryDto } from '../../../db/types/interfaces/entry/googleDto';
import { googleUserModel } from '../../../db/models';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = getConfig();

class GoogleApiService {
  getAuthUrl() {
    const rootUrl = constants.google.rootUrl;
    const options = {
      redirect_uri: GOOGLE_CALLBACK_URL,
      client_id: GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: constants.google.authScope.join(' '),
    };

    return {
      authorizationUrl: `${rootUrl}?${new URLSearchParams(options).toString()}`,
    };
  }

  googleGetAuthTokenAndUserService = async (googleOauthDto: GoogleEntryDto, investorId: number) => {
    const googleOauthData = await googleApiService.fetchAccessTokenAndUser(googleOauthDto.code);
    const googleUser = await googleUserModel.getByInvestorId(investorId);

    if (googleUser) {
      throw new ConflictError(ConflictErrorKeys.AccountAlreadyExists, `${googleOauthData.email} already exists`);
    }

    await googleUserModel.create({
      investorId: investorId,
      googleId: googleOauthData.id,
      googleUsername: googleOauthData.name,
      email: googleOauthData.email,
    });

    return {
      googleId: googleOauthData.id,
      email: googleOauthData.email,
    };
  };

  async fetchAccessTokenAndUser(code: string): Promise<{
    id: string;
    email: string;
    name: string;
  }> {
    const tokens = await this.fetchAccessToken(code);

    const googleUser = await axios
      .get(`${constants.google.getApiUserInfo}?alt=json&access_token=${tokens.access_token}`, {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        throw new UnauthorizedError(UnauthorizedErrorKeys.OAuthError, error.message);
      });

    return googleUser;
  }

  private fetchAccessToken(code: string) {
    const url = constants.google.fetchToken;
    const values = {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    };

    return axios
      .post(url, new URLSearchParams(values).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => res.data)
      .catch((error) => {
        throw new UnauthorizedError(UnauthorizedErrorKeys.OAuthError, error.message);
      });
  }
}

export const googleApiService = new GoogleApiService();
