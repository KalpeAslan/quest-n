import { twoFactorAuthModel } from '../../../db/models/twoFactorAuthModel';

export const saveTwoFactorRecord = async (investorId: number, phoneNumber: string) => {
  const record = await twoFactorAuthModel.findByInvestorId(investorId);
  if (!record)
    return twoFactorAuthModel.save({
      investorId,
      phoneNumber,
    });
  record.phoneNumber = phoneNumber;
  return twoFactorAuthModel.updateSaving(record);
};

export const getTwoFactorRecordByInvestorId = async (investorId: number) => {
  return twoFactorAuthModel.findByInvestorId(investorId);
};

export const confirm2FARecord = (investorId: number) => {
  return twoFactorAuthModel.confirm(investorId);
};

export const confirmDisconnect2FARecord = (investorId: number) => {
  return twoFactorAuthModel.confirmDisconnect(investorId);
};
