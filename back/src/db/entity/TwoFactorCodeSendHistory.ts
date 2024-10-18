import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Investor } from './Investor';

@Entity()
export class TwoFactorCodeSendHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Investor, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;
}
