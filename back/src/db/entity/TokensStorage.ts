import { Column, Entity, JoinColumn, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Investor } from './Investor';
import { TokensStorageHistory } from './TokensStorageHistory';

@Entity()
export class TokensStorage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric', { default: 0 }) // TODO: Remove after rewards feature relise
  amount!: number;

  @OneToOne(() => Investor, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor?: Investor;
  @Column({ nullable: false })
  investorId?: number;

  @OneToMany(() => TokensStorageHistory, (tsh) => tsh.tokenSotrage)
  tokensStorageHistory!: TokensStorageHistory[];
}
