import { twoFactorCodeSendHistoryModel } from '../../../db/models/twoFactorCodeSendHistoryModel';
import { constants } from '../../config/constants';

export const getLimitInfo = async (investorId: number) => {
  const requestsToday = await twoFactorCodeSendHistoryModel.getByInvestorId(investorId);
  if (requestsToday.length === 0)
    return {
      isLimitUsed: false,
      isRetryLimitUsed: false,
    };

  return {
    isLimitUsed: requestsToday.length > constants.smsRequestsLimit,
    isRetryLimitUsed: new Date(requestsToday[0].createdAt) > new Date(new Date().getTime() - 120_000),
  };
};

export const isAvailableTimeToSend = async (investorId: number) => {
  const lastRequest = await twoFactorCodeSendHistoryModel.getLastRequest(investorId);

  if (!lastRequest) return true; // first time
  return new Date(new Date(lastRequest.createdAt).getTime() + 120_000) > new Date();
};
