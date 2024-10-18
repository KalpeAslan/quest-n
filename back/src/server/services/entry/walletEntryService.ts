import { walletUserModel } from '../../../db/models';
import { constants } from '../../config/constants';
import { UnauthorizedError, UnauthorizedErrorKeys } from '../../errors';
import { hideWallet } from '../../helpers';
import { WalletEntryDto } from '../../../db/types/interfaces/entry/walletEntryDto';
import { EntryFlowEnum } from '../../../db/types/interfaces/interface-index';
import { createInvestor } from '../investor';
import { generateEntryResponse } from './jwt';
import { generate2FAEntryResponse } from './jwt';
import { verifyMessage } from 'ethers';

export const walletEntryService = async (walletEntryDto: WalletEntryDto) => {
  const signer = verifyMessage(constants.wallet.signedMessage, walletEntryDto.signature);

  if (signer !== walletEntryDto.address)
    throw new UnauthorizedError(UnauthorizedErrorKeys.InvalidSignature, walletEntryDto.address);

  const existedWalletUser = await walletUserModel.getByWallet(walletEntryDto.address.toLowerCase());

  if (existedWalletUser) {
    if (existedWalletUser.investor.twoFactorAuth?.confirmed) {
      return generate2FAEntryResponse(
        existedWalletUser.investorId,
        hideWallet(existedWalletUser.address),
        existedWalletUser.investor.twoFactorAuth.phoneNumber,
      );
    }

    return generateEntryResponse(
      existedWalletUser.investorId,
      EntryFlowEnum.Login,
      hideWallet(existedWalletUser.address),
    );
  }

  const investor = await createInvestor();
  const walletUser = await walletUserModel.create({
    address: walletEntryDto.address.toLowerCase(),
    investorId: investor.id,
  });

  return generateEntryResponse(walletUser.investorId, EntryFlowEnum.Create, hideWallet(walletUser.address));
};
