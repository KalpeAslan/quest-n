import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Investor } from './Investor';

@Entity()
export class TelegramUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', { nullable: true })
  telegramId!: string | null;

  @Column('varchar', { nullable: true })
  telegramUsername!: string | null;

  @Column('varchar', { nullable: true, unique: true })
  tempCode!: string | null;

  @OneToOne(() => Investor, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor?: Investor;
  @Column({ nullable: false })
  investorId?: number;
}
