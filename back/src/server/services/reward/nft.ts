import Web3 from 'web3';
const web3 = new Web3();
import { contractModel } from '../../../db/models';
import { getConfig } from '../../config';
import { constants } from '../../config/constants';
import { compressImage, saveImage } from '../image';
import { plainToClass } from 'class-transformer';
import { ImageDto, ImageMimeType } from '../../../db/types/interfaces/ImageDto';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { getNonce, getTotalSupply } from '../blockchain/reward/alphaCollection';
import { CreateNftRewardDto } from '../../../db/types/interfaces/loyalty/reward';
import { nftModel } from '../../../db/models/nftModel';
import { loyaltyRewardModel } from '../../../db/models/loyaltyRewardModel';
import { getMessageHash as getCollectionMessageHash } from '../blockchain/reward/alphaCollection';
import { getRewardVerified, getAdditionHash as getTreasuryAdditionHash } from '../blockchain/reward/alphaTreasury';
import { InternalServerError, InternalServerErrorKeys } from '../../errors';
const { CONTRACT_PRIVATE_KEY } = getConfig();

export const createNft = async (investorId: number, file: any, data: CreateNftRewardDto) => {
  if (!file && !data.image) throw new NotFoundError(NotFoundErrorKeys.NotFound, "File doesn't exist");
  let imageUrl: string = data.image || '';

  if (file) {
    const saveImageDto = plainToClass(
      ImageDto,
      { ...file, name: file.originalname, data: file.buffer, mimeType: file.mimetype },
      {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      },
    );

    const compressedBuffer = await compressImage(saveImageDto.data, 345);
    const compressedSize = compressedBuffer.toString().length;

    imageUrl =
      (await saveImage({
        ...saveImageDto,
        size: compressedSize,
        data: compressedBuffer,
        mimeType: ImageMimeType.PNG,
      })) || '';
  }

  if (!imageUrl) throw new InternalServerError(InternalServerErrorKeys.Default, "Couldn't save image");

  const contract = await contractModel.getById(data.contractId);
  if (!contract?.address) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'contract not found');

  const treasuryContract = constants.blockchain[contract.chainId].treasuryContract;
  if (!treasuryContract) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'treasuryContract not found');

  const nftIds: number[] = [];
  const rewardIds: number[] = [];

  const totalSupply = await getTotalSupply(contract.address, contract.chainId);
  const nonce = await getNonce(contract.address, contract.chainId);
  let totalAmount = 0;
  for (const reward of data.rewards) {
    totalAmount += (reward.endPlace - reward.startPlace + 1) * reward.amount;
  }

  for (let i = totalSupply + 1; i <= totalSupply + totalAmount; i++) {
    nftIds.push(i);

    const existingNft = await nftModel.getByParams({
      nftId: i,
      contractId: data.contractId,
    });

    // update nft if such nft already exists
    if (existingNft) {
      await nftModel.create({
        id: existingNft.id,
        nftId: i,
        name: data.name,
        contractId: data.contractId,
        image: imageUrl,
      });
    } else {
      await nftModel.create({
        nftId: i,
        name: data.name,
        contractId: data.contractId,
        image: imageUrl,
      });
    }
  }

  let lastNftIndex = 0;

  for (const reward of data.rewards) {
    if (reward.id && !reward.verified) {
      const [verified] = await getRewardVerified(contract.chainId, [reward.id]);

      if (verified) {
        await loyaltyRewardModel.updateById(reward.id, { verified: true });
        continue;
      }

      await loyaltyRewardModel.deleteById(reward.id);
    }
    const newLastNftIndex = lastNftIndex + (reward.endPlace - reward.startPlace + 1) * reward.amount;

    const loyaltyReward = await loyaltyRewardModel.create({
      amount: reward.amount,
      isClaimable: true,
      description: data.name,
      startPlace: reward.startPlace,
      endPlace: reward.endPlace,
      loyaltyProjectId: data.loyaltyProjectId,
      contractId: data.contractId,
      tokenIds: nftIds.slice(lastNftIndex, newLastNftIndex),
      investorId,
    });

    lastNftIndex = newLastNftIndex;

    rewardIds.push(loyaltyReward.id);
  }

  const collectionMessageHash = await getCollectionMessageHash(
    contract.address,
    contract.chainId,
    treasuryContract,
    totalAmount,
    treasuryContract,
    nonce,
  );

  const treasuryMessageHash = await getTreasuryAdditionHash(
    contract.chainId,
    data.loyaltyProjectId,
    collectionMessageHash,
    rewardIds,
  );

  const signer = await web3.eth.accounts.privateKeyToAccount(CONTRACT_PRIVATE_KEY);

  const collectionSignature_ = signer.sign(collectionMessageHash).signature;
  const treasurySignature_ = signer.sign(treasuryMessageHash).signature;

  return {
    questId_: data.loyaltyProjectId,
    token_: contract.address,
    amount_: totalAmount,
    rewardIds_: rewardIds,
    nonce_: nonce,
    collectionSignature_,
    treasurySignature_,
  };
};
