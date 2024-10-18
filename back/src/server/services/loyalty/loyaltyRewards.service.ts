import { getConnection, getRepository } from 'typeorm';
import { Investor, LoyaltyProject, Contract } from '../../../db/entity';
import { LoyaltyReward } from '../../../db/entity/LoyaltyReward';
import { contractModel } from '../../../db/models';
import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';
import { CreateLoyaltyRewardDto } from '../../../db/types/interfaces/loyalty/reward';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { Logger } from '../logger';
import { dataToToken } from './tokens';
import { TokenType } from '../../../db/types/interfaces/loyalty';

const log = new Logger();

export const createLoyaltyRewards = async (
  loyaltyProject: LoyaltyProject,
  rewards: CreateLoyaltyRewardDto[],
  investor: Investor,
  deleteBefore?: boolean,
) => {
  const isRewardsExist = await computeIsRewardsExist(loyaltyProject.id);

  if (isRewardsExist) {
    deleteBefore = true;
  }

  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();

  const removeLoyaltyRewards = async (loyaltyProjectId: number, excludeRewardIds: Array<number | null>) => {
    const repository = getRepository(LoyaltyReward);
    const allRewardsByProjects = await repository.find({
      loyaltyProjectId,
    });

    const idsForDelete = allRewardsByProjects.reduce((acc, currentValue) => {
      if (!excludeRewardIds.includes(currentValue.id)) {
        acc.push(currentValue.id);
      }
      return acc;
    }, [] as number[]);
    return Promise.all(
      idsForDelete.map((id) =>
        queryRunner.manager.delete(LoyaltyReward, {
          id,
          loyaltyProjectId,
        }),
      ),
    );
  };

  try {
    if (deleteBefore) {
      await removeLoyaltyRewards(
        loyaltyProject.id,
        rewards.map((reward) => reward.id as number),
      );
    }
    for (const reward of rewards) {
      let contract: Contract | null = null;
      if (reward.type === TokenType.Whitelist && !reward.contractId) {
        if (!investor) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Investor is not provided');

        const tokenToSave = await dataToToken(
          {
            name: '',
            symbol: reward.whiteListingName as string,
            investorId: investor?.id as number,
            type: TokenType.Whitelist,
          },
          investor,
        );
        contract = (await contractModel.create(tokenToSave)) as Contract;
        reward.contractId = contract.id;
      } else {
        contract = (await contractModel.getById(Number(reward.contractId))) as Contract;
      }
      if (!contract) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, "token doesn't exist");

      if (reward.amount < 0) {
        throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'amount can not be less than 0');
      }

      const loyaltyReward = new LoyaltyReward();
      loyaltyReward.amount = (contract.type === TokenType.Whitelist ? 1 : reward.amount) || 1;
      loyaltyReward.isClaimable = reward.isClaimable;
      loyaltyReward.description = reward.description;
      loyaltyReward.startPlace = reward.startPlace ?? 0;
      loyaltyReward.endPlace = reward.endPlace ?? 1;
      loyaltyReward.loyaltyProjectId = loyaltyProject.id;
      loyaltyReward.contractId = reward.contractId;

      if (reward.id) {
        const existingReward = await loyaltyRewardModel.getById(Number(reward.id || 0));
        if (!existingReward)
          throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Provided id is not valid');
        loyaltyReward.id = Number(reward.id);
      }

      log.info(`createLoyaltyReward ${loyaltyReward}`);
      await queryRunner.manager.save(LoyaltyReward, loyaltyReward);
    }

    await queryRunner.commitTransaction();
  } catch (error) {
    log.error(`rollbackTransaction ${error}`);
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export const updateLoyaltyRewads = async (
  loyaltyProject: LoyaltyProject,
  rewards: CreateLoyaltyRewardDto[],
  investor: Investor,
) => {
  await createLoyaltyRewards(loyaltyProject, rewards, investor, true);
};

const computeIsRewardsExist = async (loyaltyProjectId: number) => {
  const rewards = await loyaltyRewardModel.getAllByProjectId(loyaltyProjectId);
  return !!rewards.length;
};
