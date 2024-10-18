import axios from 'axios';
import { LoyaltyTask } from '../../../../../db/entity';
import { GitCoinTaskBody } from '../../../../../db/types/interfaces/loyalty/tasks';
import { getConfig } from '../../../../config';

export const isGitCoinLoyaltyTask = async (
  wallet: string,
  loyaltyTask: LoyaltyTask,
): Promise<{ status: boolean; json?: { wallet: string } }> => {
  const body = loyaltyTask.body as GitCoinTaskBody;

  const config = getConfig();
  const scorerId = body.gitCoinScorerId || config.GIT_COIN_SCORE_ID;
  const apiKey = body.gitCoinApiKey || config.GIT_COIN_API_KEY;

  await axios
    .post(
      'https://api.scorer.gitcoin.co/registry/submit-passport',
      {
        address: wallet,
        community: scorerId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        },
      },
    )
    .then((res) => res.data);

  const getResponse = await axios.get(`https://api.scorer.gitcoin.co/registry/score/${scorerId}/${wallet}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
  });

  if (getResponse.data && getResponse.data.score) {
    return {
      status: +getResponse.data.score >= body.threshold,
      json: {
        wallet,
      },
    };
  }

  return { status: false };
};
