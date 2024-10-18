import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { encrypt } from '../helpers';
import { Investor } from './Investor';

@Entity('wallet_user')
export class WalletUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
    transformer: encrypt,
    nullable: false,
  })
  address!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Investor, {
    nullable: false,
    cascade: true,
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;
}
