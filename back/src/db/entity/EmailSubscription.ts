import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { encrypt } from '../helpers';

@Entity()
export class EmailSubscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('varchar', {
    unique: true,
    transformer: encrypt,
  })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
