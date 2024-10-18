import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LoyaltyEvent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: false,
    nullable: true,
  })
  title!: string | null;

  @Column('varchar', {
    unique: false,
    nullable: true,
  })
  shortDescription!: string | null;

  @Column('varchar', {
    unique: false,
  })
  description!: string;

  @Column('boolean', { default: false })
  status!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
