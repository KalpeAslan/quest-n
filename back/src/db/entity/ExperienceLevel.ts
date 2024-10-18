import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class ExperienceLevel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
  })
  name!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  image!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  linkTitle!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  nftImage!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  contractAddress!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  chainId!: string;

  @Column({
    type: 'jsonb',
    array: true,
    default: () => '[]',
  })
  benefits: string[];

  @Column('numeric')
  pointsFrom!: number;

  @Column('numeric')
  pointsTo!: number;

  @Column('numeric', {
    default: 0,
  })
  bonusLuckyDrawPercentage!: number;

  @Column('numeric', {
    default: 0,
  })
  bonusPointsPercentage!: number;

  @Column('numeric', {
    default: 0,
  })
  questLimit!: number;

  @Column('numeric', {
    unique: true,
  })
  level!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
