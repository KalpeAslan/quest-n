import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { encrypt } from '../helpers';

import { Investor } from './Investor';

@Entity()
export class EmailUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
    transformer: encrypt,
  })
  email!: string;

  @Column('varchar', {
    transformer: encrypt,
  })
  password!: string;

  @Column('boolean', { default: false })
  confirmed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Investor, { nullable: true, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  investor?: Investor;
  @Column({ nullable: true })
  investorId?: number;
}
