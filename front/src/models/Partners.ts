import { PartnerProject } from "@modules/quest/models";

export interface IPartner {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  status: boolean;
  priorityNumber: number;
  createdAt: string;
  updatedAt: string;
}

export class CreatePartnerProjectDto {
  name: string;
  linkTitle: string;
  logo?: string | null;
  shortDescription?: string;
  socialDescription?: string;
}

export class UpdatePartnerProjectDto {
  name?: string;
  logo?: string | null;
  linkTitle?: string;
  shortDescription?: string;
  socialDescription?: string;
}

export interface IInviteInfoForPartnerProject {
  id: number;
  status: "pending";
  partnerProjectId: number;
  investorId: number;
  partnerProject: PartnerProject;
  flow: "login" | "signUp";
  isGmail: boolean;
  email: string;
}
