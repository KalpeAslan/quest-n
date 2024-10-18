import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { encrypt } from '../helpers';

import { Investor } from './Investor';

@Entity()
export class TwoFactorAuth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('boolean', { default: false })
  confirmed!: boolean;

  @Column('varchar', {
    transformer: encrypt,
  })
  phoneNumber!: string;

  @OneToOne(() => Investor, { nullable: false, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;
}
