import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExperienceTask } from './ExperienceTask';
import { Investor } from './Investor';
import { ExperienceTaskType } from '../types/interfaces/ExperienceDto';

@Entity()
export class ExperienceProgress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
  })
  type!: ExperienceTaskType;

  @Column('numeric')
  earnedPoints!: number;

  @Column('jsonb', {
    unique: false,
    default: {},
  })
  body?: Record<string, string | number | boolean>;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => ExperienceTask, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  experienceTask!: ExperienceTask;
  @Column({ nullable: false })
  experienceTaskId!: number;

  @ManyToOne(() => Investor, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  Investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;
}
