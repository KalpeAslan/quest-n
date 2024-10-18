import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { TelegramUser } from './TelegramUser';
import { TokensStorage } from './TokensStorage';
import { DiscordUser } from './DiscordUser';
import { TwitterUser } from './TwitterUser';
import { DiscordToken } from './DiscordTokens';
import { GoogleUser } from './GoogleUser';
import { EmailUser } from './EmailUser';
import { TwoFactorAuth } from './TwoFactorAuth';
import { TwoFactorCodeSendHistory } from './TwoFactorCodeSendHistory';
import { PhoneUser } from './PhoneUser';
import { PartnerProject } from './PartnerProject';
import { WalletUser } from './WalletUser';
import { GameSession } from '../types/interfaces/investor';
import { ExperienceLevel } from './ExperienceLevel';

@Entity()
export class Investor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
    nullable: false,
    default: () => 'uuid_generate_v4()',
  })
  analytics_id!: string;

  @Column('varchar', {
    unique: true,
    nullable: true,
  })
  username!: string | null;

  @Column('jsonb', { default: [] as GameSession[], unique: false })
  gamesSessions!: GameSession[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToOne(() => TwitterUser, (tt) => tt.investor, { onDelete: 'CASCADE' })
  twitterUsers!: TwitterUser;

  @OneToOne(() => DiscordUser, (du) => du.investor, { onDelete: 'CASCADE' })
  discordUser!: DiscordUser;

  @OneToOne(() => DiscordToken, (dt) => dt.investor, { onDelete: 'CASCADE' })
  discordTokens!: DiscordToken;

  @OneToOne(() => TelegramUser, (tu) => tu.investor, { onDelete: 'CASCADE' })
  telegramUser!: TelegramUser;

  @OneToOne(() => TokensStorage, (ts) => ts.investor, { onDelete: 'CASCADE' })
  tokensStorage!: TokensStorage;

  @OneToOne(() => GoogleUser, (gu) => gu.investor, { onDelete: 'CASCADE' })
  googleUser!: GoogleUser;

  @OneToOne(() => EmailUser, (eu) => eu.investor, { onDelete: 'CASCADE' })
  emailUser!: EmailUser;

  @OneToOne(() => PhoneUser, (pu) => pu.investor, { onDelete: 'CASCADE' })
  phoneUser!: PhoneUser;

  @OneToOne(() => WalletUser, (wu) => wu.investor, { onDelete: 'CASCADE' })
  walletUser!: WalletUser | null;

  @OneToOne(() => TwoFactorAuth, (tfa) => tfa.investor, { onDelete: 'CASCADE' })
  twoFactorAuth!: TwoFactorAuth;

  @OneToMany(() => TwoFactorCodeSendHistory, (tfa) => tfa.investor)
  twoFactorCodeSendHistory!: TwoFactorCodeSendHistory[];

  @OneToOne(() => ExperienceLevel, { nullable: true, cascade: true, eager: true, onDelete: 'CASCADE' })
  @JoinColumn()
  experienceLevel?: ExperienceLevel;
  @Column({ nullable: true })
  experienceLevelId?: number;

  @OneToMany(() => PartnerProject, (partnerProject) => partnerProject.investor)
  partnerProjects!: PartnerProject[];

  @Column('timestamp', { nullable: true })
  lastActivity!: Date;
}
