import axios from 'axios';
import { getConfig } from '../config';
import { investorLevelsRuleModel } from '../../db/models';
import { NotFoundError, NotFoundErrorKeys } from '../errors/NotFoundError';

const config = getConfig();

export const createReferralProfile = async (investorId: number) => {
  const response = await axios.post(`${config.REFERRAL_SERVICE_HOST}/createProfile/`, {
    investor_id: investorId,
  });
  return response.data;
};

export const updateReferralProfile = async (investorId: number, increaseBy: number) => {
  await axios.post(`${config.REFERRAL_SERVICE_HOST}/updateQuestProfits/`, {
    investor_id: investorId,
    increase_by: increaseBy,
  });
};

export const getReferralProfile = async (investorId: number) => {
  const response = await axios.post(
    `${config.REFERRAL_SERVICE_HOST}/getReferralProfile/`,
    {
      investor_id: investorId,
      fields: ['available_to_claim', 'referral_profit', 'referral_code'],
    },
    { timeout: 1000 },
  );

  const result = await response.data;

  return {
    referralProfit: result.fields.referral_profit,
    claimableReferralProfit: result.fields.available_to_claim < 0.01 ? 0 : result.fields.available_to_claim,
    referralCode: result.fields.referral_code,
  };
};

export const becomeReferral = async (referrerCode, investorId: string) => {
  if (!investorId) {
    throw new NotFoundError(
      NotFoundErrorKeys.NotFound,
      'Investor is required to make a request to the referral service',
    );
  }

  const response = await axios.post(`${config.REFERRAL_SERVICE_HOST}/joinReferral/`, {
    investor_id: Number(investorId),
    referrer_code: referrerCode,
  });
  return response.data;
};

export const getInvestorIdByCode = async (referralCode: string) => {
  const response = await axios.post(`${config.REFERRAL_SERVICE_HOST}/getInvestorIDByReferralCode/`, {
    referral_code: referralCode,
  });
  return response.data.investor_id;
};

export const getReferralStats = async (investorId: number) => {
  const response = await axios.post(`${config.REFERRAL_SERVICE_HOST}/getReferralStats/`, {
    investor_id: investorId,
  });

  let referralsCount = 0;
  for (const element of Object.values(response.data.referral_statistics)) {
    referralsCount += element as number;
  }

  const referralsRanksCount = Object.keys(response.data.referral_statistics).length;

  const profile = await axios.post(`${config.REFERRAL_SERVICE_HOST}/getReferralProfile/`, {
    investor_id: investorId,
    fields: ['group_volume', 'referral_code'],
  });
  const levels = (await investorLevelsRuleModel.getAll()).map((level) => {
    return { tokensFrom: level.tokensFrom, name: level.name, number: level.number, avatar: level.avatar };
  });

  return {
    ReferralProfit: {
      referralProfit: response.data.referral_profit,
      referralsCount,
      referralsRanksCount,
      groupVolume: profile.data.fields.group_volume,
      referralsByRanks: response.data.referral_statistics,
    },
    CurrentReferralRank: {
      currentRank: response.data.current_level,
      nextRanks: response.data.next_levels,
      groupVolume: profile.data.fields.group_volume,
      groupVolumeForNextRank: response.data.current_level.max_value,
    },
    ReferralProfitByMonth: getReferralInfoHistory(response.data.profit_statistics),
    code: profile.data.fields.referral_code,
  };
};

const getReferralInfoHistory = async (profitStats: any): Promise<any> => {
  const currentDate = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setFullYear(currentDate.getFullYear() - 1);

  const recentProfitFields = Object.entries(profitStats)
    .filter(([date]) => {
      const [month, year] = date.split('.');
      const dateValue = new Date(Number(year), Number(month) - 1);
      return dateValue >= twelveMonthsAgo && dateValue <= currentDate;
    })
    .map(([date, points]) => ({ date, points }));

  const totalPoints = recentProfitFields.reduce((sum, { points }) => sum + (points as number), 0);
  const averagePoints = totalPoints / recentProfitFields.length;

  return {
    referralProfitByMonth: recentProfitFields, // профит за месяц в течение последних 12 месяцев
    averageByMonth: averagePoints, // средний профит в месяц за последние 12 месяцев
  };
};

export const getReferrerCode = async (investorId: number) => {
  const response = await axios.post(
    `${config.REFERRAL_SERVICE_HOST}/getReferrerCode/`,
    {
      investor_id: investorId,
    },
    { timeout: 1000 },
  );
  return response.data;
};

export const claimProfit = async (investorId: number) => {
  const response = await axios.post(`${config.REFERRAL_SERVICE_HOST}/claimReferralProfit/`, {
    investor_id: investorId,
  });
  return response.data;
};

export const validateReferralCode = async (referralCode: string) => {
  const response = await axios.post(
    `${config.REFERRAL_SERVICE_HOST}/validateReferralCode/`,
    {
      referral_code: referralCode,
    },
    { timeout: 1000 },
  );

  const result = response.data;

  return result.success as boolean;
};
