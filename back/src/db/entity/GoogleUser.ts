import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { encrypt } from '../helpers';

import { Investor } from './Investor';

@Entity()
export class GoogleUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar')
  googleId!: string;

  @Column('varchar')
  googleUsername!: string;

  @Column('varchar', {
    transformer: encrypt,
  })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Investor, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;
}
