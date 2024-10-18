import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShortLink {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: false,
  })
  shortLink!: string;

  @Column('varchar', {
    unique: false,
  })
  source!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
