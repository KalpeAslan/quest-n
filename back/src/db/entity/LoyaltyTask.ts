import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { LoyaltyTaskType, LoyaltyTaskBody } from '../types/interfaces/loyalty';
import { LoyaltyProject } from './LoyaltyProject';
import { TaskProgress } from './TaskProgress';
import { ExperienceTask } from './ExperienceTask';

@Entity()
export class LoyaltyTask {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: false,
  })
  title!: string;

  @Column('numeric', {
    unique: false,
  })
  points!: number;

  @Column('varchar', {
    unique: false,
    nullable: true,
  })
  localizationId!: string;

  @Column({ type: 'timestamp', nullable: true })
  startAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  endAt: Date | null;

  @Column({ type: 'varchar', enum: LoyaltyTaskType })
  type!: LoyaltyTaskType;

  @ManyToOne(() => ExperienceTask, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  experienceTask?: ExperienceTask;
  @Column({ nullable: true, default: null })
  experienceTaskId?: number;

  @Column('jsonb', {
    unique: false,
  })
  body!: LoyaltyTaskBody;

  @Column('int', { default: 0 })
  sortOrder: number;

  @Column('boolean', { default: false })
  required: boolean;

  @ManyToOne(() => LoyaltyProject, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  loyaltyProject!: LoyaltyProject;
  @Column({ nullable: false })
  loyaltyProjectId!: number;

  @OneToMany(() => TaskProgress, (s) => s.investor, { onDelete: 'CASCADE' })
  taskProgress?: TaskProgress[];
}
