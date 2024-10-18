import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ExperienceBodyType, ExperienceTaskType } from '../types/interfaces/ExperienceDto';

@Entity()
export class ExperienceTask {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
  })
  name!: string;

  @Column({ type: 'numeric' })
  points!: number;

  @Column('jsonb', {
    unique: false,
    default: {},
  })
  body?: ExperienceBodyType;

  @Column('varchar', {
    unique: false,
  })
  type!: ExperienceTaskType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
