import { Column, ManyToOne, Entity, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

import { TokensStorage } from './TokensStorage';
// import { Token } from './Token';
import { LoyaltyProject } from './LoyaltyProject';
import { TokensStorageHistoryTypes } from '../types/interfaces';

@Entity()
export class TokensStorageHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric', { default: 0 })
  amount!: number;

  @Column('varchar', { nullable: true, default: null })
  transactionId?: string | null;

  @Column({ type: 'varchar', enum: TokensStorageHistoryTypes, default: TokensStorageHistoryTypes.loyaltyProject })
  type!: TokensStorageHistoryTypes;

  @ManyToOne(() => TokensStorage, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  tokenSotrage?: TokensStorage;
  @Column({ nullable: false })
  tokenSotrageId?: number;

  @ManyToOne(() => LoyaltyProject, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  loyaltyProject?: LoyaltyProject;
  @Column({ nullable: true })
  loyaltyProjectId?: number;

  @CreateDateColumn()
  createdAt!: Date;
}
