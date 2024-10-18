import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InvitesToPartnerProjectTypes } from '../types/interfaces/invitesToPartnerProject.types';
import { PartnerProject } from './PartnerProject';
import { Investor } from './Investor';

@Entity()
export class InvitesToPartnerProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: InvitesToPartnerProjectTypes.status;

  @ManyToOne(() => PartnerProject, (project) => project.id)
  @JoinColumn()
  partnerProject: PartnerProject;
  @Column({ nullable: false })
  partnerProjectId: number;

  @ManyToOne(() => Investor, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: true })
  investorId!: null | number;

  @Column({ nullable: false })
  email!: string;
}
