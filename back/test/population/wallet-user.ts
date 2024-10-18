import { getRepository } from 'typeorm';
import { Investor, WalletUser } from '../../src/db/entity';

export const populateWalletUsers = async () => {
  const walletUserModel = getRepository(WalletUser);
  const investorRepository = getRepository(Investor);
  const investors = await investorRepository.find({
    order: {
      id: 'ASC', // or 'DESC' for descending order
    },
  });

  const walletUser = [
    {
      address: '0xaE4C5792BA12c6dcDae6e072cDea92eBFf7616D0',
      createdAt: new Date(),
      investorId: investors[0].id,
    },
  ];

  await walletUserModel.save(walletUser);
};
