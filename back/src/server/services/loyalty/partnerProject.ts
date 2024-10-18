import { PartnerProject } from '../../../db/entity';
import { Logger } from '../logger';
import { investorModel, partnerProjectModel, taskProgressModel } from '../../../db/models';
import { PartnerProjectBaseInfo } from '../../../db/types/interfaces/partnerProject';
import { getLocalization } from '../localization';
import { getConfig } from '../../config';
import {
  CreatePartnerProjectDto,
  UpdatePartnerProjectDto,
} from '../../../db/types/interfaces/loyalty/PartnerProjectDto';
import { NotFoundError, NotFoundErrorKeys } from '../../errors/NotFoundError';
import { saveImage } from '../image';
import { plainToClass } from 'class-transformer';
import { ImageDto } from '../../../db/types/interfaces/ImageDto';
import { invitesToPartnerProjectModel } from '../../../db/models/invitesToPartnerProject.model';
import { InvitesToPartnerProjectTypes } from '../../../db/types/interfaces/invitesToPartnerProject.types';
import { InvitesToPartnerProject } from '../../../db/entity/InvitesToPartnerProject';
import { getUserByEmail } from '../profiles';
import { sendGridApiService } from '../apis/sendGridApiService';

const log = new Logger();

const dataToPartnerProject = (data: CreatePartnerProjectDto, investorId: number) => {
  const project = new PartnerProject();
  const config = getConfig();
  project.logo = data.logo || config.DEFAULT_PARTNER_PROJECT_LOGO;
  project.name = data.name;
  project.linkTitle = data.linkTitle;
  project.shortDescription = data.shortDescription || '';
  project.projectDescription = data.projectDescription || '';
  project.socialDescription = data.socialDescription || ':abbr[]';
  project.investorId = investorId;
  project.verificationIcon = false;

  return project;
};

export const getPartnerProject = async (linkTitle: PartnerProject['linkTitle'], language: string | undefined) => {
  log.info(`getPartnerProject: ${{ linkTitle }}`);
  const project = await partnerProjectModel.getByLinkTitle(linkTitle);

  return await getPartnerProjectBaseInfo(project, language);
};

export const createPartnerProject = async (data: CreatePartnerProjectDto, logo: any, investorId: number) => {
  log.info(`createPartnerProject: ${{ data, investorId }}`);

  let imageUrl = data.logo;

  if (!imageUrl && logo) {
    const saveImageDto = plainToClass(
      ImageDto,
      { ...logo, name: logo.originalname, data: logo.buffer, mimeType: logo.mimetype },
      {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      },
    );
    imageUrl = (await saveImage(saveImageDto)) || '';
  }

  const partnerProject = dataToPartnerProject({ ...data, logo: imageUrl }, investorId);
  const savedProject = await partnerProjectModel.create(partnerProject);

  const newPartnerProject = await partnerProjectModel.getByLinkTitle(savedProject.linkTitle);

  return getPartnerProjectBaseInfo(newPartnerProject);
};

export const updatePartnerProject = async (
  data: UpdatePartnerProjectDto,
  logo: any,
  investorId: number,
  linkTitle: string,
) => {
  log.info(`updatePartnerProject ${{ data, investorId, linkTitle }}`);

  const partnerProject = await getPartnerProjectByLinkTitleAndInvestorId(linkTitle, investorId);

  if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Project doesn't exist`);

  let imageUrl = data.logo;

  if (!imageUrl && logo) {
    const saveImageDto = plainToClass(
      ImageDto,
      { ...logo, name: logo.originalname, data: logo.buffer, mimeType: logo.mimetype },
      {
        enableImplicitConversion: true,
        excludeExtraneousValues: true,
      },
    );
    imageUrl = (await saveImage(saveImageDto)) || '';
  }

  const updatedData = { ...partnerProject } as PartnerProject;

  const config = getConfig();

  updatedData.logo = imageUrl || updatedData.logo || config.DEFAULT_PARTNER_PROJECT_LOGO;
  updatedData.name = data.name || updatedData.name;
  updatedData.shortDescription = data.shortDescription || updatedData.shortDescription || '';
  updatedData.projectDescription = data.projectDescription || updatedData.projectDescription || '';
  updatedData.socialDescription = data.socialDescription || updatedData.socialDescription || ':abbr[]';

  const updatedProject = await partnerProjectModel.update(updatedData);

  const newPartnerProject = await partnerProjectModel.getByLinkTitle(updatedProject.linkTitle);

  return getPartnerProjectBaseInfo(newPartnerProject, undefined, partnerProject.isDelegated);
};

export const checkPartnerProjectOwnership = async (
  partnerProjectLinkTitle: string,
  investorId: number,
  isInvited?: boolean,
) => {
  const partnerProject = await partnerProjectModel.getByLinkTitleAndInvestorId(partnerProjectLinkTitle, investorId);

  if (!partnerProject && isInvited) {
    const partnerProjectByInvite = await invitesToPartnerProjectModel.findOne({
      where: {
        investorId,
        partnerProject: {
          linkTitle: partnerProjectLinkTitle,
        },
      },
      relations: ['partnerProject'],
    });
    if (partnerProjectByInvite) {
      return partnerProjectByInvite.partnerProject;
    }
    throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Partner project not found');
  }

  if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Partner project not found');

  return partnerProject;
};

export const getInvestorPartnerProjects = async (investorId: number) => {
  const partnerProjects = await partnerProjectModel.getByInvestorId(investorId);

  const result: PartnerProjectBaseInfo[] = [];

  for (const item of partnerProjects) {
    const partnerProject = await getPartnerProjectBaseInfo(item);
    result.push(partnerProject);
  }

  const invites = await invitesToPartnerProjectModel.getPartnerProjectsByInvestorId(investorId);

  for (const item of invites) {
    const partnerProject = await getPartnerProjectBaseInfo(item.partnerProject);
    result.push({
      ...partnerProject,
      isDelegated: true,
    });
  }

  return result;
};

async function getPartnerProjectBaseInfo(
  partnerProject: PartnerProject,
  language?: string,
  isDelegated?: boolean,
): Promise<PartnerProjectBaseInfo> {
  const result: PartnerProjectBaseInfo = {
    linkTitle: partnerProject.linkTitle,
    name: partnerProject.name,
    logo: partnerProject.logo,
    verificationIcon: partnerProject.verificationIcon,
    shortDescription: partnerProject.localizationId
      ? (await getLocalization(partnerProject.localizationId, language, 'shortDescription')) ||
        partnerProject.shortDescription
      : partnerProject.shortDescription,
    projectDescription: partnerProject.localizationId
      ? (await getLocalization(partnerProject.localizationId, language, 'projectDescription')) ||
        partnerProject.projectDescription
      : partnerProject.projectDescription,
    socialDescription: partnerProject.socialDescription,
    participants: 0,
    createdAt: null,
    quests: [],
    isDelegated: !!isDelegated,
  };

  result.participants = await taskProgressModel.getPartnerProjectParticipants(partnerProject.id);

  partnerProject.loyaltyProjects.forEach((loyaltyProject) => {
    if (!result.createdAt || new Date(result.createdAt).getTime() > new Date(loyaltyProject.startAt).getTime()) {
      result.createdAt = loyaltyProject.startAt;
    }
    if (result.quests) result.quests?.push(loyaltyProject);
  });

  return result;
}

export const getInviteByInviteId = async (id: number) => {
  const invite = await invitesToPartnerProjectModel.getFullInfoById(id);

  if (!invite) throw new NotFoundError(NotFoundErrorKeys.NotFound, `Invite with id ${id} doesn't exist`);

  return {
    ...invite,
    flow: (await getUserByEmail(invite.email.toLowerCase())) ? 'login' : 'signUp',
  };
};

export const checkNotSelfInvite = async (investorId: number, email: string) => {
  const fullInvestor = await investorModel.getInvestorProfileInfo(investorId);
  if (fullInvestor.emailUser && fullInvestor.emailUser?.email.toLowerCase() === email.toLowerCase()) return false;
  if (fullInvestor.googleUser && fullInvestor.googleUser.email.toLowerCase() === email.toLowerCase()) return false;
  return true;
};

export const inviteToPartnerProjectByEmail = async (
  linkTitle: string,
  investorId: number,
  { email }: InvitesToPartnerProjectTypes.InviteToPartnerProjectDTO,
): Promise<InvitesToPartnerProject | undefined> => {
  if (!(await checkNotSelfInvite(investorId, email))) return;
  const partnerProject = await partnerProjectModel.getByLinkTitle(linkTitle);
  if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project not found');

  const emailUser = await getUserByEmail(email);

  if (!emailUser) {
    const invite = (await invitesToPartnerProjectModel.create({
      status: 'pending',
      partnerProjectId: partnerProject.id,
      email,
    })) as InvitesToPartnerProject;
    try {
      await sendInvite(email, partnerProject.name, invite.id);
      return invite;
    } catch (e) {
      console.log('Error on inviteToPartnerProjectByEmail: ', e);
      log.error(`Error on inviteToPartnerProjectByEmail: ${e}`);
      return invite;
    }
  }

  let invite = await invitesToPartnerProjectModel.findOne({
    where: {
      investorId: emailUser.investorId,
      partnerProjectId: partnerProject.id,
    },
  });

  if (!invite) {
    invite = await invitesToPartnerProjectModel.create({
      status: 'pending',
      investorId: emailUser.investorId,
      partnerProjectId: partnerProject.id,
      email,
    });
    await sendInvite(email, partnerProject.name, invite?.id as number);
    return invite;
  } else {
    if (invite.status === 'accepted' || invite.status === 'pending') return invite;
    await sendInvite(email, partnerProject.name, invite?.id as number);
    return await invitesToPartnerProjectModel.update(invite.id as number, {
      status: 'pending',
    });
  }
};

export const leaveInvestorFromPartnerProjectByInvestorId = async (
  linkTitle: string,
  investorId: number,
): Promise<InvitesToPartnerProject | undefined> => {
  const partnerProject = await partnerProjectModel.getByLinkTitle(linkTitle);
  if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project not found');

  const invite = await invitesToPartnerProjectModel.findOne({
    where: {
      investorId,
      partnerProjectId: partnerProject.id,
    },
  });

  if (!invite) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'You are not invited to this project');

  return await invitesToPartnerProjectModel.update(invite.id, {
    status: 'leaved',
  });
};

export const getInvitedUsersOfPartnerProject = async (linkTitle: string) => {
  const partnerProject = await partnerProjectModel.getByLinkTitle(linkTitle);
  if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project not found');

  const invites = await invitesToPartnerProjectModel.getActiveInvitedInvestorsByProjectLinkTitle(partnerProject.id);

  return Promise.all(
    invites.map(async (invite) => ({
      investorId: invite.investorId,
      status: invite.status,
      email: invite.email,
    })),
  );
};

export const removeInvestorFromPartnerProjectByEmail = async (
  linkTitle: string,
  email: string,
): Promise<InvitesToPartnerProject | undefined> => {
  const partnerProject = await partnerProjectModel.getByLinkTitle(linkTitle);
  if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project not found');

  const invite = await invitesToPartnerProjectModel.getByEmail(email);

  if (!invite) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'You are not invited to this project');

  return await invitesToPartnerProjectModel.update(invite.id, {
    status: 'deleted',
  });
};

export const getPendingInvitesByInvestorId = async (investorId: number) => {
  return await invitesToPartnerProjectModel.findAll({
    where: {
      investorId,
      status: 'pending',
    },
  });
};

export const acceptInviteToPartnerProject = async (projectId: number, investorId: number) => {
  const invite = await invitesToPartnerProjectModel.findOne({
    where: {
      investorId,
      partnerProject: {
        id: projectId,
      },
    },
  });

  if (!invite) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Invite not found');

  return await invitesToPartnerProjectModel.update(invite.id, {
    status: 'accepted',
  });
};

export const declineInviteToPartnerProject = async (projectId: number, investorId: number) => {
  const invite = await invitesToPartnerProjectModel.findOne({
    where: {
      investorId,
      partnerProject: {
        id: projectId,
      },
    },
  });

  if (!invite) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Invite not found');

  return await invitesToPartnerProjectModel.update(invite.id, {
    status: 'rejected',
  });
};

export const addInvestorToInviteByEmail = async (email: string, investorId: number) => {
  const invite = await invitesToPartnerProjectModel.getByEmail(email);
  if (!invite) return;
  return invitesToPartnerProjectModel.update(invite.id, {
    investorId,
  });
};

const sendInvite = async (email: string, partnerProjectName: string, id: number) => {
  try {
    await sendGridApiService.sendInviteToPartnerProject(email, partnerProjectName, id);
  } catch (e) {
    log.error(`Error on inviteToPartnerProjectByEmail: ${e}`);
  }
};

export const getPartnerProjectByLinkTitleAndInvestorId = async (linkTitle: string, investorId: number) => {
  let partnerProject: any = await partnerProjectModel.getByLinkTitleAndInvestorId(linkTitle, investorId);
  if (!partnerProject) {
    partnerProject = await invitesToPartnerProjectModel
      .findOne({
        where: {
          investorId,
          partnerProject: {
            linkTitle,
          },
        },
        relations: ['partnerProject'],
      })
      .then((invite) =>
        invite
          ? {
              ...invite?.partnerProject,
              isDelegated: true,
            }
          : null,
      );
  }

  if (!partnerProject) throw new NotFoundError(NotFoundErrorKeys.NotFound, 'Project not found');
  return partnerProject;
};
