import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { LoyaltyProject } from './LoyaltyProject';
import { Contract } from './Contract';
import { Investor } from './Investor';

@Entity()
export class LoyaltyReward {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric', { default: 0 })
  amount!: number;

  @Column('boolean', { default: false })
  isClaimable!: boolean;

  @Column('varchar', {
    unique: false,
  })
  description!: string;

  @Column('numeric', { nullable: false, default: 0 })
  startPlace!: number;

  @Column('numeric', { nullable: false, default: 0 })
  endPlace!: number;

  @ManyToOne(() => LoyaltyProject, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  loyaltyProject!: LoyaltyProject;
  @Column({ nullable: true })
  loyaltyProjectId!: number | null;
  @ManyToOne(() => Investor, { nullable: true, cascade: false, onDelete: 'SET NULL' })
  investor!: Investor;
  @Column({ nullable: true })
  investorId!: number | null;

  @ManyToOne(() => Contract, { nullable: true, cascade: false, onDelete: 'SET NULL' })
  @JoinColumn()
  contract!: Contract;
  @Column({ nullable: true })
  contractId!: number | null;

  @Column('boolean', { default: false })
  verified!: boolean;

  @Column('jsonb', {
    unique: false,
    nullable: true,
  })
  tokenIds!: number[];
}
