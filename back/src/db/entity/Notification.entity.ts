import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Investor } from './Investor';
import { TNotificationTypes } from '../types/interfaces/notifications.types';

@Entity({
  name: 'notification',
})
export class NotificationEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: false,
  })
  title!: string;

  @Column('varchar')
  type!: TNotificationTypes;

  @Column('boolean', { default: false })
  viewed: boolean;

  @ManyToOne(() => Investor, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn()
  investor!: Investor;
  @Column({ nullable: false })
  investorId!: number;

  @Column('jsonb', { nullable: false, default: {} })
  payload: {
    questId?: number;
    questLinkTitle?: string;
    message: string;
  };

  @CreateDateColumn()
  createdAt!: Date;
}
