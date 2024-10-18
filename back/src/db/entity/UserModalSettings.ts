import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Investor } from './Investor';
import { UserModalSettingsTypes } from '../types/interfaces/UserModalSettings.types';

@Entity()
export class UserModalSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Investor, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;

  @Column('varchar')
  type: UserModalSettingsTypes;

  @CreateDateColumn()
  createdAt!: Date;
}
