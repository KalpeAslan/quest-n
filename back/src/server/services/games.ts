import { createHash } from 'crypto';
import { investorModel, tokensStorageHistoryModel } from '../../db/models';
import { getConfig } from '../config';
import { getCurrentLevelByInvestor } from './investor';
import axios, { AxiosResponse } from 'axios';
import { GamesBetDto, GamesCancelDto, GamesInfoDto, GamesWinDto } from '../../db/types/interfaces/GamesDto';
import { updateTokensStorage } from './tokenStorage';
import { TokensStorageHistoryTypes } from '../../db/types/interfaces/interface-index';
import { v4 as uuidv4 } from 'uuid';
import { hideWallet } from '../helpers';
import { UnauthorizedError, UnauthorizedErrorKeys } from '../errors';

const { ONLYPLAY_SECRET_KEY, ONLYPLAY_PROJECT_ID, ONLYPLAY_API_URL, APP_HOST, S3_BUCKET } = getConfig();

export const getIframeResponse = async (investorId: number, gameBundle: string, language?: string) => {
  const investor = await investorModel.getInvestorProfileInfo(investorId);
  const currentLevel = await getCurrentLevelByInvestor(investor);

  const token = uuidv4();

  const body = {
    game_bundle: gameBundle,
    partner_id: ONLYPLAY_PROJECT_ID,
    user_id: String(investor.id),
    balance: investor.tokensStorage.amount * 100,
    currency: 'AQ',
    decimals: 2,
    lang: language || 'en',
    nickname: investor.username || (investor.walletUser?.address ? hideWallet(investor.walletUser.address) : ''),
    avatar: `http://${S3_BUCKET}.s3.amazonaws.com/${currentLevel.avatar}`,
    token,
    callback_url: `${APP_HOST}api/games`,
  };

  const signature = getSignature(body);

  try {
    const result: AxiosResponse<{
      success: boolean;
      url: string;
      session_id: number;
    }> = await axios.post(ONLYPLAY_API_URL, { ...body, sign: signature });

    await investorModel.addSession(result.data.session_id, investorId);

    return { success: result.data.success, url: result.data.url };
  } catch (error) {
    return null;
  }
};

export const getGameInvestorInfo = async (
  infoDto: GamesInfoDto,
): Promise<
  | {
      success: boolean;
      balance: number;
    }
  | {
      success: boolean;
      code: number;
      message: string;
    }
> => {
  try {
    const investor = await getInvestorProfileFromSessionId({
      sessionId: infoDto.session_id,
      investorId: Number(infoDto.user_id),
    });

    const signature = getSignature(infoDto);

    if (signature !== infoDto.sign)
      throw new UnauthorizedError(UnauthorizedErrorKeys.SessionExpired, 'session is expired');

    return {
      success: true,
      balance: investor.tokensStorage.amount * 100,
    };
  } catch (error) {
    return {
      success: false,
      code: 2401,
      message: 'Session not found or expired.',
    };
  }
};

export const postGameBet = async (
  betDto: GamesBetDto,
): Promise<
  | {
      success: boolean;
      balance: number;
    }
  | {
      success: boolean;
      code: number;
      message: string;
    }
> => {
  try {
    const investor = await getInvestorProfileFromSessionId({
      sessionId: betDto.session_id,
      investorId: Number(betDto.user_id),
    });

    const signature = getSignature(betDto);

    if (signature !== betDto.sign)
      throw new UnauthorizedError(UnauthorizedErrorKeys.SessionExpired, 'session is expired');

    const oldTransaction = await tokensStorageHistoryModel.getByTransactionIdAndType(
      betDto.tx_id,
      TokensStorageHistoryTypes.gameBet,
    );

    if (oldTransaction)
      return {
        success: true,
        balance: investor.tokensStorage.amount * 100,
      };

    if (investor.tokensStorage.amount - betDto.amount / 100 < 0)
      return {
        success: false,
        code: 5001,
        message: 'Insufficient funds',
      };

    const tokenStorage = await updateTokensStorage(investor.id, -(betDto.amount / 100));

    await tokensStorageHistoryModel.updateTokensHistory({
      tokenAmount: betDto.amount / -100,
      tokenStorageId: tokenStorage.id,
      type: TokensStorageHistoryTypes.gameBet,
      transactionId: betDto.tx_id,
    });

    return {
      success: true,
      balance: tokenStorage.amount * 100,
    };
  } catch (error) {
    return {
      success: false,
      code: 2401,
      message: 'Session not found or expired.',
    };
  }
};

export const postGameWin = async (
  winDto: GamesWinDto,
): Promise<{
  result:
    | {
        success: boolean;
        balance: number;
      }
    | {
        success: boolean;
        code: number;
        message: string;
      };
  investorId: number | null;
}> => {
  try {
    const investor = await getInvestorProfileFromSessionId({
      sessionId: winDto.session_id,
      investorId: Number(winDto.user_id),
    });

    const signature = getSignature(winDto);

    if (signature !== winDto.sign)
      throw new UnauthorizedError(UnauthorizedErrorKeys.SessionExpired, 'session is expired');

    const oldTransaction = await tokensStorageHistoryModel.getByTransactionIdAndType(
      winDto.tx_id,
      TokensStorageHistoryTypes.gameWin,
    );

    if (oldTransaction)
      return {
        result: {
          success: true,
          balance: investor.tokensStorage.amount * 100,
        },
        investorId: investor.id,
      };

    const betTransaction = await tokensStorageHistoryModel.getByTransactionIdAndType(
      winDto.ref_tx_id,
      TokensStorageHistoryTypes.gameBet,
    );

    if (!betTransaction)
      return {
        result: {
          success: false,
          code: 4005,
          message: 'Referent transaction not found',
        },
        investorId: investor.id,
      };

    const tokenStorage = await updateTokensStorage(investor.id, winDto.amount / 100);

    await tokensStorageHistoryModel.updateTokensHistory({
      tokenAmount: winDto.amount / 100,
      tokenStorageId: tokenStorage.id,
      type: TokensStorageHistoryTypes.gameWin,
      transactionId: winDto.tx_id,
    });

    return {
      result: {
        success: true,
        balance: tokenStorage.amount * 100,
      },
      investorId: investor.id,
    };
  } catch (error) {
    return {
      result: {
        success: false,
        code: 2401,
        message: 'Session not found or expired.',
      },
      investorId: null,
    };
  }
};

export const postGameCancel = async (
  cancelDto: GamesCancelDto,
): Promise<
  | {
      success: boolean;
      balance: number;
    }
  | {
      success: boolean;
      code: number;
      message: string;
    }
> => {
  try {
    const investor = await getInvestorProfileFromSessionId({
      sessionId: cancelDto.session_id,
      investorId: Number(cancelDto.user_id),
    });

    const signature = getSignature(cancelDto);

    if (signature !== cancelDto.sign)
      throw new UnauthorizedError(UnauthorizedErrorKeys.SessionExpired, 'session is expired');

    const oldTransaction = await tokensStorageHistoryModel.getByTransactionIdAndType(
      cancelDto.tx_id,
      TokensStorageHistoryTypes.gameCancel,
    );

    if (oldTransaction)
      return {
        success: true,
        balance: investor.tokensStorage.amount * 100,
      };

    const transactionToCancel = await tokensStorageHistoryModel.getByTransactionIdAndType(cancelDto.ref_tx_id);

    if (!transactionToCancel)
      return {
        success: false,
        code: 4005,
        message: 'Referent transaction not found',
      };

    const tokenStorage = await updateTokensStorage(investor.id, -transactionToCancel.amount);

    await tokensStorageHistoryModel.updateTokensHistory({
      tokenAmount: -transactionToCancel.amount,
      tokenStorageId: tokenStorage.id,
      type: TokensStorageHistoryTypes.gameCancel,
      transactionId: cancelDto.tx_id,
    });

    return {
      success: true,
      balance: tokenStorage.amount * 100,
    };
  } catch (error) {
    return {
      success: false,
      code: 2401,
      message: 'Session not found or expired.',
    };
  }
};

const getValidValue = (value: any) => {
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'string' || typeof value === 'number') return value;
  return JSON.stringify(value);
};

const getSignature = (object: Record<string, any>) => {
  const keys = Object.keys(object).sort((a, b) => a.localeCompare(b));

  const stringToSign =
    keys.reduce((acc, key) => {
      if (key === 'sign') return acc;
      acc += key + getValidValue(object[key]);
      return acc;
    }, '') + ONLYPLAY_SECRET_KEY;

  return createHash('sha1').update(stringToSign).digest('hex');
};

const getInvestorProfileFromSessionId = async ({
  sessionId,
  investorId,
}: {
  sessionId: number;
  investorId: number;
}) => {
  const investorBySession = await investorModel.getByInvestorIdAndSessionId(sessionId, investorId);
  if (!investorBySession) throw new UnauthorizedError(UnauthorizedErrorKeys.SessionExpired, 'session is expired');
  const investor = await investorModel.getInvestorProfileInfo(investorBySession.id);

  return investor;
};
