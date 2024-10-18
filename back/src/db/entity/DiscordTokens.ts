import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Investor } from './Investor';

@Entity()
export class DiscordToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  discordId!: string;

  @Column('varchar', { nullable: true })
  discordUsername!: string;

  @Column('varchar')
  accessToken!: string;

  @Column('varchar')
  refreshToken!: string;

  @Column({ type: 'numeric', unique: false })
  expiredIn!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => Investor, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor?: Investor;
  @Column({ nullable: false })
  investorId?: number;
}
