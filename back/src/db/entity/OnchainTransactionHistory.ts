import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoyaltyReward } from './LoyaltyReward';
import { Investor } from './Investor';

@Entity()
export class OnchainTransactionsHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric', { default: 0 })
  amount!: number;

  @ManyToOne(() => LoyaltyReward, { nullable: false })
  @JoinColumn()
  loyaltyReward!: LoyaltyReward;
  @Column({ nullable: false })
  loyaltyRewardId!: number;

  @ManyToOne(() => Investor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: true })
  investorId?: number | null;

  @Column('jsonb', { nullable: false, default: [], unique: false })
  tokenIds?: number[];

  @Column('varchar', { nullable: true, default: null })
  transactionHash?: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
