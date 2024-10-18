import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Contract } from './Contract';

@Entity()
export class Nft {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('numeric', {
    unique: false,
    nullable: true,
  })
  nftId!: number;

  @Column('varchar', {
    nullable: true,
  })
  image!: string;

  @Column('varchar', {
    nullable: true,
  })
  name!: string;

  @ManyToOne(() => Contract, { nullable: false, onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  contract?: Contract;
  @Column({ nullable: false })
  contractId?: number;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
