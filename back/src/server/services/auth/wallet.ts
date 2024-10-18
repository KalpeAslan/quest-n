import { taskProgressModel, walletUserModel } from '../../../db/models';
import { LoyaltyTaskType } from '../../../db/types/interfaces/loyalty';
import { In, Raw } from 'typeorm';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import {
  BadRequestError,
  BadRequestErrorKeys,
  ConflictError,
  ConflictErrorKeys,
  UnauthorizedError,
  UnauthorizedErrorKeys,
} from '../../errors';
import { countLoginConnections } from '.';
import { verifyMessage } from 'ethers';
import { WalletEntryDto } from '../../../db/types/interfaces/entry/walletEntryDto';
import { constants } from '../../config/constants';

export const connectWallet = async (walletEntryDto: WalletEntryDto, investorId: number) => {
  const signer = verifyMessage(constants.wallet.signedMessage, walletEntryDto.signature);

  if (signer !== walletEntryDto.address) {
    throw new UnauthorizedError(UnauthorizedErrorKeys.InvalidSignature, walletEntryDto.address);
  }

  const existedWalletUser = await walletUserModel.getByWallet(walletEntryDto.address.toLowerCase());

  if (existedWalletUser) {
    throw new ConflictError(ConflictErrorKeys.AccountAlreadyExists, 'wallet is currently in use by another user');
  }

  return await walletUserModel.create({
    address: walletEntryDto.address.toLowerCase(),
    investorId: investorId,
  });
};

export const walletDisconnectUserService = async (investorId: number) => {
  const countConnections = await countLoginConnections(investorId);
  if (countConnections === 1) {
    throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'You cannot disable the only login method');
  }
  const walletUser = await walletUserModel.getByInvestorId(investorId);

  if (!walletUser) {
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'User does not have wallet');
  }

  const taskProgresses = await taskProgressModel.getByConditionsWithRelations(
    {
      investorId,
      loyaltyTask: {
        type: In([
          LoyaltyTaskType.BlockchainUser,
          LoyaltyTaskType.Bridge,
          LoyaltyTaskType.DEXLiquidityProvider,
          LoyaltyTaskType.GitCoin,
          LoyaltyTaskType.NFT,
          LoyaltyTaskType.NativeHolder,
          LoyaltyTaskType.Token,
          LoyaltyTaskType.ValueHolder,
        ]),
      },
      loyaltyProject: {
        endAt: Raw((alias) => `(${alias} > NOW() OR ${alias} IS NULL)`),
      },
    },
    ['loyaltyTask', 'loyaltyProject'],
  );

  await taskProgressModel.removeTaskProgresses(taskProgresses);
  await walletUserModel.deleteByInvestorId(investorId);
};
