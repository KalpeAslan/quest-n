import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Investor } from './Investor';

@Entity('discord_user')
export class DiscordUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  discordId!: string;

  @Column('varchar', { nullable: true })
  discordUsername!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Investor, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;
}
