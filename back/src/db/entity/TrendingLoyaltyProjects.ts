import { Column, JoinColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { LoyaltyProject } from './LoyaltyProject';

@Entity()
export class TrendingLoyaltyProjects {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => LoyaltyProject, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  loyaltyProject!: LoyaltyProject;
  @Column({ nullable: false })
  loyaltyProjectId!: number;

  @UpdateDateColumn()
  updatedDate!: Date;
}
