import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Advertisement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    nullable: false,
    default: '',
  })
  title!: string;

  @Column({
    default: false,
  })
  icon?: boolean;

  @Column('varchar', {
    nullable: true,
    default: '',
  })
  tooltip?: string | null;

  @Column({ type: 'jsonb', nullable: true })
  items: {
    text: string;
    url?: string;
    highlighted?: boolean;
  }[];
}
