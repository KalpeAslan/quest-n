import { getConfig } from '../config';
import { Logger } from './logger';
import { isAddress } from 'web3-utils';
import { sign, verify } from 'jsonwebtoken';

import { NumberDictionary, starWars, uniqueNamesGenerator } from 'unique-names-generator';

import { Investor } from '../../db/entity/';
import {
  investorLevelsRuleModel,
  investorModel,
  taskProgressModel,
  tokensStorageModel,
  twitterUserModel,
  walletUserModel,
  googleUserModel,
  emailUserModel,
  phoneUserModel,
  telegramUserModel,
  discordTokenModel,
} from '../../db/models/';

import {
  ResponseInvestorAnalyticsInfoDto,
  ResponseInvestorProfileDto,
  UpdateInvestorDto,
} from '../../db/types/interfaces/InvestorDto';

import { BadRequestError, BadRequestErrorKeys, UnauthorizedError, UnauthorizedErrorKeys } from '../errors';
import { phoneHider } from '../helpers';
import { confirmingVerificationCode } from './2fa';

import { TokensStorageHistoryTypes } from '../../db/types/interfaces/interface-index';
import { calculateActiveQuests, calculateTotalQuests } from './loyalty/loyaltyProject';
import { claimProfit, createReferralProfile, getReferralProfile, getReferrerCode } from './referralProfile';
import { subtractInviteTaskPoints } from './loyalty/task/loyaltyTask';
import { In, Raw } from 'typeorm';
import { LoyaltyTaskType } from '../../db/types/interfaces/loyalty';
import { verifyMessage } from 'ethers';
import { constants } from '../config/constants';
import { confirmDisconnect2FARecord } from './2fa/2faCode';
import { NotificationsServerService } from './notifications.service';
import { getCurrentExperienceLevel } from './experience';
import { getPendingInvitesByInvestorId } from './loyalty/partnerProject';

const { NEW_USER_DAYS_RANGE } = getConfig();

const log = new Logger();

export const getInvestorAnalyticsInfo = async (investorId: number): Promise<ResponseInvestorAnalyticsInfoDto> => {
  const investor = await investorModel.getInvestorAnalyticsInfo(investorId);
  const experienceLevel = await getCurrentExperienceLevel(investorId);

  let referrerCode;
  try {
    referrerCode = await getReferrerCode(investor.id);
  } catch (e) {
    log.error(`Failed on getInvestorProfileInfo.getReferrerCode for investor ${investorId} => ${e}`);
    referrerCode = 'NO-CODE';
  }

  return {
    experienceLevel,
    analytics_id: investor.analytics_id,
    wallet: investor.walletUser?.address || null,
    activeQuests: await calculateActiveQuests(investorId),
    totalQuests: await calculateTotalQuests(investorId),
    investorCreatingTime: new Date(investor.createdAt).getTime(),
    investorId: investor.id,
    isReferral: !!referrerCode,
    username: investor.username,
    referrerCode: referrerCode || null,
    isNewNotificationsExist: await NotificationsServerService.isNewNotificationsExistByInvestorId(investorId),
    pendingInvitesToPartnerProject: await getPendingInvitesByInvestorId(investorId),
  };
};

// TODO: I guess we can optimize DB query here as well
export const getInvestorProfileInfo = async (investorId: number): Promise<ResponseInvestorProfileDto> => {
  const investor = await investorModel.getInvestorProfileInfo(investorId);

  let referralInfo;
  try {
    referralInfo = await getReferralProfile(investorId);
  } catch (e) {
    log.error(`Failed on getInvestorProfileInfo.getReferralProfile for investor ${investorId} => ${e}`);
    referralInfo = {
      referralProfit: 0,
      claimableReferralProfit: 0,
      referralCode: 'NO-CODE',
    };
  }

  let completedQuests: any[] = [];
  for (const tsh of investor.tokensStorage.tokensStorageHistory) {
    if (tsh.type === TokensStorageHistoryTypes.loyaltyProject) {
      if (tsh.loyaltyProject) {
        completedQuests.push({ profit: tsh.amount, title: tsh.loyaltyProject.projectName });
      }
    }
  }
  completedQuests = completedQuests.sort((a, b) => b.amount - a.amount);

  const completedTasks = (await taskProgressModel.getByInvestor(investorId)) || [];

  return {
    canBeReferral: canBeReferral(investor.createdAt),
    connectedAccounts: {
      twitter: investor.twitterUsers?.twitterUsername || null,
      discord: investor.discordTokens?.discordUsername || null,
      telegram: investor.telegramUser?.telegramUsername || null,
      email: investor.emailUser?.email || null,
      phone: investor.phoneUser?.phone || null,
      google: investor.googleUser?.email || null,
    },
    referralInfo: referralInfo,
    questInfo: {
      questProfit: investor.tokensStorage.amount,
      completedQuests: completedQuests,
      completedTasksNumber: completedTasks.length,
    },
    security: {
      twoFactorAuth: !!investor.twoFactorAuth?.confirmed,
      phoneNumber: investor.twoFactorAuth?.confirmed ? phoneHider(investor.twoFactorAuth?.phoneNumber) : null,
    },
  };
};

export const updateInvestor = async (investorId: number, updatedInvestorDto: UpdateInvestorDto) => {
  const investor = await investorModel.getByInvestorIdOrFail(investorId);

  if (updatedInvestorDto.username) {
    const usernameIsUnique = await isUsernameUnique(updatedInvestorDto.username);
    if (!usernameIsUnique) throw new BadRequestError(BadRequestErrorKeys.EmailAlreadyExist);
  }

  const walletUser = await updateInvestorWallet({
    wallet: updatedInvestorDto.wallet ? updatedInvestorDto.wallet?.toLocaleLowerCase() : updatedInvestorDto.wallet,
    signature: updatedInvestorDto.signature,
    investor,
  });

  const updatedInvestor: Investor = {
    ...investor,
    username: updatedInvestorDto.username || investor.username,
    walletUser,
  } as Investor;

  await investorModel.update(updatedInvestor);
};

export const createInvestor = async () => {
  const username = await generateUniqueRandomUsername();
  const investor = await investorModel.create({ username });
  await tokensStorageModel.create(investor.id);

  return investor;
};

export const deleteInvestor = async (investorId: number, deleteToken: string | undefined) => {
  const investor = await investorModel.getByInvestorIdOrFailWithRelations(investorId, ['twoFactorAuth']);

  try {
    if (investor.twoFactorAuth?.confirmed) {
      if (!deleteToken) {
        throw new BadRequestError(BadRequestErrorKeys.UserHasTwoFactorAuth);
      }
      const { investorId: decryptedInvestorId } = verify(
        deleteToken,
        `remove_${investor.twoFactorAuth.phoneNumber}`,
      ) as {
        investorId: number;
      };
      if (decryptedInvestorId !== investor.id) {
        throw new BadRequestError(BadRequestErrorKeys.WrongDeleteToken);
      }
    }
  } catch (error) {
    throw new BadRequestError(BadRequestErrorKeys.WrongDeleteToken);
  }

  await discordTokenModel.deleteByInvestorId(investorId);
  await emailUserModel.deleteByInvestorId(investorId);
  await googleUserModel.deleteByInvestorId(investorId);
  await phoneUserModel.deleteByInvestorId(investorId);
  await telegramUserModel.deleteByInvestorId(investorId);
  await twitterUserModel.deleteByInvestorId(investorId);
  await walletUserModel.deleteByInvestorId(investorId);

  await taskProgressModel.getByConditionsWithRelations(
    {
      investorId,
      loyaltyProject: {
        endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
      },
    },
    ['loyaltyProject'],
  );
};

export const deletingInvestorWith2FA = async (investorId: number, code: string) => {
  const investor = await investorModel.getByInvestorIdOrFailWithRelations(investorId, ['twoFactorAuth']);
  if (!investor.twoFactorAuth?.confirmed) throw new BadRequestError(BadRequestErrorKeys.UserHasNotTwoFactorAuth);

  const isCodeValid = await confirmingVerificationCode(investorId, code);
  if (!isCodeValid) throw new BadRequestError(BadRequestErrorKeys.CodeIsNotValid);

  await confirmDisconnect2FARecord(investorId);

  return {
    deleteToken: sign({ investorId }, `remove_${investor.twoFactorAuth.phoneNumber}`, { expiresIn: '60m' }),
  };
};

export const claimReferralProfit = async (investorId: Investor['id']) => {
  await claimProfit(investorId);
  const referralProfile = await getReferralProfile(investorId);
  return { referralProfit: referralProfile.referralProfit };
};

export const getCurrentLevelByInvestor = async (investor: Investor) => {
  const levels = (await investorLevelsRuleModel.getAll()).map((level) => {
    return { tokensFrom: level.tokensFrom, name: level.name, number: level.number, avatar: level.avatar };
  });
  return defineCurrentLevel(levels, investor.tokensStorage.amount);
};

const generateUniqueRandomUsername = async () => {
  let isGenerated = false;
  let name: string;
  do {
    const numberDictionary = NumberDictionary.generate({ min: 10, max: 9999 });
    name = uniqueNamesGenerator({
      dictionaries: [starWars, numberDictionary],
      separator: '_',
    });
    const uniqueName = await isUsernameUnique(name);
    if (uniqueName) isGenerated = true;
  } while (!isGenerated);

  return name;
};

export const isUsernameUnique = async (username: string) => {
  const record = await investorModel.getByUsername(username);
  return !record;
};

export const canBeReferral = (createdAt: Date) => {
  const investorCreatedWithDelay = new Date(
    new Date(createdAt).getTime() + (NEW_USER_DAYS_RANGE || 7) * 24 * 60 * 1000,
  );
  const today = new Date();
  // TODO: return referralInfo.referrals.length === 0 && !referralInfo.referrer;
  return investorCreatedWithDelay > today;
};

const defineCurrentLevel = (
  levels: {
    tokensFrom: number;
    name: string;
    number: number;
    avatar: string;
  }[],
  tokenAmount: number,
) => {
  return levels[levels.findIndex((level) => level.tokensFrom > tokenAmount) - 1] || levels[levels.length - 1];
};

export const updateInvestorWallet = async ({
  wallet,
  signature,
  investor,
}: {
  wallet?: string | null;
  signature?: string | null;
  investor: Investor;
}) => {
  if (wallet) {
    if (!isAddress(wallet) || !signature) throw new BadRequestError(BadRequestErrorKeys.WrongWallet);
    const signer = verifyMessage(constants.wallet.signedMessage, signature);

    if (signer.toLocaleLowerCase() !== wallet)
      throw new UnauthorizedError(UnauthorizedErrorKeys.InvalidSignature, wallet);

    if (wallet === investor.walletUser?.address) return investor.walletUser;

    const investorWithSameWallet = await investorModel.getByWallet(wallet);
    if (investorWithSameWallet && investorWithSameWallet.walletUser) {
      if (investor.id !== investorWithSameWallet.id && investor.username && investorWithSameWallet.username)
        throw new BadRequestError(BadRequestErrorKeys.WalletAlreadyUsed);

      if (investor.username && !investorWithSameWallet.username) {
        await subtractInviteTaskPoints(investor.id, 'wallet');
        const questOnChainTasks = await taskProgressModel.getByConditionsWithRelations(
          {
            investorId: investor.id,
            loyaltyTask: {
              type: In([
                LoyaltyTaskType.Token,
                LoyaltyTaskType.NFT,
                LoyaltyTaskType.BlockchainUser,
                LoyaltyTaskType.NativeHolder,
                LoyaltyTaskType.ValueHolder,
                LoyaltyTaskType.DEXLiquidityProvider,
              ]),
              endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
            },
          },
          ['loyaltyTask'],
        );

        await taskProgressModel.removeTaskProgresses(questOnChainTasks);

        await walletUserModel.deleteById(investorWithSameWallet.walletUser.id);
      }
    }

    if (investor.walletUser) {
      await subtractInviteTaskPoints(investor.id, 'wallet');
      const questOnChainTasks = await taskProgressModel.getByConditionsWithRelations(
        {
          investorId: investor.id,
          loyaltyTask: {
            type: In([
              LoyaltyTaskType.Token,
              LoyaltyTaskType.NFT,
              LoyaltyTaskType.BlockchainUser,
              LoyaltyTaskType.NativeHolder,
              LoyaltyTaskType.ValueHolder,
              LoyaltyTaskType.DEXLiquidityProvider,
            ]),
            endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
          },
        },
        ['loyaltyTask'],
      );

      await taskProgressModel.removeTaskProgresses(questOnChainTasks);
      return await walletUserModel.update(investor.walletUser.id, { address: wallet });
    } else {
      return await walletUserModel.create({
        investorId: investor.id,
        address: wallet,
      });
    }
  }
  if (investor.walletUser && (wallet === null || wallet === '')) {
    await subtractInviteTaskPoints(investor.id, 'wallet');
    const questOnChainTasks = await taskProgressModel.getByConditionsWithRelations(
      {
        investorId: investor.id,
        loyaltyTask: {
          type: In([
            LoyaltyTaskType.Token,
            LoyaltyTaskType.NFT,
            LoyaltyTaskType.BlockchainUser,
            LoyaltyTaskType.NativeHolder,
            LoyaltyTaskType.ValueHolder,
            LoyaltyTaskType.DEXLiquidityProvider,
            LoyaltyTaskType.Bridge,
          ]),
          endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
        },
      },
      ['loyaltyTask'],
    );

    await taskProgressModel.removeTaskProgresses(questOnChainTasks);
    await walletUserModel.deleteById(investor.walletUser.id);
    return null;
  }
};
