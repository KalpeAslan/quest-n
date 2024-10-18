import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoyaltyProject } from './LoyaltyProject';
import { Investor } from './Investor';

@Entity()
export class LuckyDrawProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => LoyaltyProject, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  loyaltyProject!: LoyaltyProject;
  @Column({ nullable: false })
  loyaltyProjectId!: number;

  @ManyToOne(() => Investor, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;

  @UpdateDateColumn()
  updatedDate!: Date;

  @CreateDateColumn()
  createdDate!: Date;
}
