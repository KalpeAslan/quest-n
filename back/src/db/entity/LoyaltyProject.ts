import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { LoyaltyTask } from './LoyaltyTask';
import { TokensStorageHistory } from './TokensStorageHistory';
import { PartnerProject } from './PartnerProject';
import { TrendingLoyaltyProjects } from './TrendingLoyaltyProjects';
import { QuestStatus, QuestType } from '../types/interfaces/loyalty';
import { LuckyDrawProgress } from './LuckyDrawProgress.entity';

@Entity()
export class LoyaltyProject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
    nullable: true,
  })
  linkTitle!: string;

  @Column('varchar', {
    nullable: true,
  })
  title!: string;

  @Column('varchar', {
    unique: false,
  })
  projectName!: string;

  @Column('varchar', {
    // TODO: Remove after rewards feature relise
    unique: false,
    nullable: true,
  })
  backgroundImage?: string | null;

  @Column('varchar', {
    // TODO: Remove after rewards feature relise
    unique: false,
    nullable: true,
  })
  previewImage?: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  description!: string;

  @Column('varchar', {
    unique: false,
    default: '',
  })
  socialDescription!: string;

  @Column('numeric', {
    unique: true,
    default: null,
    nullable: true,
  })
  sortOrder!: number;

  @Column('timestamp', { nullable: true })
  startAt!: Date;

  @Column('timestamp', { nullable: true })
  endAt!: Date;

  @Column('timestamp', { nullable: true })
  claimingStartAt!: Date;

  @Column('timestamp', { nullable: true })
  claimingEndAt!: Date;

  @Column('boolean', { default: true })
  featured: boolean;

  @Column('varchar', { nullable: true })
  preview_img: string | null;

  @Column('boolean', { default: true })
  visible: boolean;

  @Column('numeric', { nullable: true, default: null })
  threshold?: number | null;

  @Column('numeric', { nullable: true, default: null })
  eligibleUsersCount?: number | null;

  @Column({
    type: 'varchar',
    default: QuestType.Scoreboard,
  })
  projectType: QuestType;

  @Column({
    type: 'varchar',
    nullable: true,
    default: null,
  })
  questStatus: QuestStatus;

  @OneToMany(() => LoyaltyTask, (lt) => lt.loyaltyProject)
  loyaltyTasks?: LoyaltyTask[];

  @OneToMany(() => TokensStorageHistory, (tsh) => tsh.loyaltyProject)
  tokensStorageHistories!: TokensStorageHistory[];

  @OneToMany(() => TrendingLoyaltyProjects, (tsh) => tsh.loyaltyProject)
  trendingLoyaltyProjects!: TrendingLoyaltyProjects[];

  @ManyToMany(() => PartnerProject, (partnerProject) => partnerProject.loyaltyProjects)
  @JoinTable()
  partnerProjects!: PartnerProject[];

  @OneToMany(() => LuckyDrawProgress, (qp) => qp.loyaltyProject)
  @JoinTable()
  luckyDrawProgress!: LuckyDrawProgress[];
}
