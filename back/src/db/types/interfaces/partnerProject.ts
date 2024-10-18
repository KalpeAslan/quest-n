import { LoyaltyProject, PartnerProject } from '../../entity';

export interface PartnerProjectBaseInfo {
  linkTitle: PartnerProject['linkTitle'];
  name: PartnerProject['name'];
  logo: PartnerProject['logo'];
  verificationIcon: PartnerProject['verificationIcon'];
  shortDescription: PartnerProject['shortDescription'];
  projectDescription: PartnerProject['projectDescription'];
  socialDescription: PartnerProject['socialDescription'];
  participants: number;
  createdAt: Date | null;
  quests?: LoyaltyProject[];
  isDelegated?: boolean;
}
