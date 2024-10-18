import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Localization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: false,
    nullable: true,
  })
  body!: string | null;

  @Column('varchar', {
    unique: false,
  })
  lang!: string;

  @Column({ nullable: false })
  objId!: string;

  @Column('varchar')
  fieldType!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
