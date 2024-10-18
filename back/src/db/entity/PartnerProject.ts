import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LoyaltyProject } from './LoyaltyProject';
import { Investor } from './Investor';

@Entity()
export class PartnerProject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
    nullable: true,
  })
  linkTitle!: string;

  @Column('varchar', {
    unique: false,
  })
  name!: string;

  @Column('varchar', {
    unique: false,
  })
  logo!: string;

  @Column('boolean', { default: true })
  verificationIcon!: boolean;

  @Column('varchar', {
    unique: false,
    nullable: true,
  })
  localizationId?: string;

  @Column('varchar', {
    unique: false,
    nullable: true,
  })
  shortDescription!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  projectDescription!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  socialDescription!: string;

  @ManyToOne(() => Investor, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  investor?: Investor;
  @Column({ nullable: true })
  investorId?: number;

  @ManyToMany(() => LoyaltyProject, (loyaltyProject) => loyaltyProject.partnerProjects)
  @JoinTable()
  loyaltyProjects!: LoyaltyProject[];
}
