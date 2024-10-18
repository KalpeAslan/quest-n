import {
  Column,
  JoinColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Investor } from './Investor';
import { LoyaltyProject } from './LoyaltyProject';
import { TaskProgressBody } from '../types/interfaces/taskProgress';
import { LoyaltyTask } from './LoyaltyTask';

@Entity()
@Unique(['investorId', 'loyaltyProjectId', 'loyaltyTaskId'])
export class TaskProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric', {
    unique: false,
    default: 0,
  })
  earnedPoints!: number;

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

  @Column('jsonb', {
    unique: false,
    default: {},
  })
  json: TaskProgressBody;

  @Column({
    nullable: true,
    default: null,
    type: 'timestamp',
  })
  completedAt: Date | null;

  @ManyToOne(() => LoyaltyTask, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  loyaltyTask!: LoyaltyTask;
  @Column({ nullable: false })
  loyaltyTaskId!: number;
}
