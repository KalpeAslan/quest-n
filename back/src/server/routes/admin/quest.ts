import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authValidating';
import { dtoValidationMiddleware } from '../../middlewares/dtoValidating';
import {
  CreateLoyaltyProjectDto,
  UpdateLoyaltyProjectDto,
} from '../../../db/types/interfaces/loyalty/LoyaltyProjectDto';
import { checkPartnerProjectOwnership } from '../../services/loyalty/partnerProject';
import {
  checkLoyaltyProjectOwnership,
  createLoyaltyProject,
  deleteById,
  updateLoyaltyProject,
} from '../../services/loyalty/loyaltyProject';
import { getConfig } from '../../config';
import { fileUpload } from '../../middlewares/fileUpload';
import { plainToClass } from 'class-transformer';
import { ImageDto } from '../../../db/types/interfaces/ImageDto';
import { validate } from 'class-validator';
import { saveImage } from '../../services/image';
import { ImageMimeType } from '../../../db/types/interfaces/ImageDto';
import { CreateLoyaltyTaskDto, UpdateLoyaltyTaskDto } from '../../../db/types/interfaces/loyalty/LoyaltyTaskDto';
import { createLoyaltyTask, updateAndReplaceLoyaltyTasks } from '../../services/loyalty/task/loyaltyTask';
import { RequestLogger } from '../../services/logger';
import { createToken } from '../../services/loyalty/tokens';
import { createLoyaltyRewards, updateLoyaltyRewads } from '../../services/loyalty/loyaltyRewards.service';
import { CreateLoyaltyRewardDto } from '../../../db/types/interfaces/loyalty/reward';
import { CreateContractDto } from '../../../db/types/interfaces/contractDto';
import { investorModel, loyaltyProjectModel, partnerProjectModel } from '../../../db/models';
import { Investor } from '../../../db/entity';
import { BadRequestError, BadRequestErrorKeys } from '../../errors';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { isTelegramBotInvited } from '../../services/auth/telegram';
import { customAlphabet } from 'nanoid';
const generateShortID = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8);

const logger = new RequestLogger();

export const quest = Router();

quest.get('/admin/quest/preview-image', authMiddleware, async (req, res, next) => {
  try {
    const config = getConfig();

    logger.info(req, { response: config.DEFAULT_LOYALTY_PROJECT_PREVIEW_IMAGE });
    res.send(config.DEFAULT_LOYALTY_PROJECT_PREVIEW_IMAGE);
  } catch (error) {
    next(error);
  }
});

quest.get('/admin/:partnerProjectLinkTitle/quest/getAdminTasksSettings', authMiddleware, async (req, res, next) => {
  try {
    const { ADMIN_TASK_LIMIT, TELEGRAM_BOT_TRACKER } = getConfig();
    const partnerProjectLinkTitle = req.params.partnerProjectLinkTitle;

    const partnerProject = await partnerProjectModel.getByLinkTitle(partnerProjectLinkTitle);

    const response = {
      limit: ADMIN_TASK_LIMIT,
      tgBotLink: TELEGRAM_BOT_TRACKER,
      questsCount: partnerProject.loyaltyProjects.length,
    };

    logger.info(req, { response });
    res.send(response);
  } catch (error) {
    next(error);
  }
});

quest.put(
  '/admin/quest/preview-image',
  authMiddleware,
  fileUpload('file').single('preview'),
  async (req, res, next) => {
    try {
      if (!req.file) throw new NotFoundError(NotFoundErrorKeys.NotFound, "File doesn't exist");

      const saveImageDto = plainToClass(
        ImageDto,
        { ...req.file, name: req.file.originalname, data: req.file.buffer, mimeType: req.file.mimetype },
        {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        },
      );

      const validationErrors = await validate(saveImageDto, { validationError: { target: false, value: false } });

      if (validationErrors.length) {
        throw validationErrors[0];
      }

      const imageUrl = await saveImage({
        ...saveImageDto,
        size: saveImageDto.size,
        data: saveImageDto.data,
        mimeType: ImageMimeType.PNG,
      });

      if (!imageUrl) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Image upload failed');

      logger.info(req, { response: { imageUrl } });
      res.send(imageUrl);
    } catch (error) {
      next(error);
    }
  },
);

quest.get('/admin/quest/checkIsBotInvited', async (req, res, next) => {
  try {
    const inviteLink = req.query.groupId;
    res.send({ success: true, isBotInvited: await isTelegramBotInvited(inviteLink as string) });
  } catch (error) {
    console.log('checkIsBotInvited', error);
    next(error);
  }
});

quest.get('/admin/quest/:link', authMiddleware, async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;

    const loyaltyProject = await loyaltyProjectModel.getByLinkTitle(projectLinkTitle);

    logger.info(req, { loyaltyProjectModel });
    res.send(loyaltyProject);
  } catch (error) {
    next(error);
  }
});

quest.post('/admin/quest', authMiddleware, dtoValidationMiddleware(CreateLoyaltyProjectDto), async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const data = req.body as CreateLoyaltyProjectDto;
    data.projectName += ' Quest';
    data.linkTitle += '-quest';

    const isLoyaltyProjectExists = await loyaltyProjectModel.getByParams({ linkTitle: req.body.linkTitle });
    if (isLoyaltyProjectExists.length != 0) {
      // short id is not unique, collision once every 1K ID generations
      const shortId = generateShortID();
      data.linkTitle += '-' + shortId;
    }

    const partnerProject = await checkPartnerProjectOwnership(data.partnerLinkTitle, investorId, true);
    const loyaltyProject = await createLoyaltyProject(data, partnerProject.id);

    logger.info(req, { response: { loyaltyProject } });
    res.send(loyaltyProject);
  } catch (err) {
    next(err);
  }
});

quest.put(
  '/admin/quest/:link',
  authMiddleware,
  dtoValidationMiddleware(UpdateLoyaltyProjectDto),
  async (req, res, next) => {
    try {
      const investorId = req['investorId'];

      const data = req.body as UpdateLoyaltyProjectDto;

      const projectLinkTitle = req.params.link;

      const { loyaltyProject } = await checkLoyaltyProjectOwnership({
        investorId,
        loyaltyProjectLinkTitle: projectLinkTitle,
      });

      const newLoyaltyProject = await updateLoyaltyProject(data, loyaltyProject.linkTitle);

      logger.info(req, { response: { newLoyaltyProject } });
      res.send(newLoyaltyProject);
    } catch (error) {
      next(error);
    }
  },
);

quest.delete('/admin/quest/:link', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const projectLinkTitle = req.params.link;

    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectLinkTitle: projectLinkTitle,
    });

    await deleteById(loyaltyProject.id);

    logger.info(req, { response: { success: true } });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

quest.put(
  '/admin/quest/:link/preview-image',
  authMiddleware,
  fileUpload('file').single('preview'),
  async (req, res, next) => {
    try {
      const investorId = req['investorId'];

      const projectLinkTitle = req.params.link;

      if (!req.file) throw new NotFoundError(NotFoundErrorKeys.NotFound, "File doesn't exist");

      const { loyaltyProject } = await checkLoyaltyProjectOwnership({
        investorId,
        loyaltyProjectLinkTitle: projectLinkTitle,
      });

      const saveImageDto = plainToClass(
        ImageDto,
        { ...req.file, name: req.file.originalname, data: req.file.buffer, mimeType: req.file.mimetype },
        {
          enableImplicitConversion: true,
          excludeExtraneousValues: true,
        },
      );

      const validationErrors = await validate(saveImageDto, { validationError: { target: false, value: false } });

      if (validationErrors.length) {
        throw validationErrors[0];
      }

      const imageUrl = await saveImage({
        ...saveImageDto,
        size: saveImageDto.size,
        data: saveImageDto.data,
        mimeType: ImageMimeType.PNG,
      });

      if (!imageUrl) throw new BadRequestError(BadRequestErrorKeys.NotValidDataProvided, 'Image upload failed');

      const newLoyaltyProject = await updateLoyaltyProject({ previewImage: imageUrl }, loyaltyProject.linkTitle);

      logger.info(req, { response: newLoyaltyProject });
      res.send(newLoyaltyProject);
    } catch (error) {
      next(error);
    }
  },
);

quest.delete('/admin/quest/:link/preview-image', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const projectLinkTitle = req.params.link;

    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectLinkTitle: projectLinkTitle,
    });

    const config = getConfig();

    const newLoyaltyProject = await updateLoyaltyProject(
      {
        previewImage: config.DEFAULT_LOYALTY_PROJECT_PREVIEW_IMAGE,
      },
      loyaltyProject.linkTitle,
    );

    logger.info(req, { newLoyaltyProject });
    res.send(newLoyaltyProject);
  } catch (error) {
    next(error);
  }
});

quest.post('/admin/quest/:link/tasks', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const data = req.body as CreateLoyaltyTaskDto[];

    const projectLinkTitle = req.params.link;

    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectLinkTitle: projectLinkTitle,
    });

    for (const taskData of data) {
      await createLoyaltyTask(loyaltyProject.linkTitle, taskData, investorId);
    }

    const newLoyaltyProject = await updateLoyaltyProject({}, loyaltyProject.linkTitle);

    logger.info(req, { newLoyaltyProject });
    res.send(newLoyaltyProject);
  } catch (error) {
    next(error);
  }
});

quest.put('/admin/quest/:link/tasks', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const data = req.body as Array<CreateLoyaltyTaskDto | UpdateLoyaltyTaskDto>;

    const projectLinkTitle = req.params.link;

    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectLinkTitle: projectLinkTitle,
    });

    await updateAndReplaceLoyaltyTasks(loyaltyProject.linkTitle, data, investorId);

    const newLoyaltyProject = await updateLoyaltyProject({}, loyaltyProject.linkTitle);

    logger.info(req, { newLoyaltyProject });
    res.send(newLoyaltyProject);
  } catch (error) {
    next(error);
  }
});

quest.post('/admin/quest/:link/token', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const data = req.body as CreateContractDto;

    const createdToken = await createToken(data, investorId);
    logger.info(req, { createdToken });
    res.send({
      success: true,
      response: createdToken,
    });
  } catch (error) {
    next(error);
  }
});

quest.post('/admin/quest/:link/rewards', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const rewards = req.body as CreateLoyaltyRewardDto[];

    const projectLinkTitle = req.params.link;
    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectLinkTitle: projectLinkTitle,
    });

    const investor = await investorModel.getByInvestorId(investorId);
    await createLoyaltyRewards(loyaltyProject, rewards, investor as Investor);

    logger.info(req, { loyaltyProject });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});

quest.put('/admin/quest/:link/rewards', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const rewards = req.body as CreateLoyaltyRewardDto[];

    const projectLinkTitle = req.params.link;
    const { loyaltyProject } = await checkLoyaltyProjectOwnership({
      investorId,
      loyaltyProjectLinkTitle: projectLinkTitle,
    });

    const investor = await investorModel.getByInvestorId(investorId);
    await updateLoyaltyRewads(loyaltyProject, rewards, investor as Investor);

    logger.info(req, { loyaltyProject });
    res.send({ success: true });
  } catch (error) {
    next(error);
  }
});
