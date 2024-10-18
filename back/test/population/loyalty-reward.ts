import { getRepository } from 'typeorm';
import { LoyaltyProject, LoyaltyReward, Contract } from '../../src/db/entity';

export const populateLoyaltyRewards = async () => {
  const loyaltyRewardRepository = getRepository(LoyaltyReward);

  const loyaltyProjectRepository = getRepository(LoyaltyProject);
  const tokenRepository = getRepository(Contract);

  const loyaltyProjects = await loyaltyProjectRepository.find({});
  const contracts = await tokenRepository.find({});

  const rewards = [
    {
      amount: 100,
      isClaimable: true,
      description: 'Reward 1 Description',
      startPlace: 1,
      endPlace: 10,
      loyaltyProjectId: loyaltyProjects[0].id, // Reference to the existing LoyaltyProject ID
      contractId: contracts[0].id, // Reference to the existing Token ID
    },
    {
      amount: 50,
      isClaimable: false, // This reward is not yet claimable
      description: 'Reward 2 Description',
      startPlace: 11,
      endPlace: 20,
      loyaltyProjectId: loyaltyProjects[1].id,
      contractId: contracts[1].id, // Refers to a different token
    },
    {
      amount: 25,
      isClaimable: true,
      description: 'Reward 3 Description for a special event',
      startPlace: 21,
      endPlace: 21, // This reward is only for the 21st place (e.g., a special prize)
      loyaltyProjectId: loyaltyProjects[2].id, // Refers to another LoyaltyProject
      contractId: contracts[2].id,
    },
  ];

  await loyaltyRewardRepository.save(rewards);
};
