import { Router } from 'express';
import { authMiddleware } from '../../middlewares/authValidating';
import {
  CreatePartnerProjectDto,
  UpdatePartnerProjectDto,
} from '../../../db/types/interfaces/loyalty/PartnerProjectDto';
import {
  acceptInviteToPartnerProject,
  checkPartnerProjectOwnership,
  createPartnerProject,
  declineInviteToPartnerProject,
  getInviteByInviteId,
  getInvitedUsersOfPartnerProject,
  inviteToPartnerProjectByEmail,
  leaveInvestorFromPartnerProjectByInvestorId,
  removeInvestorFromPartnerProjectByEmail,
  updatePartnerProject,
} from '../../services/loyalty/partnerProject';
import { fileUpload } from '../../middlewares/fileUpload';
import { getConfig } from '../../config';
import { RequestLogger } from '../../services/logger';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { bodyValidator } from '../../helpers';
import { InvitesToPartnerProjectTypes } from '../../../db/types/interfaces/invitesToPartnerProject.types';
const logger = new RequestLogger();

export const project = Router();

project.get('/admin/project', authMiddleware, async (req, res, next) => {
  try {
    const partnerProjects = await checkPartnerProjectOwnership;
    logger.info(req, { response: { partnerProjects } });
    res.send({ projects: partnerProjects });
  } catch (error) {
    next(error);
  }
});

project.post('/admin/project', authMiddleware, fileUpload('file').single('logo'), async (req, res, next) => {
  try {
    const data: CreatePartnerProjectDto = JSON.parse(req.body.data);
    const investorId = req['investorId'];
    const logo = req.file;

    const validatedDtoData = await bodyValidator(CreatePartnerProjectDto, data);

    const partnerProject = await createPartnerProject(validatedDtoData, logo, investorId);
    logger.info(req, { response: { partnerProject } });
    res.send({ project: partnerProject });
  } catch (error) {
    next(error);
  }
});

project.put('/admin/project/:link', authMiddleware, fileUpload('file').single('logo'), async (req, res, next) => {
  try {
    const projectLinkTitle = req.params.link;
    if (!projectLinkTitle) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no link');
    const investorId = req['investorId'];

    const logo = req.file;
    const data: CreatePartnerProjectDto = JSON.parse(req.body.data);

    const validatedDtoData = await bodyValidator(UpdatePartnerProjectDto, data);

    const partnerProject = await updatePartnerProject(validatedDtoData, logo, investorId, projectLinkTitle);
    logger.info(req, { project: partnerProject });
    res.send({ project: partnerProject });
  } catch (error) {
    next(error);
  }
});

project.get('/admin/project/default-logo', authMiddleware, async (req, res, next) => {
  try {
    const config = getConfig();

    logger.info(req, { response: config.DEFAULT_PARTNER_PROJECT_LOGO });
    res.send(config.DEFAULT_PARTNER_PROJECT_LOGO);
  } catch (error) {
    next(error);
  }
});

// Admin Access Sharing Routes

project.get('/admin/project/invite/:inviteId', async (req, res, next) => {
  try {
    const inviteId = req.params.inviteId;
    const invite = await getInviteByInviteId(+inviteId);
    logger.info(req, { response: { invite } });
    res.send(invite);
  } catch (error) {
    next(error);
  }
});

project.post('/admin/project/:linkTitle/invite', authMiddleware, async (req, res, next) => {
  try {
    const data: InvitesToPartnerProjectTypes.InviteToPartnerProjectDTO = req.body;
    const investorId = req['investorId'];
    await checkPartnerProjectOwnership(req.params.linkTitle, investorId, true);
    const invitesToPartnerProject = await inviteToPartnerProjectByEmail(req.params.linkTitle, investorId, data);
    logger.info(req, { response: { invitesToPartnerProject } });
    res.send({ project: invitesToPartnerProject });
  } catch (error) {
    next(error);
  }
});

project.delete('/admin/project/:linkTitle/invite', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];

    const leaveInvestorFromPartnerProject = await leaveInvestorFromPartnerProjectByInvestorId(
      req.params.linkTitle,
      investorId,
    );

    logger.info(req, { project: leaveInvestorFromPartnerProject });
    res.send({ project: leaveInvestorFromPartnerProject });
  } catch (error) {
    next(error);
  }
});

project.get('/admin/project/:linkTitle/invited-users', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const partnerProject = await checkPartnerProjectOwnership(req.params.linkTitle, investorId, true);
    if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no project');

    const invitesToPartnerProject = await getInvitedUsersOfPartnerProject(req.params.linkTitle);
    logger.info(req, { response: { invitesToPartnerProject } });
    res.send(invitesToPartnerProject);
  } catch (error) {
    next(error);
  }
});

project.delete('/admin/project/:linkTitle/remove-invited-user/:email', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const partnerProject = await checkPartnerProjectOwnership(req.params.linkTitle, investorId, true);
    if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'no project');

    const invitesToPartnerProject = await removeInvestorFromPartnerProjectByEmail(
      req.params.linkTitle,
      req.params.email as string,
    );
    logger.info(req, { response: { invitesToPartnerProject } });
    res.send(invitesToPartnerProject);
  } catch (error) {
    next(error);
  }
});

project.patch('/admin/project/accept-invite', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const body = req.body as InvitesToPartnerProjectTypes.AcceptInviteToPartnerProjectDTO;

    const invitesToPartnerProject = await acceptInviteToPartnerProject(body.projectId, investorId);
    logger.info(req, { response: { invitesToPartnerProject } });
    res.send(invitesToPartnerProject);
  } catch (error) {
    next(error);
  }
});

project.patch('/admin/project/decline-invite', authMiddleware, async (req, res, next) => {
  try {
    const investorId = req['investorId'];
    const body = req.body as InvitesToPartnerProjectTypes.AcceptInviteToPartnerProjectDTO;

    const invitesToPartnerProject = await declineInviteToPartnerProject(body.projectId, investorId);
    logger.info(req, { response: { invitesToPartnerProject } });
    res.send(invitesToPartnerProject);
  } catch (error) {
    next(error);
  }
});
