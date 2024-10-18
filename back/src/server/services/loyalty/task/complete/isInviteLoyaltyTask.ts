import { customAlphabet } from 'nanoid';

export const isInviteLoyaltyTask = async (requestBody) => {
  const code = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 7)();
  const json = {
    inviteCode: code,
    invitedInvestorIds: [],
    scorePercentage: requestBody.scorePercentage,
  };

  return {
    status: true,
    json,
  };
};
