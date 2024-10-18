import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Investor } from './Investor';
import { TokenType } from '../types/interfaces/loyalty';
import { TokenStandardDto } from '../types/interfaces/contractDto';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: false,
    nullable: false,
  })
  name!: string;

  @Column('varchar', {
    unique: false,
  })
  symbol!: string;

  @Column('varchar', {
    unique: false,
    nullable: true,
  })
  logo!: string | null;

  @Column('varchar', {
    nullable: true,
  })
  chainId!: string;

  @Column('boolean', { default: false })
  isVerified!: boolean;

  @Column('varchar', {
    nullable: true,
    default: null,
  })
  address!: string | null;

  @Column('varchar', {
    nullable: true,
  })
  standard!: TokenStandardDto;

  @Column('int', {
    nullable: true,
    default: null,
  })
  decimals?: number | null;

  @Column({ type: 'varchar', enum: TokenType })
  type!: TokenType;

  @ManyToOne(() => Investor, { nullable: false, cascade: false })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: true })
  investorId!: number | null;
}
