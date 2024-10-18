import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export namespace InvitesToPartnerProjectTypes {
  export type status = 'pending' | 'accepted' | 'rejected' | 'leaved' | 'deleted';

  export class InviteToPartnerProjectDTO {
    @IsEmail()
    email!: string;
  }

  class InviteActionByInvitedUserDTO {
    @IsNumber()
    @IsNotEmpty()
    projectId: number;
  }

  export class AcceptInviteToPartnerProjectDTO extends InviteActionByInvitedUserDTO {}
  export class DeclineInviteToPartnerProjectDTO extends InviteActionByInvitedUserDTO {}
}
