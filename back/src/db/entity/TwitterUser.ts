import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Investor } from './Investor';

@Entity()
export class TwitterUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
  })
  twitterId!: string;

  @Column('varchar', { nullable: false })
  twitterUsername!: string;

  @Column('varchar')
  oauthAccessToken!: string;

  @Column('varchar')
  oauthAccessTokenSecret!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Investor, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;
}
