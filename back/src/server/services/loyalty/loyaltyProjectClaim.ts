import { LoyaltyReward } from '../../../db/entity';
import { loyaltyProjectModel, walletUserModel } from '../../../db/models';
import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';
import { onChainTransactionsHistoryModel } from '../../../db/models/onChainTransactionsHistoryModel';
import { TokenStandardDto } from '../../../db/types/interfaces/contractDto';
import { QuestType } from '../../../db/types/interfaces/loyalty';
import { ClaimConfirmDto } from '../../../db/types/interfaces/loyalty/LoyaltyProjectDto';
import { getConfig } from '../../config';
import {
  BadRequestError,
  BadRequestErrorKeys,
  ConflictError,
  ConflictErrorKeys,
  ForbiddenError,
  ForbiddenErrorKeys,
  UnauthorizedError,
  UnauthorizedErrorKeys,
} from '../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import {
  getClaimHash,
  getERC1155Hash,
  getErc20Hash,
  getErc721Hash,
  getQuestERC1155Rewards,
  getQuestErc20Rewards,
  getQuestErc721Rewards,
} from '../blockchain/reward/alphaTreasury';
import { getInvestorProgress } from './loyaltyProject';
import Web3 from 'web3';
import { OnchainTransactionsHistory } from '../../../db/entity/OnchainTransactionHistory';
import { exponentToNumber } from '../../helpers/common.utils';
import { NotificationsServerService } from '../notifications.service';
import { luckyDrawProgressModel } from '../../../db/models/luckyDrawProgress.model';

const web3 = new Web3();

const { CONTRACT_PRIVATE_KEY } = getConfig();

export const confirmRewardClaiming = async (
  questLinkTitle: string,
  investorId: number,
  { rewardId, transactionHash }: ClaimConfirmDto,
) => {
  const reward = await loyaltyRewardModel.getById(rewardId, ['loyaltyProject']);
  if (!reward) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Reward not found');

  if (reward.loyaltyProject.linkTitle !== questLinkTitle)
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Quest not found');

  const historyItem = await onChainTransactionsHistoryModel.findOneByRewardIdAndInvestorId(rewardId, investorId);
  if (!historyItem) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Onchain transaction not found');

  await onChainTransactionsHistoryModel.updateTransactionHash(rewardId, investorId, transactionHash);

  return { ...historyItem, transactionHash } as OnchainTransactionsHistory;
};

export const claimReward = async (questLinkTitle: string, investorId: number, rewardId: number) => {
  const quest = await loyaltyProjectModel.getByLinkTitleShort(questLinkTitle);
  if (!quest) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Quest not found');

  if (
    (!quest.claimingEndAt && !quest.endAt) ||
    new Date(quest.claimingStartAt || quest.endAt).getTime() > new Date().getTime() ||
    (quest.claimingEndAt && new Date(quest.claimingEndAt).getTime() < new Date().getTime())
  )
    throw new ForbiddenError(ForbiddenErrorKeys.NotClaimingPeriod);

  const transaction = await onChainTransactionsHistoryModel.findOneByRewardIdAndInvestorId(rewardId, investorId);
  if (transaction?.transactionHash) throw new ConflictError(ConflictErrorKeys.TransactionAlreadyExists);

  const reward = await loyaltyRewardModel.getById(rewardId, ['contract']);
  if (!reward) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Reward not found');

  const { place, earnedPoints } = await getInvestorProgress(quest.id, investorId);

  if (quest.projectType === QuestType.Scoreboard) {
    if (place > reward.endPlace || place < reward.startPlace) throw new ForbiddenError(ForbiddenErrorKeys.NotAWinner);
    return claim(reward, investorId, transaction?.id);
  } else if (quest.projectType === QuestType.LuckyDraw) {
    const luckyDrawProgress = await luckyDrawProgressModel.getByInvestorIdAndLoyaltyProjectId(investorId, quest.id);

    if (!luckyDrawProgress) throw new ForbiddenError(ForbiddenErrorKeys.NotAWinner);

    return claim(reward, investorId, transaction?.id);
  } else {
    if (!quest.threshold || earnedPoints < quest.threshold) throw new ForbiddenError(ForbiddenErrorKeys.NotAWinner);
    return claim(reward, investorId, transaction?.id);
  }
};

const claim = (reward: LoyaltyReward, investorId: number, transactionId?: number) => {
  if (
    reward.contract?.standard &&
    [TokenStandardDto.ERC1155, TokenStandardDto.ERC721].includes(reward.contract.standard)
  ) {
    return claimNftReward(reward, investorId, transactionId);
  }
  if (reward.contract?.standard === TokenStandardDto.ERC20) {
    return claimTokenReward(reward, investorId, transactionId);
  }
  return null;
};

const claimNftReward = async (reward: LoyaltyReward, investorId: number, transactionId?: number) => {
  if (!reward.contract?.address || !reward.contract?.chainId || !reward.contract?.standard || !reward.loyaltyProjectId)
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Reward not found');

  const walletUser = await walletUserModel.getByInvestorId(investorId);

  if (!walletUser) throw new UnauthorizedError(UnauthorizedErrorKeys.WalletNotConnected);

  const isErc721 = reward.contract.standard === TokenStandardDto.ERC721;

  const getQuestRewards = isErc721 ? getQuestErc721Rewards : getQuestERC1155Rewards;

  const existedContractTokens = await getQuestRewards(
    reward.contract.address,
    reward.contract.chainId,
    reward.loyaltyProjectId,
  );

  const existedDbTokens = reward.tokenIds.filter((item) => existedContractTokens.includes(BigInt(item)));

  if (existedDbTokens.length < reward.amount) throw new BadRequestError(BadRequestErrorKeys.InsufficientTokenAmount);

  const tokensToClaim: number[] = [];
  const tokenAmounts: number[] = [];

  for (let i = 0; i < reward.amount; i++) {
    const tokenIndex = getRandomInt(existedDbTokens.length);
    tokensToClaim.push(existedDbTokens[tokenIndex]);
    tokenAmounts.push(1);
    existedDbTokens.splice(tokenIndex, 1);
  }

  if (transactionId) {
    await onChainTransactionsHistoryModel.update(transactionId, {
      amount: reward.amount,
      loyaltyRewardId: reward.id,
      investorId,
      tokenIds: tokensToClaim,
    });
  } else {
    await onChainTransactionsHistoryModel.create({
      amount: reward.amount,
      loyaltyRewardId: reward.id,
      investorId,
      tokenIds: tokensToClaim,
    });
  }

  const getRewardHash = isErc721 ? getErc721Hash : getERC1155Hash;

  const rewardHash = await getRewardHash(reward.contract.address, reward.contract.chainId, tokensToClaim, tokenAmounts);

  const claimHash = await getClaimHash(
    reward.contract.chainId,
    walletUser.address,
    reward.loyaltyProjectId,
    reward.id,
    investorId,
    rewardHash,
  );

  const signer = web3.eth.accounts.privateKeyToAccount(CONTRACT_PRIVATE_KEY);

  const { signature } = signer.sign(claimHash);

  await NotificationsServerService.findAndReadOnBoardingNotification(investorId);

  return {
    questId_: reward.loyaltyProjectId,
    rewardId_: reward.id,
    userId_: investorId,
    token_: reward.contract.address,
    tokenIds_: tokensToClaim,
    tokenAmounts_: tokenAmounts,
    treasurySignature_: signature,
  };
};

const claimTokenReward = async (reward: LoyaltyReward, investorId: number, transactionId?: number) => {
  if (!reward.contract?.address || !reward.contract?.chainId || !reward.contract?.standard || !reward.loyaltyProjectId)
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Reward not found');

  const walletUser = await walletUserModel.getByInvestorId(investorId);

  if (!walletUser) throw new UnauthorizedError(UnauthorizedErrorKeys.WalletNotConnected);

  const existedContractTokens = await getQuestErc20Rewards(
    reward.contract.address,
    reward.contract.chainId,
    reward.loyaltyProjectId,
  );

  if (existedContractTokens < reward.amount) throw new BadRequestError(BadRequestErrorKeys.InsufficientTokenAmount);

  if (transactionId) {
    await onChainTransactionsHistoryModel.update(transactionId, {
      amount: reward.amount,
      loyaltyRewardId: reward.id,
      investorId,
    });
  } else {
    await onChainTransactionsHistoryModel.create({
      amount: reward.amount,
      loyaltyRewardId: reward.id,
      investorId,
    });
  }

  const rewardHash = await getErc20Hash(
    reward.contract.address,
    reward.contract.chainId,
    exponentToNumber(reward.amount * 10 ** (reward.contract.decimals || 0)),
  );

  const claimHash = await getClaimHash(
    reward.contract.chainId,
    walletUser.address,
    reward.loyaltyProjectId,
    reward.id,
    investorId,
    rewardHash,
  );

  const signer = web3.eth.accounts.privateKeyToAccount(CONTRACT_PRIVATE_KEY);

  const { signature } = signer.sign(claimHash);

  await NotificationsServerService.findAndReadOnBoardingNotification(investorId);

  return {
    questId_: reward.loyaltyProjectId,
    rewardId_: reward.id,
    userId_: investorId,
    token_: reward.contract.address,
    amount_: reward.amount,
    treasurySignature_: signature,
  };
};

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
