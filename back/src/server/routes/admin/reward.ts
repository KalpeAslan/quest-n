import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authValidating';
import {
  CreateNftRewardDto,
  CreateTokenRewardDto,
  CreateWhitelistRewardDto,
} from '../../../db/types/interfaces/loyalty/reward';
import { nftModel } from '../../../db/models/nftModel';
import { fileUpload } from '../../middlewares/fileUpload';
import { bodyValidator } from '../../helpers';
import { createNft } from '../../services/reward/nft';
import { createWhitelistReward } from '../../services/reward/whitelist';
import { LoyaltyReward } from '../../../db/entity';
import { createTokenRewards } from '../../services/reward/token';
import { deleteReward, updateVerified } from '../../services/reward/reward';

export const reward = Router();

reward.post('/admin/reward/nft', fileUpload('file').single('image'), async (req, res, next) => {
  const data: CreateNftRewardDto = JSON.parse(req.body.data);
  const image = req.file;
  const validatedDtoData = await bodyValidator(CreateNftRewardDto, data);
  try {
    const result = await createNft(req['investorId'], image, validatedDtoData);
    res.send(result);
  } catch (error) {
    next(error);
  }
});

reward.post('/admin/reward/token', authMiddleware, async (req, res, next) => {
  try {
    const data: CreateTokenRewardDto = req.body;
    const validatedData = await bodyValidator(CreateTokenRewardDto, data);

    const result = await createTokenRewards(req['investorId'], validatedData);

    res.send(result);
  } catch (error) {
    console.log('reward: error', error);
    next(error);
  }
});

reward.post('/admin/reward/whitelist', authMiddleware, async (req, res, next) => {
  try {
    const result: LoyaltyReward[] = [];

    const data = req.body as CreateWhitelistRewardDto[];

    for (const item of data) {
      const itemResult = await createWhitelistReward(req['investorId'], item);
      result.push(itemResult);
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
});

reward.post('/admin/reward/verify', authMiddleware, async (req, res, next) => {
  try {
    const result = await updateVerified(req.body.questId);

    res.send(result);
  } catch (error) {
    next(error);
  }
});

reward.delete('/admin/reward/:id', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const rewardId = req.params.id;

    await deleteReward(investorId, Number(rewardId));

    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

reward.get('/nft/:contractId/:nftId', async (req, res, next) => {
  try {
    const nft = await nftModel.getByParams({
      contractId: Number(req.params.contractId),
      nftId: Number(req.params.nftId),
    });

    res.send(nft);
  } catch (error) {
    next(error);
  }
});
