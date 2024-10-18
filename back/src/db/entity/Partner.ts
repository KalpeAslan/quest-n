import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Partner {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: false,
  })
  title!: string;

  @Column('varchar', {
    unique: false,
  })
  description!: string;

  @Column('varchar', {
    unique: false,
  })
  image!: string;

  @Column('varchar', {
    unique: false,
  })
  link!: string;

  @Column('boolean', { default: true })
  status!: boolean;

  @Column('numeric', { default: 1 })
  priorityNumber!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
